# リファレンスの分析に使うモデルと動かす場所

2026-11-28 に調べた。分離、MIDI 化、音色の埋め込みのモデルは月単位で入れ替わるので、使う前に新しいモデルが出ていないか調べ、出ていれば [`analyze-reference`](../usecases/analyze-reference.md) の校正で比べてから替える。

| 工程 | 使うもの | ライセンス | 動かす場所 |
| --- | --- | --- | --- |
| 分離（4 ステム） | BS-RoFormer の ONNX（[`silverdaw/bs-roformer-rhythm-onnx`](https://huggingface.co/silverdaw/bs-roformer-rhythm-onnx)、重みは ZFTurbo の MUSDB18-HQ の 4 ステム） | エクスポートは MIT、重みは学習元の条件を確かめる | onnxruntime-node。STFT はグラフの外にあるので自分で掛ける |
| 分離（ドラム） | htdemucs の ONNX（[`separate-drums`](separate-drums.md)） | MIT | onnxruntime-node |
| 分離（ギター、ピアノ） | [demucs](https://github.com/facebookresearch/demucs) の `htdemucs_6s` を other に掛ける | MIT | PC の Python |
| MIDI 化 | [MuScriptor](https://arxiv.org/abs/2607.08168)（Kyutai と Mirelo、2026-07） | コードは MIT、重みは CC-BY-NC 4.0 | PC の Python（GitHub から入れる。PyPI にはない） |
| 音色の埋め込み | [LAION-CLAP](https://huggingface.co/lukewys/laion_clap) の `music_audioset_epoch_15_esc_90.14.pt` | CC0 1.0 | PC の Python（`laion-clap`） |

- MuScriptor の重みは非商用に限られる。リファレンスを分析するためだけに使い、商用で出す曲そのものを作る工程（例：自分の演奏の録音を MIDI にして曲に使う）には使わない。
- MuScriptor の大きさは PC の GPU で決める。`nvidia-smi` が GPU を返せば large（約 1.3B）、返さなければ CPU で medium（約 300M）を使う。
- MuScriptor はフルミックスから楽器ごとの MIDI を出すが、密なミックス、珍しい音色、強く加工された音で誤る。パートごとにフルミックスとステムのどちらに掛けるかは校正で決める。
- 埋め込みの類似度は細かい楽器の違いに弱い。音色の順位は類似度だけで決めず、特徴量の差と合わせる。
- リファレンスの音声、ステム、MIDI は著作物から作ったものなので、どのリポジトリにも入れない。
