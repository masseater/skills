# Workers の処理を日本に寄せる

Workers には選べるリージョンがない。ここでの各ステップは処理を日本へ寄せるもので、どれも日本で動くことを保証しない。ステップごとに確かめること。

## ステップを選ぶ

条件に当てはまるステップだけを行う。

- 日本の API やデータベースとの往復を短くしたいなら、A を行う。
- Durable Object の状態を日本の利用者の近くに置きたいなら、B を行う。
- cron やキューのハンドラが日本のサービスを呼んで、拒否やタイムアウトが起きているなら、B と C を行う。
- 相手のサーバーが日本の IP アドレスからの通信しか受け付けないなら、D を行う。A から C では解決しない。分からないときは、先に A から C を行い、`403` が残るかを見る。
- 法令や契約でデータを日本に保存することが求められているなら、Durable Object では保証できない。日本のリージョンを選べる外部のデータベースを使う。

## A. Worker を日本で動かす

`alchemy.run.ts` で Worker または `Website.Vite` の props に `placement` を足し、スタック全体をデプロイする。段階的なロールアウト（バージョンだけを出す方式）では `placement` は反映されない。

```ts
const worker = yield* Website.Vite("Api", {
  name: "my-api",
  placement: { region: "aws:ap-northeast-1" },
});
```

- `region` は `{クラウド}:{リージョン}` の形である。`aws:ap-northeast-1` のほか、`gcp:asia-northeast1` や `azure:japaneast` でもよい。
- 相手がクラウドの外にあるなら、`placement: { host: "db.example.jp:5432" }`（TCP）か `placement: { hostname: "api.example.jp" }`（HTTP）を使う。Cloudflare が遅延を測って近い場所を選ぶ。どちらも実験的な機能である。
- `placement` が効くのは fetch ハンドラだけである。`scheduled`、`queue`、RPC メソッド、名前付きエントリポイント、静的アセットは、どこで動いてもおかしくない。

`curl -sI <Worker の URL> | grep -i cf-placement` で確かめる。`remote-NRT` など日本のコードなら成功である。`local-XXX` はリクエストを受けた場所で動いたことを、ヘッダがないことは設定が反映されていないことを表す。このヘッダは Cloudflare が廃止する可能性がある。`request.cf?.colo` を返す確認用のルートも足し、本番に残すなら認証の内側に置く。

## B. Durable Object を日本に置く

`locationHint: "apac-ne"` は、`alchemy.run.ts` ではなく、Durable Object を取り出す `get()` に渡す。

```ts
const stub = env.MY_OBJECT.get(env.MY_OBJECT.idFromName("my-object#0"), {
  locationHint: "apac-ne",
});
```

```ts
const stub = objects.getByName("my-object#0", { locationHint: "apac-ne" });
```

`apac-ne` は北東アジア、`apac-se` は東南アジア、`apac` はアジア太平洋全体である。日本向けは `apac-ne` を使う。

