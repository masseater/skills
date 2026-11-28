# LUNA のセッションにドラムパターンを組む

1. コードを書く前に、テンポ、長さ、パターンを 16 分音符のステップで決める。パターンはデータとして書く。トラックごとに各小節のステップ番号を並べ、裏のステップに掛けるスウィングの量を添える。
2. テンポは `session.musical.setTempoInEffectAt(bpm, 0)` で設定する。現行のビルドでは `setTempo` が失敗する。
3. 楽器ごとにモノラルのオーディオトラックを `session.newTrack({ name, trackType: 'audio', stemFormat: 'mono' })` で作り、続けて `await track.loadStrip()` を呼ぶ。
4. サンプルは `session.importPath(絶対パス)` で取り込む。ファイルはエンジンが直接読む。得られるのはクリップではなくソースである。
5. クリップは 1 発ごとに `session.insertClip({ trackUid, sourceUid, startTick, stopTick, sourceStartNs: 0, sourceStopNs })` で置く。パターン全体が 1 回の取り消しで戻るように、`session.transaction(name, fn)` の中でまとめて置く。1 ステップは `Luna.TICKS_PER_BEAT / 4` ティックである。スウィングするステップは、ステップの何分の一かだけ遅らせる。
6. クリップの長さがセッションのテンポでのサンプルの長さと等しくなるように、`stopTick = startTick + round(lengthNs / (60e9 / bpm) * Luna.TICKS_PER_BEAT)` とする。同じトラックの次の発が先に始まるときは、そこで止め、`sourceStopNs` も同じだけ縮める。長さがソースと等しいクリップはソースをそのまま再生し、それ以外の長さだと LUNA がタイムストレッチをかける。
7. グルーヴのための 1 発ごとの音量の揺らぎ（ベロシティ）は、クリップの `gain` ではなく、音量を変えたサンプルのソースを 1 発ごとに差し替えて表す。`clip.gain.set(dB)` は値を保存するが、`bounce` の音には反映されない。揺らぎは、拍の頭を強く、裏を弱くするアクセントに、シード固定の乱数（±1〜2 dB）を足し、0.5 dB に丸める。音量違いのソースは `ffmpeg -af volume=<dB>dB` で作り、`pcm_f32le` で書いてクリップを避ける。クリップと音量の対応は plan（JSON）に残す。
8. トラックのレベルは、耳ではなく、ステムを測ってから `track.gain.real.set(dB)` で決める（[`verify-audio`](verify-audio.md)）。
9. サンプルを差し替えるときは、そのトラックのクリップを消して、新しいソースで置き直す。クリップのソースだけを入れ替える呼び出しは SDK にない。
10. ワンショットは取り込む前に固定の長さに切り、フェードをかける。`ffmpeg` の `atrim` と `afade` を使い、`volume` でピークを決まった値にそろえ、48 kHz のモノラルにする。
