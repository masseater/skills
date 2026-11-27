# masseater.dev での置き場所とコマンド

- 動画は masseater/masseater.dev の `apps/videos/src/pages/<名前>/` に 1 本 1 フォルダで置く。台詞は `script.ts`、カットごとの絵は `video.tsx` の `draw`。
- 共通部品と `look` の層、尺の計算、字幕、立ち絵、検査は `libs/video-kit` にある。部品の使い方はその README を読む。素材の URL とキャッシュのパスは `apps/videos/src/shared/config/stock.ts` に並べる。
- 書体は fontsource の Noto Sans JP（300、500、700、900）と IBM Plex Mono を `libs/video-kit/src/app/video.css` で読み込む。
- コマンドは `apps/videos` で `node bin/videos.ts <new|make|check|voice|assets|review|render> <名前>` を実行する。
- ナレーションは VOICEVOX エンジンを使う。手元にないときは `podman run --rm -d --name voicevox -p 127.0.0.1:50021:50021 docker.io/voicevox/voicevox_engine:cpu-latest` で起動する。クラウドのセッションでも Podman を使い、`dockerd` は起動しない（セッションの権限確認で止められる）。イメージは 2.4 GB あり、初回の pull に数分かかる。
- 立ち絵は、春日部つむぎの[公式立ち絵](https://kasukabe294.booth.pm/items/3474402)（[規約](https://tsumugi-official.studio.site/rule)：映像での商用利用と加工は可、二次配布は不可）を使う。BOOTH の取得には pixiv のログインが要るので、手元にないときは VOICEVOX エンジンが返す話者の立ち絵を `voice` と `make` がキャッシュに置いて代わりに使う。
- ずんだもんの立ち絵は [zunko.jp の公式イラスト](https://zunko.jp/con_illust.html)（[規約](https://zunko.jp/guideline.html)：広告付きの個人の YouTube は非商用として使える）を落とし、余白を切ってキャッシュに置く。
- いらすとやの絵は、検索ページから記事を開き、記事の中の `blogger.googleusercontent.com` の画像 URL を `stock.ts` に書く。URL の `s800` を `s1600` に替えると大きい絵が取れる。
- 画面写真は Playwright で紹介するツールのサイトをスマホの幅（1080×1920）で撮り、`public/cache/shots/` に置く。
- クラウドのセッションでは YouTube の動画は落とせず、yt-dlp も 403 になる。ボット判定や回数制限をクッキー、偽のクライアント、プロキシ、ミラーでくぐらない。
- 同じショートを TikTok にも載せているチャンネルは、`yt-dlp --playlist-end 3 "https://www.tiktok.com/@<ハンドル>"` で既定の設定のまま落とせる。ハンドルは YouTube のハンドルと同じことが多い。Instagram はクラウドからは 429 になる。
- TikTok に無いチャンネルは、HTML の `ytInitialData` からショートの ID を読み、`https://i.ytimg.com/vi/<ID>/oardefault.jpg` と `maxres1.jpg`〜`maxres3.jpg` を画面として使う。
- 落とした動画とそこから取った画面はスクラッチパッドだけに置き、リポジトリに入れない。
- Remotion が自分で Chrome を落とせない環境では、`REMOTION_BROWSER_EXECUTABLE` に手元の Chrome Headless Shell を渡す。
- BGM の取り先の例：[甘茶の音楽工房](https://amachamusic.chagasi.com/terms.html)（クレジット任意、Content ID 登録禁止）。
- 効果音は[効果音ラボ](https://soundeffect-lab.info/agreement/)（クレジット任意、再配布不可、効果音が主役の動画は不可）の素材を `libs/video-kit/src/shared/config/sfx.ts` に並べている。直リンクを断るので、`make` と `assets` は一覧ページを Chromium で開いてダウンロードのリンクを押す。Chromium は `BROWSER_EXECUTABLE` で渡せる。
