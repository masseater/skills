# sweep-repeated-corrections

持ち主が同じ指摘を二度する必要がない状態にする。`vp run verify` は、決定論的なチェックで検知できる箇所を捕捉する。このスイープは、すべてのリポジトリにわたって毎日残りの箇所を捕捉して修正し、見つかった箇所を可能な限り新しいチェックへと変換する。

1. 対象のリポジトリを `gh api -X GET search/repositories -f q='user:masseater archived:false fork:false' --paginate` で一覧し、ルートの AGENTS.md または CLAUDE.md が `repo-conventions` を指しているものに絞る。セッションに存在しないリポジトリがある場合は、`add_repo` で追加する。
2. 各リポジトリで、最新の `main` からブランチを作成し、`vp install` と `vp run verify` を実行して、すべての検出箇所を原因から修正する。
3. 直近の変更だけでなく、`main` ブランチ全体を読み、いかなるチェックでも判定できないものを探す。
   - ドキュメント：README、AGENTS.md、CLAUDE.md、および docs/ から、ドキュメントの規則に従い、コードを読めば分かることを削る。
   - スクリプト：複合アクションやフック内のインラインスクリプト、`node -e`、単発コマンドなど、Vite+ のタスクにすべきロジック。
   - ワークフロー：パラメータだけを変えて繰り返されるジョブやステップ（1 つのタスクかマトリクスにすべきもの）、および 1 つのワークスペースのためだけにあるジョブ。
   - 例外：off にしたルール、ignore パターン、許可リストの単語、overrides、抑止ディレクティブ、`cache: false` のそれぞれについて、外して影響するチェックを実行する。`cache: false` の場合は、タスクを 2 回実行し、2 回目の実行でキャッシュがヒットし、同じ出力が復元されることを確認する。何も失敗しなかった場合は例外を削除する。`cache: false` は、結果がリポジトリ外の状態に依存するタスクにのみ残す。
   - 類似コード：`vp run verify` の `fallow dupes` は、コピーされたコードをすでに拒否している。類似した関数は意図的な場合があるため、ここでは verify で拒否するのではなく、判定を行う。`fallow-similar-code` が `fallow` と同じバージョンの devDependency でない場合は、それを追加し、fallow はこれが使われていることを認識しないため、fallow の `ignoreDependencies` に列挙する。`vp exec fallow similar-code setup --local --yes` を実行する。オーナーはスイープに対してこのセットアップを許可している。`vp exec fallow similar-code --format json --quiet` の出力を、スクラッチパッドの `similar-code.json` に保存する。リポジトリルートにある `similar-code-verdicts.json` で、判定結果がない候補をそれぞれ `vp exec fallow similar-code inspect <candidate_id> --candidates similar-code.json` で読み込む。2つの関数が同じ処理を行う場合は、それらをマージする。類似が意図的なものである場合は、`candidate_id`、`review_key`、および理由を添えて判定結果を `similar-code-verdicts.json` に追加する。最後に、再度ディスカバリを実行し、候補がなくなった判定結果を削除して、`vp exec fallow similar-code review --candidates similar-code.json --verdicts similar-code-verdicts.json --require-verdict-for-each-candidate` がパスすることを確認する。
4. 決定論的なチェックで検出できたはずの箇所については、そのチェックをテストとともに `masseater/masseater.dev` の msch に追加し、msch を公開した上で、各リポジトリが依存関係の更新を通じてそれを拾えるようにする。スイープが 2 度直した指摘は、欠けているチェックである。
5. 意味の単位でコミットし、リポジトリごとにプルリクエストを 1 件作成し、`vp run verify` を実行して、自分でマージする。
6. 変更内容のみを日本語で報告し、指摘の種類ごとにまとめてプルリクエストへのリンクを添える。変更がない場合は、何も報告しない。
