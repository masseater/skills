# masseater.dev での置き場所とコマンド

- 動画は masseater/masseater.dev の `apps/videos/src/pages/<名前>/` に 1 本 1 フォルダで置く。台本は `video.md`、取り出したシーンは `scenes/<シーン ID>.tsx`。
- シーンの見た目、台本の読み込み、台本の検査は `libs/video-kit` にある。台本の書き方はその README を読む。
- コマンドは `apps/videos` で `node bin/videos.ts <new|make|check|voice|assets|review|eject|render> <名前>` を実行する。`eject` だけはシーン ID も渡す。
- ナレーションは VOICEVOX エンジンを使う。手元にないときは `docker run --rm -d -p 50021:50021 voicevox/voicevox_engine:cpu-latest` で起動する。クラウドのセッションでは先に `dockerd` を起動する。
- Remotion が自分で Chrome を落とせない環境では、`REMOTION_BROWSER_EXECUTABLE` に手元の Chrome Headless Shell を渡す。
- BGM の取り先の例：[甘茶の音楽工房](https://amachamusic.chagasi.com/terms.html)（クレジット任意、Content ID 登録禁止）。効果音は[効果音ラボ](https://soundeffect-lab.info/agreement/)（クレジット任意、効果音が主役の動画は不可）。
