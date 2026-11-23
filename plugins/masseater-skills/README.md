# masseater-skills

masseater のリポジトリで共通に使うエージェントスキルである。

## スキル

<!-- skills:start -->

- [build-explanation](skills/build-explanation/SKILL.md): 読み手が既知の情報を起点とし、次に問われる質問に答える順序で展開する解説を、読み手向けに作成するための手順書。
- [cloudflare-caution](skills/cloudflare-caution/SKILL.md): Cloudflareの料金を吊り上げるような設計は避け、コストを抑えた形式を選択しよう。
- [cognitive-load](skills/cognitive-load/SKILL.md): 持ち主に向けて報告、確認、説明を書く前に読む。
- [create-slides](skills/create-slides/SKILL.md): スライドを作成する前に、聴衆や場面に応じたデフォルト設定と聴衆からの質問に基づいて作成した構成案を提示し、作成後にプレゼンテーションの流れを確認するためのスピーカースクリプトを記述する手順。
- [daily-check](skills/daily-check/SKILL.md): Audit every masseater repository for the problems no single repository's gate catches (Cloudflare cost, CI duration, expired upstream exits, similar code, repeated corrections, convention drift) and route each finding to the thread that can fix it. Use when the daily check scheduled task fires or the owner asks for the daily check.。
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
