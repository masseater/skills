---
name: project-checklist
description: プロジェクトの設計で考慮すべき項目が満たされているか、実機を確認することで判断する。masseater/typescript-template から作成したリポジトリについては、GitHub の設定やテンプレートへの移行についても網羅する。新規リポジトリの作成時、AI への移行を完了した後、大幅な変更を行う前、および既存プロジェクトのレビュー時に活用する。
---

# project-checklist

- 各項目について、現状を確認し、満たされている条件と比較して判断する
- 各判定に、確認した箇所と結果を添付する
- 各判定を「満たしている」「不十分である」「未チェック」「該当なし」のいずれかにする
- 判定中は何も修正しない。不十分な点をリストとして渡す。修正しながら判定すると、判定は修正結果に置き換わる。

## なぜこのスキルが必要で、どのような状態にすべきか

設計で考慮すべき項目の多くが、検討しなくてもプロジェクトを動作させてしまうため、このスキルが必要となる。誰も決めなければ、デフォルトがそのまま答えとなり、ビルドやテストがパスするため、何が決まっていないかは誰にも気づかれない。問題が見つかるのは、公開後で、請求書や情報漏洩などである。

このスキルが実現すべき状態は、設計で考慮すべき項目のすべてについて、プロジェクトの現状を実機の根拠で説明できることである。

## 判定方法

- 本番環境、ビルド出力、リポジトリのファイルという順に現状を確認する。本番環境に近いほど、意図ではなく事実を反映したものとなる。
- ポリシーや設定が書かれたからといって、「満たしている」と判定してはならない。たとえ書かれていたとしても、動作していない可能性がある。
- 数値で判定した項目は、測定値で判定する
- 対象プロジェクトの AGENTS.md や CLAUDE.md にルールがある場合は、それを満たしている条件とする。そのプロジェクトで下された決定は、一般的な基準よりも優先される。
- 確認できなかった項目は「未チェック」とし、なぜ確認できなかったのかを記述する。推測で埋めると、未チェックの内容はチェック済みの内容と区別がつかなくなる。
- 該当しない項目は「該当なし」とし、実際のプロジェクトから言える理由を記述する。理由が書けない該当しない項目は、不十分として扱う。
- チェックやリントが緩和され、それ自体が不十分として通るような兆候は該当するものとして扱う。タスクの削除、severity や ignorePatterns の緩和、抑制コメントの増加がこれに該当する。緩和された可能性のあるチェックは、他の判定の根拠として使用できない。

## 項目

以下もすべて読んでください。

- [`requirements`](references/requirements.md)。ユーザーと目的、および想定規模
- [`access`](references/access.md)。各ページとAPIの可視性、および認証と認可
- [`rendering`](references/rendering.md)。各ページのレンダリング方法
- [`data`](references/data.md)。データの保存先、スキーマの変更方法、およびキャッシュ
- [`security`](references/security.md)。シークレット、依存関係パッケージの脆弱性、レスポンスヘッダー、動的スキャンおよびレート制限
- [`cost`](references/cost.md)。1回の訪問で発生する料金、処理が終了した際の上限、および実際に請求される金額
- [`performance`](references/performance.md)。Web Vitals およびサーバーのレスポンス時間
- [`search-and-sharing`](references/search-and-sharing.md)。検索エンジンへの掲載、掲載ページの内容、およびSNSで共有した際の表示形式
- [`accessibility`](references/accessibility.md)。自動チェックで検出された違反、およびキーボード操作
- [`observability`](references/observability.md)。本番環境のリクエスト追跡、計測、および障害検知
- [`reliability`](references/reliability.md)。データ復旧、リソースの再作成、および外部呼び出しの障害
- [`delivery`](references/delivery.md)。CI とデプロイパス、ロールバック、および環境変数
- [`dependencies`](references/dependencies.md)。依存関係パッケージ、サードパーティ製資料、および Node.js バージョンの選択とライセンス
- [`privacy`](references/privacy.md)。収集される個人情報およびその削除
- [`publishing`](references/publishing.md)。公開対象の一覧、URL の変更、および削除手順
- [`testing`](references/testing.md)。各メカニズムの確認方法、およびテスト用にのみ存在する本番コード

masseater/typescript-template から作成されたリポジトリでは、以下も参照してください。

- [`typescript-template`](references/typescript-template.md)。テンプレートのスケルトンが導入され正常に動作しているか、および古い構造が残っていないか

## ユースケース

以下を参照してください。

- [`check`](usecases/check.md)。プロジェクトの現在の状態を確認し、判定する
- [`setup`](usecases/setup.md)。テンプレートから作成されたリポジトリの GitHub 側の設定を gh に合わせる
