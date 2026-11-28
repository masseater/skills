# sweep-repeated-corrections

持ち主が同じ指摘を二度する必要がない状態にする。`vp run verify` は、決定論的なチェックで検知できる箇所を捕捉する。このスイープは、すべてのリポジトリにわたって毎日残りの箇所を捕捉して修正し、見つかった箇所を可能な限り新しいチェックへと変換する。

1. 対象のリポジトリを `gh api -X GET search/repositories -f q='user:masseater archived:false fork:false' --paginate` で一覧し、ルートの AGENTS.md または CLAUDE.md が `repo-conventions` を指しているものに絞る。セッションに存在しないリポジトリがある場合は、`add_repo` で追加する。
2. 各リポジトリで、最新の `main` からブランチを作成し、`vp install` と `vp run verify` を実行して、すべての検出箇所を原因から修正する。
3. 直近の変更だけでなく、`main` ブランチ全体を読み、いかなるチェックでも判定できないものを探す。
   - ドキュメント：README、AGENTS.md、CLAUDE.md、および docs/ から、ドキュメントの規則に従い、コードを読めば分かることを削る。
   - スクリプト：複合アクションやフック内のインラインスクリプト、`node -e`、単発コマンドなど、Vite+ のタスクにすべきロジック。
   - ワークフロー：パラメータだけを変えて繰り返されるジョブやステップ（1 つのタスクかマトリクスにすべきもの）、および 1 つのワークスペースのためだけにあるジョブ。
   - 例外：off にしたルール、ignore パターン、許可リストの単語、overrides、抑止ディレクティブ、`cache: false` のそれぞれについて、外して影響するチェックを実行する。`cache: false` の場合は、タスクを 2 回実行し、2 回目の実行でキャッシュがヒットし、同じ出力が復元されることを確認する。何も失敗しなかった場合は例外を削除する。`cache: false` は、結果がリポジトリ外の状態に依存するタスクにのみ残す。
   - 類似コード：`vp run verify` の `fallow dupes` は、コピーされたコードをすでに拒否している。類似した関数は抽象化が欠けている印なので、1 つにまとめること。判定ファイル（verdict）を残さず、「意図的」として例外にもしないこと。`fallow-similar-code` が `fallow` と同じバージョンの devDependency でない場合は、追加して fallow の `ignoreDependencies` に列挙すること。fallow はその使用を認識しないためである。`vp exec fallow similar-code setup --local --yes` を実行する。オーナーはスイープ用にこのセットアップを許可している。`vp exec fallow similar-code --format json --quiet` の出力をスクラッチパッドの `similar-code.json` に保存し、各候補を `vp exec fallow similar-code inspect <candidate_id> --candidates similar-code.json` で読み込む。各ペアを、双方の呼び出し元に合う API を持つ 1 つの関数にまとめる。`similar-code-verdicts.json` が存在する場合は削除する。コマンドが候補を 1 つも出さなくなれば、このステップは完了である。
4. 決定論的なチェックで検出できたはずの箇所については、そのチェックをテストとともに [msch](github:masseater/ecosystems/libs/msch)に追加し、msch を公開した上で、各リポジトリが依存関係の更新を通じてそれを拾えるようにする。スイープが 2 度直した指摘は、欠けているチェックである。
5. 意味の単位でコミットし、リポジトリごとにプルリクエストを 1 件作成し、`vp run verify` を実行して、自分でマージする。
6. 変更内容のみを日本語で報告し、指摘の種類ごとにまとめてプルリクエストへのリンクを添える。変更がない場合は、何も報告しない。