- ヒントが効くのは、その名前の Durable Object が初めて作られるときだけである。既存の名前に足しても動かない。新しい名前で作る。
- 名前の末尾に `#0` のような世代番号を付ける。Durable Object は動かないので、日本以外に作られたものは新しい名前で作り直すしかない。
- ヒントは保証ではない。2026-11 の計測では、`apac-ne` を指定したものが東京と大阪のほか、ソウル（`ICN`）にも作られた。
- 日本に限定する jurisdiction はない。[jurisdiction](https://developers.cloudflare.com/durable-objects/reference/data-location/) は `eu`、`us`、`fedramp` だけである。

Durable Object の中から `/cdn-cgi/trace` を取得し、`colo=` を見て確かめる。`NRT`、`KIX`、`ITM`、`FUK`、`OKA` が日本である。Durable Object は動かないので、値は一度だけ取得して Durable Object の storage に保存する。

```ts
const trace = await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text();
const colo = /^colo=(\w+)$/m.exec(trace)?.[1];
```

## C. cron とキューの通信を日本から出す

日本に作った Durable Object が、cron やキューのハンドラに代わって外部へ送る。Durable Object は自分の `colo` を確かめ、日本でなければ `421` で断る。呼ぶ側は次の世代を作って送り直す。断った時点では何も送っていないので、送り直しても二重に送らない。

1. `src/egress-gate.ts` を作る。

   ```ts
   import { DurableObject } from "cloudflare:workers";

   const JAPAN = new Set(["NRT", "KIX", "ITM", "FUK", "OKA"]);
   export const MISPLACED = "x-egress-misplaced";

   export class EgressGate extends DurableObject {
     async fetch(request: Request): Promise<Response> {
       let colo = await this.ctx.storage.get<string>("colo");
       if (colo === undefined) {
         const trace = await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text();
         colo = /^colo=(\w+)$/m.exec(trace)?.[1] ?? "unknown";
         await this.ctx.storage.put("colo", colo);
       }
       if (!JAPAN.has(colo)) {
         console.warn(JSON.stringify({ event: "egress_misplaced", colo }));
         return new Response(colo, { status: 421, headers: { [MISPLACED]: colo } });
       }
       return fetch(request);
     }
   }
   ```

2. Worker のエントリファイルから export する。Durable Object のクラスはエントリから export したものしか使えない。

   ```ts
   export { EgressGate } from "./egress-gate.ts";
   ```

3. `alchemy.run.ts` の `env` に binding を足す。migration は Alchemy が作る。`Env` の型を手で書いているなら、`EGRESS_GATE: DurableObjectNamespace<EgressGate>` も足す。

   ```ts
   EGRESS_GATE: Workers.DurableObject("EgressGate", { className: "EgressGate" }),
   ```

4. `src/fetch-from-japan.ts` を作る。Durable Object の名前は、相手のホスト名と世代番号をつないだものにする。

   ```ts
   import { MISPLACED } from "./egress-gate.ts";

   const GENERATIONS = 5;

   export async function fetchFromJapan(env: Env, request: Request): Promise<Response> {
     const host = new URL(request.url).host;
     for (let generation = 0; generation < GENERATIONS; generation++) {
       const id = env.EGRESS_GATE.idFromName(`${host}#${generation}`);
       const stub = env.EGRESS_GATE.get(id, { locationHint: "apac-ne" });
       const response = await stub.fetch(request.clone());
       if (!response.headers.has(MISPLACED)) return response;
     }
     throw new Error(`no Durable Object in Japan for ${host}`);
   }
   ```

5. cron とキューのハンドラにある外部への `fetch` を、すべて `fetchFromJapan(env, new Request(url))` に置き換える。Effect の `HttpClient` を使っているなら、呼び出し箇所は変えず、`FetchHttpClient.Fetch` を `(input, init) => fetchFromJapan(env, new Request(input, init))` に差し替えたレイヤーを渡す。

6. デプロイし、cron を待つか、同じ処理を呼ぶルートを叩いて、Worker のログから `egress_misplaced` を検索する。
   - `egress_misplaced` がなく、応答が正常なら、完了である。
   - `egress_misplaced` のあとに正常な応答があるなら、0 世代目が日本以外に作られ、あとの世代で成功している。想定どおりである。
   - `no Durable Object in Japan` のエラーが出たなら、5 世代すべてが日本以外に作られた。`GENERATIONS` を増やすか、名前の接頭辞を変えて作り直す。
   - 送信は正常なのに相手が `403` を返すなら、送信元 IP の国で拒否されている可能性が高い。D を行う。

運用の決まり。

- 日本かどうかは `colo=` で判定し、`loc=` は使わない。日本で動いていても `loc=US` になる。
- 通信が 1 つの Durable Object に集中しないよう、名前に相手のホスト名を入れて相手ごとに分ける。
- 日本に置けた世代をモジュールスコープの `Map` に覚えて、次はそこから始める。毎回 0 世代目から試すと、無駄な往復が増える。
- 外部への通信 1 回が Durable Object のリクエスト 1 回になり、fetch の間は 128 MB 分の時間が課金される。2026-11-27 時点の[料金](https://developers.cloudflare.com/durable-objects/platform/pricing/)は、月に 100 万リクエストと 40 万 GB-s までが含まれ、超えると 100 万リクエストあたり 0.15 ドル、100 万 GB-s あたり 12.50 ドルである。作る前に月あたりの呼び出し回数を見積もる。

## D. 送信元 IP を日本にする

Workers と Durable Object が外部へ送る通信は、Cloudflare が共有する IP アドレスから出る（[仕組み](https://blog.cloudflare.com/cloudflare-servers-dont-own-ips-anymore/)）。その IP の国は、動いたデータセンターの国と一致しない。2026-11 の計測では、東京と大阪のデータセンターから出た通信も `loc=US` と判定された。相手が日本以外の IP を拒否しているなら、A から C を行っても通らない。

C の Durable Object の中から `/cdn-cgi/trace` を取得し、`ip=` と `loc=` を見て確かめる。相手が使う IP 位置情報のデータベースは Cloudflare のものと違うことがあるので、`ip=` の値を一般の IP 位置情報サービスでも調べる。

送信元 IP の固定は、コードだけでは実現できない。

- [Dedicated CDN Egress IPs](https://developers.cloudflare.com/smart-shield/configuration/dedicated-egress-ips/) は、Worker の `fetch()` を専用の IP から出す。`connect()` は対象外である。日本の IP を割り当ててもらえるかは Cloudflare に問い合わせる。Enterprise の追加契約が要る。
- [Regional Services](https://developers.cloudflare.com/data-localization/regional-services/) は、自分のドメインへのリクエストを、Japan や ISMAP など指定した地域でだけ処理する。外部への通信の IP まで日本にするなら、上の専用 IP も要る。Enterprise の [Data Localization Suite](https://developers.cloudflare.com/data-localization/) が要る。
- AWS の東京リージョンなど、日本のクラウドに置いた固定 IP の中継は、プランを問わず使える。Worker から外部への通信をそこ経由にし、第三者が使えないよう認証を付ける。

Enterprise 契約がなければ、中継を使う。

## やってはいけないこと

- `loc=` で、日本で動いているかを判定する。
- 既存の Durable Object の名前に `locationHint` を足して、場所が変わったと考える。
- `placement` を設定しただけで、cron やキューも日本で動くと考える。
- 日本以外に作られた Durable Object から、そのまま外部に送り、日本から送ったことにする。
- 中継を認証なしで公開する。
