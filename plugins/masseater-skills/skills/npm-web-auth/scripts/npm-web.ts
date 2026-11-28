import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { setTimeout as wait } from "node:timers/promises";

type Options = Record<string, unknown>;
type Polled = { status: number; json: () => Promise<{ token?: string }> };
type Fetch = {
  (path: string, options: Options): Promise<Polled>;
  json: (path: string, options: Options) => Promise<Record<string, unknown>>;
};
type Failure = { statusCode?: number; body?: { authUrl?: string; doneUrl?: string } };

const USAGE = `usage: npm-web.ts <command>
  login
  claim <package-dir>...
  trust <repository> <workflow-file> <environment> <package-name>...
  deprecate <message> <package-name[@version,version]>...
env NPM_WEB_DIR holds the session token (default: $TMPDIR/npm-web)`;

const REGISTRY = process.env["NPM_WEB_REGISTRY"] ?? "https://registry.npmjs.org/";
const APPROVAL_SECONDS = 300;
const PACE_MILLISECONDS = 1500;
const dir = process.env["NPM_WEB_DIR"] ?? join(process.env["TMPDIR"] ?? "/tmp", "npm-web");
const npmrc = join(dir, "npmrc");
const npmRequire = createRequire(join(execSync("npm root -g").toString().trim(), "npm", "package.json"));
const npmFetch = npmRequire("npm-registry-fetch") as Fetch;

const say = (kind: string, text: string): void => console.log(`${new Date().toISOString()} ${kind} ${text}`);
const escaped = (name: string): string => name.replace("/", "%2f");

const optionsFor = (npmCommand: string): Options => {
  const token = /_authToken=(.+)/.exec(readFileSync(npmrc, "utf8"))?.[1]?.trim();
  return { registry: REGISTRY, forceAuth: { token }, authType: "web", npmCommand, maxSockets: 1 };
};

const approved = async (url: string, doneUrl: string, options: Options): Promise<string> => {
  say("APPROVAL", url);
  for (let waited = 0; waited < APPROVAL_SECONDS; waited += 1) {
    const polled = await npmFetch(doneUrl, { ...options, cache: false }).catch(
      (error: Failure): Polled => ({ status: error.statusCode ?? 0, json: async () => ({}) }),
    );
    if (polled.status === 200) {
      const { token } = await polled.json();
      if (token !== undefined) return token;
    }
    await wait(1000);
  }
  throw new Error(`the link was not approved within ${String(APPROVAL_SECONDS)} seconds: ${url}`);
};

let otp: string | undefined;

const write = async <T>(options: Options, action: (code: string | undefined) => Promise<T>): Promise<T> => {
  const first = await action(otp).then(
    (value) => ({ value }),
    (error: Failure) => ({ error }),
  );
  if ("value" in first) return first.value;
  const { authUrl, doneUrl } = first.error.body ?? {};
  if (authUrl === undefined || doneUrl === undefined) throw first.error;
  otp = await approved(authUrl, doneUrl, options);
  await wait(PACE_MILLISECONDS);
  try {
    return await action(otp);
  } catch (error) {
    if ((error as Failure).statusCode !== 429) throw error;
    otp = undefined;
    await wait(PACE_MILLISECONDS);
    return await write(options, action);
  } finally {
    otp = undefined;
  }
};

const send = (path: string, options: Options) => (code: string | undefined) =>
  npmFetch(path, { ...options, ...(code === undefined ? {} : { otp: code }) });

const login = async (): Promise<void> => {
  const options = { registry: REGISTRY, authType: "web", npmCommand: "login", maxSockets: 1 };
  const { loginUrl, doneUrl } = (await npmFetch.json("/-/v1/login", { ...options, method: "POST", body: {} })) as {
    loginUrl: string;
    doneUrl: string;
  };
  const token = await approved(loginUrl, doneUrl, options);
  writeFileSync(npmrc, `//registry.npmjs.org/:_authToken=${token}\n`, { mode: 0o600 });
  say("LOGGED_IN", npmrc);
};

const visible = async (name: string): Promise<void> => {
  for (;;) {
    const found = await npmFetch.json(`/${escaped(name)}`, { registry: REGISTRY, preferOnline: true }).then(
      () => true,
      () => false,
    );
    if (found) return;
    await wait(10_000);
  }
};

