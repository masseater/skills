# 技術スタックと自作の線引き

masseater の道具一式を「masseater エコシステム」として、完成形の状態と、自作するものと借りるものの境目を書く。新しい道具を作るか既存のものを使うかを決めるとき、技術を選ぶとき、リポジトリの構成を変えるときに読む。

完成形は向かう先である。モノレポへの統合やルートの設定ファイルの撤去のような移行は、頼まれてから行う。それまでは各リポジトリの今の決まりに従う。

## 完成形の状態

### 「欲しい」と言うだけで作られる

- ユーザーが「これが欲しい」と言えば、ユーザーの手作業なしに作られて動く。権限の付与のような手作業がいくらか残るのは許容する
- 対象は、VST などの音楽プラグイン、ゲーム、ゲームの Mod、Discord、wiki、decision モデルの研究、Unity と Blender の 3D である
- OS は作らない
- いずれは Unity や Blender に代わるものを自分で作ってもよい。その規模で作ることを許容する
- 迷ったものは、必要になったときに作る

### 決まっている選択

- 言語は TypeScript と Rust にする。C# と Python は使わず、Unity と Blender の中で要る分だけを閉じた例外にする
- 音楽プラグインの形式は VST3 を基本にする。Logic Pro は AU しか読まないので、AU を出すかは決めていない
- 決済は Stripe だけを使う。ライセンスサーバーは今は作らない
- 配布先は npm と crates.io だけにする。他は必要になったときに足す
- 3D のデータ形式は FBX・`.blend`・glTF を扱う。他は必要になったときに足す
- PC 向けのものは Windows・macOS・Linux で動かす。常駐させるものは必要になったときに作る
- Claude を使うのは claude.ai のサービスの質が良いからである。モデルは用途に応じて選び、Claude 以外のモデルも使う

### 自分専用でベンダーロックインを歓迎する

- 汎用性は求めない。自分のユースケースに特化し、他の環境のための分岐や互換は持たない
- Cloudflare、Claude、Vite+、GitHub への依存を前提にする。SaaS もロックインしてよい
- GitHub は public リポジトリなら Actions が無料で使え、Claude はクラウドの実行環境が付いてくる。この安さに乗る

### 1 つの public モノレポにまとめる

- ほぼすべてのリポジトリを 1 つの public モノレポにまとめる
- mirucord と konomi はセルフホスト用なので、別のリポジトリに残す
- personal-space と claude-workspace は private を守る決まりがあるので、public のモノレポには入れない
- ワークスペースは apps・libs・tools・infra に分ける。VST のように配布するものも apps に置く

### 設定の正は vite.config.ts だけにする

- 各リポジトリの設定の正は vite.config.ts 1 つにまとめる
- ルートに設定ファイルを置かない。`.gitignore` も置かず、vite.config.ts から `.git/info/exclude` を生成する。`.git/info/` はコミットされないので、Vite+ が `core.hooksPath` を設定するのと同じ形でルートを空けられる

### すべてを計測する

- 各コミットの前後で、すべてを計測する
- 計測した数値は、AI が自分で見て、後から引いて、次の判断に使える場所に置く

## 自作と借用の境目

### 借りるもの: 言語仕様に従う中核と、よく設計された API

- 言語仕様に従う中核は借りる。oxc の crate、tsgo、rustc、rust-analyzer、`cargo metadata` がこれにあたる
- 他人がよく設計した API は借りる。Cloudflare や Claude の API、Vite Task のキャッシュとリモートキャッシュがこれにあたる

中核は仕様が決まっていて、自分の不満が出にくい。作り直しても得るものが無く、保守だけが増える。

### 作るもの: 開発者が触る面と、つなぐ仕組み

- TypeScript と Rust を継ぎ目なく扱うモノレポ管理ツール
- Vite+ の拡張。タスクグラフに crate を載せる Cargo の提供者、実行を OTLP や Workers Logs に出す部品、`.git/info/exclude` の生成がこれにあたる
- lint と format の面。中核は oxc を借り、ルールや設定の入口を作る

作るものは自作を前提にしてよい。それ以外は、SKILL.md の手段の選び方と dont-it-yourself に従う。

作る理由は、OSS の更新フローが、影響を受ける人が多いから要るものだからである。自分用に AI で作れば、そうした手続きを踏まず、気になったときにすぐ直せる。不満が出るのは毎日触る面とつなぎ目なので、そこだけを自分の手元に置く。

