# masseater.devでの置き場所とコマンド

- 動画はmasseater/masseater.devの`apps/videos/src/pages/<名前>/`に1本1フォルダで置く。台詞は`script.ts`、カットごとの絵は`video.tsx`の`draw`。
- 共通部品と`look`の層、尺の計算、字幕、立ち絵、検査は`libs/video-kit`にある。部品の使い方はそのREADMEを読む。素材のURLとキャッシュのパスは`apps/videos/src/shared/config/stock.ts`に並べる。
- 書体はfontsourceのNoto Sans JP（300、500、700、900）とIBM Plex Monoを`libs/video-kit/src/app/video.css`で読み込む。
- コマンドは`apps/videos`で`node bin/videos.ts <new|make|check|voice|assets|review|render> <名前>`を実行する。
- ナレーションはVOICEVOXエンジンを使う。手元にないときは`podman run --rm -d --name voicevox -p 127.0.0.1:50021:50021 docker.io/voicevox/voicevox_engine:cpu-latest`で起動する。クラウドのセッションでもPodmanを使い、`dockerd`は起動しない（セッションの権限確認で止められる）。イメージは2.4 GBあり、初回のpullに数分かかる。
- 立ち絵は、春日部つむぎの[公式立ち絵](https://kasukabe294.booth.pm/items/3474402)（[規約](https://tsumugi-official.studio.site/rule)：映像での商用利用と加工は可、二次配布は不可）を使う。持ち主が渡した公式立ち絵v2.0のPNGを`public/cache/tachie/tsumugi.png`に置いて使う。BOOTHの取得にはpixivのログインが要るので、手元にないときはVOICEVOXエンジンが返す話者の立ち絵を`voice`と`make`がキャッシュに置いて代わりに使う。
- ずんだもんの立ち絵は[zunko.jpの公式イラスト](https://zunko.jp/con_illust.html)（[規約](https://zunko.jp/guideline.html)：広告付きの個人のYouTubeは非商用として使える）を落とし、余白を切ってキャッシュに置く。
- いらすとやの絵は、検索ページから記事を開き、記事の中の`blogger.googleusercontent.com`の画像URLを`stock.ts`に書く。URLの`s800`を`s1600`に替えると大きい絵が取れる。
- 画面写真はPlaywrightで紹介するツールのサイトをスマホの幅（1080×1920）で撮り、`public/cache/shots/`に置く。
- クラウドのセッションではYouTubeの動画は落とせず、yt-dlpも403になる。ボット判定や回数制限をクッキー、偽のクライアント、プロキシ、ミラーでくぐらない。持ち主のPCのRemote Controlで、yt-dlpの既定の設定のまま落とす。
- 同じショートをTikTokにも載せているチャンネルは、`yt-dlp --playlist-end 3 "https://www.tiktok.com/@<ハンドル>"`で既定の設定のまま落とせる。ハンドルはYouTubeのハンドルと同じことが多い。Instagramはクラウドからは429になる。
- TikTokに無いチャンネルは、HTMLの`ytInitialData`からショートのIDを読み、`https://i.ytimg.com/vi/<ID>/oardefault.jpg`と`maxres1.jpg`〜`maxres3.jpg`を画面として使う。
- 落とした動画とそこから取った画面はスクラッチパッドだけに置き、リポジトリに入れない。
- Remotionが自分でChromeを落とせない環境では、`REMOTION_BROWSER_EXECUTABLE`に手元のChrome Headless Shellを渡す。
- 既定のBGMは`src/shared/config/stock.ts`の`BGM`（しゃろう「Anyone in 2025?」ループ版、148BPM、最初の拍は0.395秒、`BGM_BEAT`）。[利用条件](https://dl.tracks.co.jp/l?m=77c53d)は商用可・クレジット任意で、Content IDへの登録と音源の再配布を禁じる。配布ページで利用条件に同意してから落とす形なので、`bgm`に`page`を書くと`make`がChromiumで同意して落とす。持ち主は2026-11-27にこの利用条件への同意を認めた。
- ほかのBGMの取り先の例：[甘茶の音楽工房](https://amachamusic.chagasi.com/terms.html)（クレジット任意、Content ID登録禁止）。
- 効果音は[効果音ラボ](https://soundeffect-lab.info/agreement/)（クレジット任意、再配布不可、効果音が主役の動画は不可）の素材を`libs/video-kit/src/shared/config/sfx.ts`に並べている。直リンクを断るので、`make`と`assets`は一覧ページをChromiumで開いてダウンロードのリンクを押す。Chromiumは`BROWSER_EXECUTABLE`で渡せる。
