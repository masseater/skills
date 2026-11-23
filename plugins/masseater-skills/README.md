# masseater-skills

masseater のリポジトリで共通に使うエージェントスキルである。

## スキル

<!-- skills:start -->

- [adopt-library-features](skills/adopt-library-features/SKILL.md): Read the release notes of the library versions masseater repositories use now and rewrite code to use new features that make it more efficient. Use when running the library feature adoption step of the daily audit.。
- [build-explanation](skills/build-explanation/SKILL.md): 読み手が既知の情報を起点とし、次に問われる質問に答える順序で展開する解説を、読み手向けに作成するための手順書。
- [check-ci-duration](skills/check-ci-duration/SKILL.md): Find CI that has become slow for good, from real GitHub Actions durations on main across all masseater repositories. Use when running the CI duration check of the daily audit.。
- [check-cloudflare-cost](skills/check-cloudflare-cost/SKILL.md): Find designs that raise the Cloudflare bill and pay-as-you-go usage with no cap across all masseater repositories, using production usage as well as code. Use when running the Cloudflare cost check of the daily audit.。
- [check-repeated-corrections](skills/check-repeated-corrections/SKILL.md): Find violations no static check catches in all masseater repositories, so the owner never has to make the same correction twice. Use when running the repeated corrections check of the daily audit.。
- [check-repo-conventions](skills/check-repo-conventions/SKILL.md): Compare every masseater repository with every viewpoint of the repo conventions and propose checks and refactors for what is not detected. Use when running the repo conventions check of the daily audit.。
- [check-similar-code](skills/check-similar-code/SKILL.md): Find similar functions across masseater repositories that should be merged or recorded as intentional, using fallow similar-code. Use when running the similar code check of the daily audit.。
- [check-upstream-exits](skills/check-upstream-exits/SKILL.md): Find upstream deviations (overrides, patches, package extensions, Cargo patches) whose exit condition is now met, from the daily msch-exits run in masseater.dev. Use when running the upstream exit check of the daily audit.。
- [cloudflare-caution](skills/cloudflare-caution/SKILL.md): Cloudflareの料金を吊り上げるような設計は避け、コストを抑えた形式を選択しよう。
- [cognitive-load](skills/cognitive-load/SKILL.md): 持ち主に向けて報告、確認、説明を書く前に読む。
- [create-slides](skills/create-slides/SKILL.md): スライドを作成する前に、聴衆や場面に応じたデフォルト設定と聴衆からの質問に基づいて作成した構成案を提示し、作成後にプレゼンテーションの流れを確認するためのスピーカースクリプトを記述する手順。
- [daily-check](skills/daily-check/SKILL.md): Run the daily audit of every masseater repository by reading and running a fixed list of check skills in order, routing findings to the threads that own them. Use when the daily check scheduled task fires or the owner asks for the daily check.。
- [debug-like-a-human](skills/debug-like-a-human/SKILL.md): AIはオーナーと同じ認証パスを通じて、ログイン後の画面やAccessの本番環境にアクセスし、自ら確認を行う。
- [desktop-app-quality](skills/desktop-app-quality/SKILL.md): デスクトップアプリの設計、開発、レビューをするときに読む。
- [find-before-build](skills/find-before-build/SKILL.md): ライブラリ、ランタイム、リポジトリに既に存在するものを探し出して利用し、自作はしない。
- [how-to-use-react](skills/how-to-use-react/SKILL.md): React 19.3のコンポーネント、ローダー、およびサーバー処理の記述、修正、レビュー時に参照する。
- [humanity-and-humanness](skills/humanity-and-humanness/SKILL.md): AIが人間の読み方、考え方、感覚を前提として持つように読む。
- [integrate](skills/integrate/SKILL.md): ライブラリや新しい実装手段を導入する際に使用する。
- [masseater-ecosystem](skills/masseater-ecosystem/SKILL.md): masseaterのリポジトリで作業する際のエントリーポイント。
- [measure-dont-guess](skills/measure-dont-guess/SKILL.md): 実装や修正を行う前に、仮説をどちらに収束させるかを判断し、実行した上で、その結果のみで判断する。
- [measure-everything](skills/measure-everything/SKILL.md): 何かを構築または修正する前に、どのように測定するかを決めておく。
- [measure-postmortem](skills/measure-postmortem/SKILL.md): PRを読み、その修正が事前に計測されていれば防げた、あるいは検出できたのではないかと検討する。
- [measure-readiness](skills/measure-readiness/SKILL.md): 後になって誰かが引きたいと思う事実が、記録され、呼び出し元に帰属され、保存されているかを監査する。
- [project-checklist](skills/project-checklist/SKILL.md): プロジェクトの設計で考慮すべき項目が満たされているか、実機を確認することで判断する。
- [repo-conventions](skills/repo-conventions/SKILL.md): masseaterのリポジトリに共通するルール。
- [simplify-repo](skills/simplify-repo/SKILL.md): リポジトリ全体を簡素化する。
- [skill-authoring](skills/skill-authoring/SKILL.md): Agent Skillsスキル（すなわち `SKILL.md` とそのディレクトリ）の作成、修正、または訂正時に読み込む。
- [vite-plus](skills/vite-plus/SKILL.md): Vite+ の `vp` でインストール、実行、確認、テストを行う。
- [writing](skills/writing/SKILL.md): 文章の執筆や修正時に読む。

<!-- skills:end -->
