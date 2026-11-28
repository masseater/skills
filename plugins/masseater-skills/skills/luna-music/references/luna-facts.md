# LUNA Builder SDK のドキュメントに書かれていない事実

2026-11-28 に、SDK 3.1.2（ベータ版）と LUNA の組み合わせで確かめた。

- `ua-builder` は Add On 用（`new`、`serve`、`test`、`install`、`pack`、`probe`、`doctor`、`tree`）である。セッションを編集するコマンドはない。
- `Luna.connect()` は素の Node 22 で動き、LUNA が起動している間は `127.0.0.1:4718` のエンジンにつながる。`luna.sessions.items` は配列ではないので、`luna.session()` を使う。
- `luna.plugins.items` に出るのは、そのマシンに入っているプラグインだけである。Windows 版の LUNA にあったインストゥルメントは Polymax だけで、サンプラーもドラムマシンもなかった。
- `session.visibleTracks` は LUNA のクリックとカウントインのトラックを隠す。新しいセッションにはトラックが 1 本もない。
- `track.delete()` はクリップごとトラックを消す。`clip.delete()` は 1 つのクリップを消す。
- `session.exportMain` は MP3 のストリームを `<セッション名> - Main Output.wav` に書き、name の引数は無視される。`outputPaths` を付けた `session.bounce` は本物の WAV のステムを書き、セッションのソースには触れない。
- クリップは、ソースをそのまま再生していても `renderSourceUid` を返す。`post <セッションのパス>/get_clip_info { session_uid, clip_uid }` の `compiled_clips[0].has_tce` が、タイムストレッチを使っていなければ `false` になる。`session_uid` を付けないと `invalid_property` で失敗する。
- クリップの `gain.set(dB)` は値を保存して読み戻せるが、`session.bounce` の音には反映されない（-20 dB にしても同じ音量で出る）。`get_clip_info` の `compiled_clips[0].gain` も 0 のままである。1 発ごとの音量はソースの側で変える。
- トラックの `gain.real` の設定は正確である。変更後にバウンスしたステムが、変更分そのままの値になる。
- 既定のパンの法則は、モノラルのトラックをステム上で 3 dB 下げる。
- セッションのパッケージは `%USERPROFILE%\Documents\LUNA Sessions\<名前>` に保存される。
