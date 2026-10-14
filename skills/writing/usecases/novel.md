# 小説を書く

説明文向けの `references/` の規範は、小説にはそのまま当てはめない。

## 情報ではなく、人物に起きる経験を書く

小説の意味は設定や感情を提示しただけでは生まれない。

人物が何かを知覚して、それをある意味として受け取り、そのために次の行動や判断を変えることで、情報が経験になりそれが人を形成する。
出来事や設定を並べる文章が弱いのは箇条書きに見えるからではなく、人物の中で何も起きておらず、文同士に時間と因果がないからである。

文章を長くする場合でも、ただ単に別の情報を増やすのではなくて、同じ出来事が人物に起きるまでの時間を深くすると良い。

## 人物を一般的な性格ではなく固有の偏りとして扱う

人物は、一人称、語尾、性格ラベルだけでは成立しない。

何に気づき、何を知らず、何を言えないか。誰を守ろうとし、どの選択を避けるか。その偏りが、人物を他の人物から分けている。

AIが文章を自然に整えたり、感情を強調したりするために、この偏りを一般的な反応へ置き換えると、口調が似ていても別人になる。

特に、顔、記憶、役割、起源が似た人物を扱うときは、それらの一致を人格の同一性と混同しない。

```pseudocode
function revise(text):
  if applying_as_sentence_pattern_or_prohibition(text):
    stop("その修正で小説の何を守るのかを先に決める")

  for unit in text.units:
    if presents_only_setting_or_emotion(unit):
      rewrite_as(perception -> received_meaning -> changed_action_or_judgment)

  if need_to_lengthen(text):
    deepen_time_until_event_lands_on_character(text)  // 別の情報を足さない

  for c in text.characters:
    if replaced_by_generic_reaction(c):
      restore_bias(c)  // 気づくもの / 知らないこと / 言えないこと / 守る相手 / 避ける選択
    if similar_in(face, memory, role, origin, c, other):
      keep_identity_separate(c, other)
```
