# security

攻撃と漏えいへの備えを確かめる。どれも欠けていても動くので、検出の仕組みで見ないと気づかない。基準は [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) と [OWASP Top 10](https://owasp.org/www-project-top-ten/) に従う。

| 確かめること | 今の状態の確かめ方 | 満たす状態 |
| --- | --- | --- |
| 秘密情報の置き場所 | gitleaks のような秘密情報の検出を、リポジトリの全履歴に掛ける | 検出が無い。秘密情報はシークレットの保管先にだけある |
| 依存の脆弱性 | パッケージマネージャーの audit を実行する | 勧告が無い。修正版の無い勧告だけが、理由つきで除外されている |
| レスポンスヘッダー | 本番の HTML を返す各ページに `curl -I` でリクエストし、CSP、HSTS、X-Content-Type-Options、Referrer-Policy、Permissions-Policy を見る | すべて付いている |
| 動的な検査 | 本番に ZAP のスキャンを掛ける | 警告も含めてアラートが無い |
| 書き込みと認証の口への大量のリクエスト | レート制限の設定を探す | 書き込み、認証、公開 API の前にレート制限がある |

全履歴に掛けるのは、消したつもりの秘密情報が過去のコミットに残るからである。
