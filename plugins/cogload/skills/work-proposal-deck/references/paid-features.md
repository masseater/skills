# 有料機能を入れるのに要る前提

日本で個人や法人から代金を受け取るウェブサービスに有料機能を入れる前に、次がそろっている必要がある。

| 前提 | 誰が動くか | 中身 |
| --- | --- | --- |
| 料金とキャンセルの決まり | 決める | 利用規約と特定商取引法に基づく表記。事業者名、所在地、販売価格、支払方法、提供時期、キャンセルの条件を示す（[マネーフォワード](https://biz.moneyforward.com/contract/basic/10999/)） |
| 返金と問い合わせの窓口 | 決める | 誰が、いつまでに、どの経路で受けるか |
| 決済代行の契約と審査 | 待つ | 本番利用の申請で、事業の情報とサイトを審査される（[Stripe](https://support.stripe.com/questions/business-website-for-account-activation-faq?locale=ja-JP)） |
| カード決済の安全対策 | 作る | 割賦販売法がカード情報の非保持化を求める（[SMBCカード](https://www.smbc-card.com/kamei/magazine/knowledge/installment_sales.jsp)）。EC 加盟店は 2025 年 3 月末までに EMV 3-D セキュアの導入を求められた（[BUSINESS LAWYERS](https://www.businesslawyers.jp/articles/1447)） |
| インボイス対応の領収書 | 作る | 登録番号、税率ごとの金額と消費税額を載せる（[マネーフォワード](https://biz.moneyforward.com/invoice/basic/55358)） |

特定商取引法は 2027 年の通常国会に改正案が出る見通しで、最終確認画面や解約手続きの規制が強まる方向にある（[BUSINESS LAWYERS](https://www.businesslawyers.jp/articles/1586)）。資料を作る日に、法令とカード会社の案内の最新版を確かめる。
