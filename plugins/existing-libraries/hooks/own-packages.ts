import { formatOwnPackages, SEARCH_URL } from "./lib/own-packages.ts";
import { writeHookOutput } from "./lib/hook-io.ts";

const response = await fetch(SEARCH_URL, { signal: AbortSignal.timeout(10_000) });
if (!response.ok) throw new Error(`existing-libraries: npm search returned ${response.status}`);
const context = formatOwnPackages(await response.json());
if (context) writeHookOutput({ hookEventName: "SessionStart", additionalContext: context });
