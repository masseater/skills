# Punctuation that marks units of recognition

Punctuation is not placed for breathing when reading aloud or for the tone of speech. It is placed to show readers in what units to recognize a sentence, which phrases to connect, and where the meaning should be settled.

- Place the comma (読点, "、") at the boundary between regions with different roles
- Place the period (句点, "。") where one claim, judgment or causal relationship is complete
- Do not reflexively place a comma right after a short modifier or a contrastive phrase
- If several interpretations remain even after adding a comma, rework the word order or the sentence

## The comma

Regions with different roles are conditions, reasons, contrasts, enumerations and the main clause.

Splitting a cohesive phrase in the middle makes readers take apart and reassemble content they could recognize in one go. Joining regions with different roles without separating them makes readers guess which condition or reason applies to which conclusion.

```
ユーザーが入力した、値を検証して、問題がなければ、保存する。
→ ユーザーが入力した値を検証し、問題がなければ保存する。
```

"ユーザーが入力した値" (the value the user entered) is one region of recognition, and there is no reason to split it. In the original sentence, the commas were placed mechanically at the pauses of reading aloud, so the sequence of words is broken up. In the revised sentence, the processing that validates the value and the processing that saves it on the condition of that result are separated.

```
障害が起きた場合にデータを失わないために処理結果を先に保存する。
→ 障害が起きた場合にもデータを失わないよう、処理結果を先に保存する。
```

In the original sentence, the condition, the purpose and the main processing run together, and readers have to look for the boundaries. In the revised sentence, the region of the purpose and the region of the processing are separated.

## The period

You do not cut a sentence because it got long. Decide by whether readers can settle the meaning there.

- Do not cram independent claims into one sentence
- Do not split one causal relationship just for readability
- Do not split a contrast that can be expressed in one sentence into short sentences to stage weight or a lingering effect

A split such as "A ではない。B である" (It is not A. It is B) is staging if the two are not semantically independent.

## Reflexive commas

Many explanatory sentences in training data put a comma right after "ではなく" (not ... but). AI reflexively breaks the sentence there. In short sentences with an obvious structure, that comma has no role, and it becomes the typical AI style of pointing at every logical relationship. The same goes for "〜ではなくて、", "〜よりも、", "〜するために、" and "〜の場合は、". Unless it is needed to prevent misreading, do not place a comma right after a short modifier or contrastive phrase.

```
形式ではなく、文章が果たしている働きから判断する。
→ 形式ではなく文章が果たしている働きから判断する。
→ 形式ではなく文章の働きで判断する。
```

A contrast where both sides of "ではなく" have a predicate is a boundary between regions with different roles, so place a comma.

```
長くなったから切るのではなく、読者がそこで意味を確定できるかで決める。
```

## Pauses when reading aloud

Pauses when reading aloud can help confirm, but are not the criterion. Pauses in speech vary by speaker. The relationships of meaning that writing should make readers recognize do not change.

## Reworking

If several interpretations remain even after adding commas, do not force the reading with punctuation. Rework the word order or the sentence. Punctuation exists to make readers recognize, in the same units, the structure of meaning the writer organized. It is not something that builds structure after the fact.
