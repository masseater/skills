# masseater.dev での置き場所とコマンド

- 動画は masseater/masseater.dev の `apps/videos/src/pages/<名前>/` に 1 本 1 フォルダで置く。台詞は `script.ts`、カットごとの絵は `video.tsx` の `draw`。
- 共通部品（`Headline`、`Tags`、`Points`、`Rating`、`Terminal`、`Label`、`Credits`、`Sfx`）と、尺の計算、字幕、立ち絵、検査は `libs/video-kit` にある。部品の使い方はその README を読む。
- 書体は fontsource の Noto Sans JP（700 と 900）と IBM Plex Mono を `libs/video-kit/src/app/video.css` で読み込む。
- コマンドは `apps/videos` で `node bin/videos.ts <new|make|check|voice|assets|review|render> <名前>` を実行する。
- ナレーションは VOICEVOX エンジンを使う。手元にないときは `podman run --rm -d --name voicevox -p 127.0.0.1:50021:50021 docker.io/voicevox/voicevox_engine:cpu-latest` で起動する。クラウドのセッションでも Podman を使い、`dockerd` は起動しない（セッションの権限確認で止められる）。イメージは 2.4 GB あり、初回の pull に数分かかる。
- 立ち絵は、春日部つむぎの[公式立ち絵](https://kasukabe294.booth.pm/items/3474402)（[規約](https://tsumugi-official.studio.site/rule)：映像での商用利用と加工は可、二次配布は不可）を使う。BOOTH の取得には pixiv のログインが要るので、手元にないときは VOICEVOX エンジンが返す話者の立ち絵を `voice` と `make` がキャッシュに置いて代わりに使う。
- Remotion が自分で Chrome を落とせない環境では、`REMOTION_BROWSER_EXECUTABLE` に手元の Chrome Headless Shell を渡す。
- BGM の取り先の例：[甘茶の音楽工房](https://amachamusic.chagasi.com/terms.html)（クレジット任意、Content ID 登録禁止）。
- 効果音は[効果音ラボ](https://soundeffect-lab.info/agreement/)（クレジット任意、再配布不可、効果音が主役の動画は不可）の素材を `libs/video-kit/src/shared/config/sfx.ts` に並べている。直リンクを断るので、`make` と `assets` は一覧ページを Chromium で開いてダウンロードのリンクを押す。Chromium は `BROWSER_EXECUTABLE` で渡せる。