### 他に手が無いときだけ: 借りたものへの手入れ

- 借りたものに拡張点が無く、上流で直る見込みも無いときだけ、フォークやパッチで手を入れる。Vite Task のグラフが `package.json` しかノードにできず拡張点も無いので、グラフの入口だけをフォークで足すのがこれにあたる
- 手を入れる範囲は足りない部分だけにする。フォークは上流との互換を保たなくてよく、取り込みたい変更が出たときだけ選んで取り込む

### 作らないもの

- OS
- 自作のプログラミング言語

## 議論の経過

2026-11-07 のプロジェクトチャットでの議論である。

1. ユーザーは、他人の OSS の更新フローに縛られず、全部自分で作って気になったらすぐ直したいと言った。いちばん要るのは TypeScript と Rust を継ぎ目なく扱えるモノレポ管理ツールで、設定の正を vite.config.ts 1 つにし、ルートの設定ファイルや `.gitignore` も無くしたい。目的は、AI がすべての計測を自分で引ける場所を作ることである
2. Vite+ 1.5.0 を調べた。Vite Task のキャッシュはプロセスの読み書きを記録するので言語を問わず、`cargo` も載る。欠けているのはグラフと計測で、ノードは `package.json` だけ、タスクの設定は未知のキーを拒み、拡張点は無い。2026 Q4 の計画である [vite-plus#3277](https://github.com/voidzero-dev/vite-plus/issues/3277) にも非 JS のワークスペースは無い。ゼロから作るより、Vite Task をフォークしてグラフの入口だけを足すのが最小だと結論した。[moon v2](https://moonrepo.dev/blog/moon-v2.0) は Rust と TS を同じグラフに載せられるが、設定がプロジェクトごとに分かれるので採らなかった
3. ユーザーはベンダーロックインを歓迎し、汎用性より自分のユースケースへの特化を選んだ。これでフォークは上流との互換を保たなくてよくなり、リモートキャッシュは自分の Cloudflare に置き、計測は Workers Logs に送る前提で組めるようになった
4. 全部を自作する人の事例を調べた。うまくいった例は、自作する範囲を本業の核心に絞っている。Jonathan Blow は言語を作り、その上で 10 年かけてゲームを出した。Andreas Kling は SerenityOS の「全部自前」を Ladybird でやめ、グラフィックスや音声をライブラリに任せた。破綻した例は、道具づくりそのものが目的になったか、本人しか回せない状態で止まっている。TempleOS や Handmade Hero がこれにあたる。AI 時代の例では、Mario Zechner が Claude Code の変化に振り回されないよう最小のエージェント pi を自作し、Armin Ronacher は [pi で pi を直す運用](https://lucumr.pocoo.org/2026/5/24/pi-oss/)をしている。一方で Ronacher は[作るのが簡単になりすぎて磨き込みが追いつかない](https://lucumr.pocoo.org/2026/1/18/agent-psychosis/)とも書き、[Personal software factories are a waste of time](https://www.peterp.me/articles/personal-software-factories-are-a-waste-of-time/) は作るもの自体が無いまま工場を作り続ける罠を指摘している
5. 事例を受けて、中核は借り、開発者が触る面とつなぐ仕組みだけを作るという境目に決めた。自作の言語は範囲の外とした
6. ユーザーは、ロックインを SaaS にも広げた。GitHub は public なら Actions が無料で、Claude はクラウド環境が付いてくるので、どちらも安すぎるという理由である。この前提で道具を組んだ全体を「masseater エコシステム」と呼ぶことにした
7. 範囲を聞き取った。C# と Python は嫌いなので Unity と Blender の中だけの例外とし、将来は Unity や Blender に代わるものを作る規模まで許容した。VST3 で macOS 向けに困るかという問いには、VST3 は macOS でも動くが Logic Pro は AU しか読まないと答えた。Rust の [nih-plug](https://github.com/robbert-vdh/nih-plug) は VST3 と CLAP を出せ、AU は別のラッパーが要る。決済は Stripe だけ、配布先は npm と crates.io だけ、データ形式は FBX・`.blend`・glTF、OS は Windows・macOS・Linux とし、どれも足りなくなったら足す。分からないものは必要になったときに作ると決めた
