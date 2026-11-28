# ステムとメインを書き出す

1. トラックごとにステムを `session.bounce({ channelUids, outputPaths, range, recordPoint: 'post_pan' })` で書き出す。`outputPaths` にはトラックごとの絶対パスを渡し、範囲は `0` から `(小節数 * 4 + 1) * Luna.TICKS_PER_BEAT` とする。`outputPaths` を渡すとファイルだけが書かれ、セッションには何も加わらない。`render.done()` を待ち、さらに 1 秒ほど待ってからファイルを読む。ステムは 44.1 kHz の float の WAV である。
2. メインバスは `session.exportMain({ range })` で書き出す。ファイルはセッションのフォルダの `Exported Files` に書かれる。中身は `.wav` という名前の MP3 のストリームで、デコーダーの遅れが約 50 ms ある。全体のレベルを見るためだけに使い、タイミングには使わない。
3. セッションから全トラックのクリップを読み、開始時刻を秒にして JSON に書く。ステムと JSON は `scp` でクラウドに送る。