const claim = async (packageDir: string): Promise<void> => {
  const source = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8")) as Record<string, unknown>;
  const name = source["name"] as string;
  const manifest = {
    name,
    version: "0.0.0",
    description: "Reserves the name until the first release from CI.",
    license: source["license"],
    repository: source["repository"],
    homepage: source["homepage"],
    bugs: source["bugs"],
  };
  const placeholder = join(dir, "placeholders", escaped(name));
  mkdirSync(placeholder, { recursive: true });
  writeFileSync(join(placeholder, "package.json"), JSON.stringify(manifest, null, 2));
  writeFileSync(join(placeholder, "README.md"), `# ${name}\n\nThis version only reserves the name. Releases come from CI.\n`);
  const { publish } = npmRequire("libnpmpublish") as {
    publish: (manifest: unknown, tarball: Buffer, options: Options) => Promise<unknown>;
  };
  const pacote = npmRequire("pacote") as { tarball: (spec: string, options: Options) => Promise<Buffer> };
  const tarball = await pacote.tarball(`file:${placeholder}`, { Arborist: npmRequire("@npmcli/arborist") });
  const options = { ...optionsFor("publish"), access: "public", provenance: false };
  await write(options, (code) => publish(manifest, tarball, { ...options, ...(code === undefined ? {} : { otp: code }) }));
  say("PUBLISHED", name);
  await visible(name);
  say("VISIBLE", name);
};

const trust = async (repository: string, file: string, environment: string, name: string): Promise<void> => {
  const path = `/-/package/${escaped(name)}/trust`;
  const options = optionsFor("trust");
  const listed = await write(options, send(path, { ...options, method: "GET" })).then((response) => response.json());
  const current = listed as unknown as Array<{ id: string }> | { configs?: Array<{ id: string }> };
  const configs = Array.isArray(current) ? current : (current.configs ?? []);
  for (const { id } of configs) {
    await wait(PACE_MILLISECONDS);
    await write(options, send(`${path}/${id}`, { ...options, method: "DELETE", ignoreBody: true }));
    say("UNTRUSTED", `${name} ${id}`);
  }
  await wait(PACE_MILLISECONDS);
  const body = [
    {
      type: "github",
      claims: { repository, workflow_ref: { file }, environment },
      permissions: ["createPackage"],
    },
  ];
  await write(options, send(path, { ...options, method: "POST", body, ignoreBody: true }));
  say("TRUSTED", `${name} ${repository} ${file} ${environment}`);
};

const deprecate = async (message: string, target: string): Promise<void> => {
  const at = target.lastIndexOf("@");
  const name = at > 0 ? target.slice(0, at) : target;
  const only = at > 0 ? target.slice(at + 1).split(",") : undefined;
  const uri = `/${escaped(name)}`;
  const options = optionsFor("deprecate");
  const packument = (await npmFetch.json(uri, { ...options, query: { write: true } })) as {
    versions: Record<string, { deprecated?: string }>;
  };
  for (const version of only ?? Object.keys(packument.versions)) {
    const entry = packument.versions[version];
    if (entry === undefined) say("MISSING", `${name}@${version}`);
    else entry.deprecated = message;
  }
  await wait(PACE_MILLISECONDS);
  await write(options, send(uri, { ...options, method: "PUT", body: packument, ignoreBody: true }));
  say("DEPRECATED", target);
};

const [command, ...rest] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
if (command === "login") {
  await login();
} else if (command !== "claim" && command !== "trust" && command !== "deprecate") {
  console.error(USAGE);
  process.exit(2);
} else if (!existsSync(npmrc)) {
  throw new Error(`no session token at ${npmrc}; run login first`);
} else if (command === "claim" && rest.length > 0) {
  for (const packageDir of rest) await claim(packageDir);
} else if (command === "trust" && rest.length > 3) {
  const [repository = "", file = "", environment = "", ...names] = rest;
  for (const name of names) await trust(repository, file, environment, name);
} else if (command === "deprecate" && rest.length > 1) {
  const [message = "", ...targets] = rest;
  for (const target of targets) await deprecate(message, target);
} else {
  console.error(USAGE);
  process.exit(2);
}
say("FINISHED", command ?? "");
