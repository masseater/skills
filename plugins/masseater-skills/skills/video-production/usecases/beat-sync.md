# 台詞をBGMの拍に合わせる

1. `make`で動画を作ってから`render`し、`apps/videos/out/<名前>/`にMP4を書き出す。
2. 拍のタイムラインのページ（[Beatline](https://claude.ai/artifact/8AGmEPEFMR1zkNKoB7Lom4)）を、その動画に差し替えて公開し直す。ページの`data.json`に、BPM、最初の拍の秒、BGMの波形の山（10ミリ秒ごと）、カットと台詞の秒を書く。動画は音を抜いたMP4、音はBGMだけ（`bgm.mp3`）と台詞だけ（`voice.mp3`）に分けて置き、ページで台詞を消してBGMだけを聞けるようにする。台詞とBGMの音量は動画と同じにする。`data.json`の各台詞には、台本の`say`の文字列そのもの（`|`を含む）も書く。
3. 持ち主に、タイムラインをダブルクリックするか`M`で句を始めたい拍にマークを打ち、マークを選んで「台詞の区切り」の文字の間をクリックしてもらう。
4. マークはデータベースの`marks`に、区切りは`splits`（カットのID、台詞の番号、`|`を除いた台詞での文字の位置、マークのID）に入る。`ArtifactData`の`list`で両方を読む。
5. 区切りの位置に`|`を入れ、カットの`at`に、台詞の頭と各区切りのマークの秒を順に書く。拍に乗るマークは`onBeat(<拍>)`、動画の頭は`VIDEO_START`で書く。
6. `voice`をやり直す。区切りを拍に合わせて話す速さがVOICEVOXの0.8〜2を外れると止まるので、句を短くするか、マークを打ち直してもらう。
7. 拍に合わせた台詞と、同じ文を区切らずにカットの速さで読んだものを、[UTMOSv2](https://github.com/sarulab-speech/UTMOSv2)の自然さの点で比べる。拍に合わせた方の点が0.15以上低ければ、区切りかマークを見直す。UTMOSv2はスクラッチパッドのvenvに、`https://download.pytorch.org/whl/cpu`のCPU版torch、torchaudio、torchvisionと一緒に入れ、`utmosv2.create_model(pretrained=True, device="cpu")`の`predict(input_path=<wav>, device="cpu", num_workers=0)`で採点する。
8. `render`をやり直し、ページを新しい動画に差し替えて、持ち主に確かめてもらう。
