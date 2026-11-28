# セッションにトラック、クリップ、ノートを置く

1. テンポは `session.musical.setTempoInEffectAt(bpm, 0)` で設定する。現行のビルドでは `setTempo` が失敗する。
2. 楽器ごとにモノラルのオーディオトラックを `session.newTrack({ name, trackType: 'audio', stemFormat: 'mono' })` で作り、続けて `await track.loadStrip()` を呼ぶ。
3. サンプルやステムは `session.importPath(絶対パス)` で取り込む。ファイルはエンジンが直接読む。得られるのはクリップではなくソースである。
4. クリップは 1 発ごとに `session.insertClip({ trackUid, sourceUid, startTick, stopTick, sourceStartNs: 0, sourceStopNs })` で置く。パターン全体が 1 回の取り消しで戻るように、`session.transaction(name, fn)` の中でまとめて置く。1 ステップは `Luna.TICKS_PER_BEAT / 4` ティックである。
5. クリップの長さがセッションのテンポでのサンプルの長さと等しくなるように、`stopTick = startTick + round(lengthNs / (60e9 / bpm) * Luna.TICKS_PER_BEAT)` とする。同じトラックの次の発が先に始まるときは、そこで止め、`sourceStopNs` も同じだけ縮める。長さがソースと等しいクリップはソースをそのまま再生し、それ以外の長さだと LUNA がタイムストレッチをかける。
6. 1 発ごとの音量は、クリップの `gain` ではなく、音量を変えたサンプルのソースを差し替えて表す。`clip.gain.set(dB)` は `bounce` の音に反映されない。
7. トラックのレベルは `track.gain.real.set(dB)` で決める。
8. サンプルを差し替えるときは、そのトラックのクリップを消して、新しいソースで置き直す。クリップのソースだけを入れ替える呼び出しは SDK にない。
9. MIDI のパートは Polymax のトラックにノートとして置く（[`luna-facts`](../references/luna-facts.md) の「Polymax のプリセットとノート」）。
10. 区切りがつくたびに `session.save({ label })` で保存する。
