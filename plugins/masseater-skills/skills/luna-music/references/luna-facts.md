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

## Polymax のプリセットとノート

2026-11-28 に確かめた。

- `luna.presets.trackSelection({ category: 'Instrument', includeInstrumentPresets: true })` の `presets.items` から `isInstrumentPreset` のものを名前で選び、`session.newTrackFromPreset(preset, { name })` で MIDI トラックを作る。作ったあとに `await track.loadStrip()` を呼ぶ。
- ノートは `session.playlistFor(track).createNotes([{ pitch, startTick, stopTick, velocity }])` で置く。`session.transaction` の中で呼ぶと `busy` で失敗する。トラックごとに順に呼び、間に 600 ms 待つ。
- 1 ステップ（16 分）は `Luna.TICKS_PER_BEAT / 4` ティックである。
- プリセットが鳴らす音域は、書いた音高と一致するとは限らない。ベースの `Dusty Sub Bass` は 1〜2 オクターブ低く鳴り、`Eighties Bass` は 1 オクターブ低く鳴る（F2 を書くと 43 Hz）。実際に鳴る音高は、単音を 1 つ置いてバウンスし、スペクトルのピークで測る。
- `FM Piano 2` は FM の倍音が主になり、和音の構成音が全エネルギーの 20% しか占めない。`Curious Poses`、`Ever Explain`、`And Again`、`Cosmos` は 96〜99% が構成音に乗る。`Piano` と `Synth Bass` は無音でバウンスされた。
- ノートを入れたトラックのステムは、トラックのゲインの値がそのまま反映される。
