# コードの置き場所：masseater.dev と ecosystems

masseater.dev には、masseater が動かしているものがある。個人サイト、アプリ、インフラのスタック、ツール、アプリが共有するライブラリである。Cloudflare 上で動き、main からデプロイされる。

ecosystems には、他の人や他のリポジトリが npm から取り出せるものがある。現状はツールチェーンで、リポジトリの検査（`msch`）、リンターとそのプリセット、`.fumx` のパーサー、それらに必要なライブラリである。すべて `@r_masseater/*` として公開されている。masseater.dev、mirucord、skills、非公開のリポジトリ（リポジトリ ID 1403864815）は、npm 経由でのみ使う。

## ルール

- npm から他の人が使えるパッケージは ecosystems に置く。masseater が動かすサービスと運用は masseater.dev に置く。持ち主の私的な内容は、非公開のリポジトリ（リポジトリ ID 1403864815）に置く。
- 依存は masseater.dev から ecosystems への向きだけにする。ecosystems は masseater.dev に依存せず、Cloudflare のリソースやデプロイも持たない。ecosystems が masseater.dev にあるものを必要とするときは、それを ecosystems に移す。
- サービスを作る途中で汎用的に使えそうなパッケージが出たら、まず masseater.dev の `libs/` にワークスペースのパッケージとして置く。2 つ目の利用者が現れたとき、または公開する価値がはっきりしたときに、ecosystems に移して公開する。そのあと masseater.dev はワークスペースのコピーから公開版に切り替える。それまでは公開しない。ソースが masseater.dev に残ったまま公開済みのパッケージを置かない。
- 分割が終わるまで、masseater.dev の `libs/` には ecosystems のパッケージのコピーが残っている。正本は ecosystems である。変更は ecosystems に入れ、コピーには入れない。

## 例

- 新しいリントルールやリポジトリの検査は、ecosystems の `msch` に入れる。
- 新しい Web サービスは、masseater.dev の `apps/` に置き、スタックをその隣に置く。そこから出たトレースの補助は、masseater.dev の `libs/` に置く。別のリポジトリが必要としたとき、ecosystems に移して公開する。
- 新しいファイル形式のリンターは、エンジンのパッケージ 1 つとプリセットのパッケージ 1 つとして ecosystems に入れる。
