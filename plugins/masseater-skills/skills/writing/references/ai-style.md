# AI style

Sentences that do not state facts and sentences that say the same thing twice only use up the reader's time without adding to their judgment.

Use the forms here to check text you built from what you want to convey. Even if you replace just the sentence in the bad example with the shape of the good example, it will not be fixed unless what the paragraph wants to convey is decided.

- Write one fact only once
- Do not preview the role of material; write why you chose it
- Do not hype; write what you want to convey as it is
- Connect causes with conjunctions, and put the subject and the reason in one sentence
- Do not make all sentence endings the same form

## Write one fact only once

- Do not add phrasing that makes a simple claim look impressive
- Do not add sentences that merely rephrase the previous sentence
- Do not continue with paragraphs that only make the same claim. If they continue, merge them into one paragraph
- Do not write a closing wrap-up paragraph
- Do not insert self-questions such as "So what is different about ...?"
- Do not write paragraphs that copy and line up the chronology or facts of a source as they are. Showing the source in a footnote is enough
- Do not emphasize that something is your own feeling with phrasing such as "I had felt it with my hands". Readers can tell from context that it is your own feeling

Bad example:

> METR has measured that the length of tasks AI can complete on its own doubles in about four months[^metr]. Before reading this number, I had felt it with my hands.

Good example:

> METR has measured that the length of tasks AI can complete on its own doubles in about four months[^metr], and this is surely right.

## Do not preview the role of material; write why you chose it

When bringing up a case or a document, what readers want to know is why that case, and where the story comes from. A sentence that only states what the material will show, such as "can be read from ...", answers neither and states no fact.

- Write the criterion by which you chose the case first, as the result of a comparison. Write something like "decided to suspend the earliest", and do not settle for "symbolic" or "representative"
- Write the extent to which you verified the criterion. If you did not examine everything, add "among those the author checked" so that readers can gauge how firm the criterion is
- Write why you cite that document. Write why it can be used as grounds, for example that the party involved has published the circumstances
- Do not write sentences that only preview the role of the material, such as "can be read from ...", "lining up ... shows the difference" or "here the problem appears in ..."
- Do not write previews of enumerations such as "there are four reasons" or "specifically, there are three". Write the reasons directly
- When moving to a topic, placing one question that readers would have is enough; do not add justification for covering that topic, such as "unless we answer this question ..."

Bad example:

> What was happening inside the organizations that suspended their services before the fix was published can be read from the retrospective published by Codmon, a childcare ICT service.

Good example:

> Among the services the author checked, the one in Japan that decided to suspend the earliest was Codmon. The company published an article summarizing how it moved to that decision after responding, so I quote from it[^codmon-retrospective].

Bad example:

> Why are vulnerabilities found only after shipping? Serious defects are found years later in software that should have been inspected during development. Unless we answer this question, the discussion proceeds with the misunderstanding that vulnerability response is "an occasional accident caused by poor construction".

Good example:

> Why are vulnerabilities found after software is published in the first place?

## Do not hype; write what you want to convey as it is

A question such as "What separated the two?" hides what you want to convey as its answer, and is placed only to draw the reader's interest. Evaluative words such as "had already begun", "finally" or "could not stop" are the same in that they try to move the reader's feelings instead of stating facts. Write what you want to convey directly as a claim, and follow it with cases and numbers as its grounds.

- Do not hide what you want to convey behind a question
- Do not hype facts by adding evaluative words
- For the other side of a contrast, bring up only cases that fit that opposite side. Do not put an organization that responded appropriately on the side of "organizations that could not stop"

Bad example:

> This many organizations stopped their services themselves. On the other hand, some organizations could not stop. What separated the two?

Good example:

> The organizations that could suspend without waiting for the fix to be published had a structure that let them decide to suspend on the same day. At Codmon, the management members agreed in the morning on everything up to an immediate suspension, and suspended in the early afternoon when it became clear the attack would succeed[^codmon-retrospective].

The good example states the claim the paragraph wants to convey decisively in the first sentence, and follows with the case as its grounds.

You may assert what is obvious from the situation. If three competitors in the same industry all started maintenance on the same night, write it as the cause even if the announcements give no reason.

## Connect causes with conjunctions

Avoid the following forms.

- Phrasing translated literally from English, such as "〜に書いた" (wrote in ...)
- Writing that personifies tools and code ("the types tell you", "lint stops it"). Write them as events that happen, such as "it becomes a type error" or "it is detected by lint"
- Writing that folds short sentences to create a lingering effect
- Writing that chops content that could be written in one sentence into short sentences with periods
- Writing that places commas where there is no break in meaning. Follow [`punctuation`](punctuation.md) for punctuation
- Aphoristic sentences in which it is unclear who does what, such as "What is asked is ...". Write the agent
- The reveal pattern "X. That is Y."
- Emphatic constructions that hide the point until the end of the sentence, such as "What separated the two was ..." or "What did ... was ...". This form, called the cleft sentence, has the effect of pushing the point to the back ([a study of cleft sentences in news language](https://kansaigaidai.repo.nii.ac.jp/record/8109/files/r117_07.pdf)). Write claims in the ordinary word order "A is B". Do not stage a contrast with words of result such as "diverged" or "separated"
- Folding connectives with "moreover" and "and"
- Enumerations that line up service names with their roles attached ("GitLab for code hosting, Sentry for error monitoring, ...")

Bad example:

> A service you entrust your passwords to publishes all of its own source code. That is Bitwarden. The server, the client and the browser extension can all be read by anyone on GitHub. Moreover, far from hiding it, it makes it a selling point of the product.

Good example:

> The password management service Bitwarden publishes all the source code of its server, client and browser extension on GitHub[^bitwarden-github], and cites this as grounds on which users can judge that it is safe to entrust it with their passwords[^bitwarden-security].

Bad example:

> PHP2Shell is the same. The problem was in the most basic path by which PHP receives web requests, and every environment from PHP 5 onward could be affected. Code written more than a decade ago went off in 2026.

Bad example:

> Vulnerabilities always come out later. What is asked is not the quality at shipping, but whether you can keep fixing after shipping.

Connect causes with conjunctions, and write at a natural length where one sentence contains the subject and the reason.

## Do not make all sentence endings the same form

The owner has pointed out that text made only of "である" and text made only of "だ" with no "である" are both unnatural. When the same ending continues, the text looks monotonous and childish, and the common guideline is to use the same ending at most twice and not three times in a row ([EAT TREAT](https://eat-treat.jp/columns/1104)). Newspapers have more kinds of sentence endings than white papers and Diet records ([a survey by the National Institute for Japanese Language and Linguistics](https://www2.ninjal.ac.jp/past-events/2009_2021/event/specialists/project-meeting/files/JCLWorkshop_no2_papers/JCLWorkshop2012_2_25.pdf)).

- Do not use the same ending three times in a row
- End events with verbs, as in "〜した" (did) or "〜している" (is doing)
- Use "だ" and "である" for sentences that state the writer's judgment
- When changing an ending, do not just swap the final word; fix it from how the surrounding sentences are built
