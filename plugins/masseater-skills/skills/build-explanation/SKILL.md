---
name: build-explanation
description: A procedure for building an explanation to someone that starts from what the reader knows and proceeds in the order that answers the questions the reader will have next. Use when building the structure and speaker script of slides, and the text of explanations, proposals and reports.
---

# Building an explanation

Whether an explanation gets across is decided less by the correctness of its content than by whether it is ordered the way understanding is assembled in the reader's head.
This skill sets out a procedure for deciding the order of a talk according to how people understand new things.
For slides, this skill is used in phase 2 (structure) and phase 5 (speaker script) of create-slides. Rules for appearance and wording are in create-slides, and sentences are polished with yomiyasu, so they are not covered here.

## How people understand explanations

Every step is derived from the following seven properties. The sources are in the references at the end.

| Property | What it means for an explanation |
| --- | --- |
| New information can be understood only when connected to what is already known | Start the talk from something the reader knows. Text read without knowing what it is about can be understood sentence by sentence but not as a whole, and does not stay in memory |
| What can be held in the head at once is about four elements | If you line up parts whose use is unknown first, readers have to read on while holding meaningless elements |
| People take in answers when they have a question | Put, before the answer, a question that makes readers want to know that answer. Adults in particular do not try to learn until they see why they need to know it |
| Going from concrete to abstract makes things easier to understand | Show familiar examples or the real thing first, and move from there to generalized words and mechanisms |
| Text in narrative form is understood and remembered better than expository text | Rather than listing items, make it one continuous story that proceeds from a starting point by linking questions and answers |
| Misconceptions readers hold do not disappear just by adding a correct explanation | Name the common misconception, deny it, and show why it is wrong |
| What is easy to understand depends on the reader's knowledge | Decide the intended reader before deciding the order. An omission that works for those who know becomes a leap for those who do not |

## Procedure

### 1. Decide the core sentence

Write, as one sentence with a subject and predicate, the understanding you want readers to take home when they finish.
For slides, the answer to create-slides' "three lines to write before making" is this sentence.
If you line up terms and facts without deciding the core, readers are left without knowing what it was about, even if each explanation is correct.

### 2. Decide the reader's starting point

Choose and write down one concrete thing that the intended reader already knows and that connects to this talk.
An experience or a real thing is better than a concept as a starting point. For example, for how LLMs work, the scene everyone has seen, "when you ask ChatGPT a question, the text comes back appearing little by little", becomes the starting point.
Do not settle for mentioning the starting point in words; show it actually working first. If you talk about the mechanism inside ChatGPT, put the screen where a question is entered and the answer appears little by little before the talk about the mechanism. Readers use the phenomenon they saw as a cue and connect the mechanism that comes later to it.
If you cannot decide a starting point, you have mistaken the range of what the intended reader knows. Rewrite the intended reader first, then come back to this step.

### 3. Make the reader have a question

After showing the phenomenon at the starting point, before telling the answer, raise and show a question that makes "why is that?" come to the reader's mind about the phenomenon. An explanation read without a question is, for the reader, just information with answers lined up.
Explainer videos in the style of Yukkuri commentary proceed in this form. The listener character first voices a question, and the explainer answers it. The explainer never starts talking about the answer first.
Make the question from a point that readers took for granted but that seems strange once pointed out. For ChatGPT, "why does the answer appear one word at a time?" or "how can it answer things it should not have been taught?" become questions.
Do not use the question only in the writer's head. On slides, put it out in a form visible to readers, as text in the body or a figure, or as a direct address in the speaker script.

### 4. Write the chain of questions

Line up, from the starting point to the core sentence, pairs of "the question the reader will have next" and "its answer" in a single column.
Link them so that each step's answer gives rise to the next step's question. A step that answers no question is abrupt for the reader, so delete it or move it to where a question that needs it arises.
For slides, this column becomes the order of the slides as it is. At the start of each slide, take up the question coming from the previous slide.

Here is an example of explaining how LLMs work.

| The reader's question | Answer |
| --- | --- |
| (Starting point) Asking ChatGPT a question returns text | |
| What is happening inside? | It computes the probability of the next word, and adds one word at a time to make text |
| How does it compute that probability? | It computes with multiplications and additions using a huge number of numerical values. These values are called parameters |
| Who decided those values? | Not people; they were corrected by repeatedly checking answers against a huge amount of text. This is called training |

In this example, the name "parameters" is given for the first time right after "the values inside" come up in the talk. If you start with "What are parameters?" at the opening, readers do not know why they are hearing about it.

### 5. Introduce terms as answers to questions

Explain a term where the thing it refers to comes up in the talk. Do not put "What is ...?" slides or paragraphs together at the opening.
The order is to first show the function or role of what it refers to, and then give the name. If the name comes first, readers have to hold a label whose content they do not know.
In the explanation, write why it is needed and what goes wrong without it before what the word refers to. What snags readers is necessity more than definition.
The exception is when going into details after showing the overall flow once. In that case, you may briefly show together, just before, the names of the parts used in the details. A glossary before showing the overall flow does not fall under this treatment.

### 6. Show the whole before going into the parts

When explaining a mechanism or principle of operation, do not build it up from the parts. First show the overall flow once through, as in "let's first see how it works at all", and then look at each part in detail.
When going into a part, show each time where it falls in the whole. Readers hold the overall flow as a map and understand by placing the parts on it.

### 7. Go from concrete to abstract

Show concrete examples or the real thing first, and rephrase them afterward in generalized words and mechanisms. Do not start from an abstract definition and add examples afterward.
When explaining a mechanism, the concrete is the phenomenon visible to the reader as the result of that mechanism working. Show the phenomenon itself, such as a screen, output or motion, before the diagram of the mechanism.
When using an analogy, state explicitly where it corresponds to the original and where it differs. An analogy without the correspondence shown can lead readers to wrong inferences.

### 8. Anticipate where readers will get stuck

After making the outline, read it from the top as if you were the intended reader, and write down the questions that come up at each step. Always check the following three.

- Why is it needed?
- Why won't other ways do?
- What does it change for the reader?

Of the questions written down, answer in the body those needed to understand the core sentence. Answer each right after the step where the question comes up.
If there is a misconception the intended reader is likely to have (such as "AI searches for the answer"), name that misconception and show, with grounds, why it is wrong. If you only write the correct explanation, readers skim it without connecting it to their own misconception.

### 9. Introduce new elements one at a time

Introduce only one new concept per slide or per paragraph.
When introducing a new concept, confirm that the premises needed to understand it have appeared before it. If not, introduce the premises first, or move the new concept later.

### 10. Attach grounds and meaning for the reader to claims

Attach to a claim you want to persuade with its grounds and what it means for the reader.
The more readers feel a talk concerns them, the more they scrutinize the quality of the grounds. Strong grounds increase persuasiveness, but weak grounds and decorative words backfire. Do not state things more strongly than the facts you researched to make a claim look strong.

## Checking

When the outline and script are done, read from the top as if you were the intended reader, and check the following. Fix what you find before handing it over.

| What to check | How to fix it when found |
| --- | --- |
| Does the first step start from something the reader knows? | Decide the starting point again, and rewrite the chain of questions from there |
| Before talking about a mechanism, is it shown working? | Add a step that shows the real screen or motion before the mechanism step |
| At the start of each step, does the reader know why they are reading this now? | Put the question arising from the previous step's answer at the start of that step |
| Are there words that appear without explanation, or words explained far from where they are used? | Move the explanation to the step where the word first appears |
| Is the chain of questions broken somewhere? | Add the missing question and answer, or swap the order of steps |
| Does it proceed without touching the intended reader's misconceptions? | Add a step that names and denies the misconception |
| Is every step heading toward the core sentence? | Delete steps that do not head toward the core |

## References

| Reference | What was taken from it |
| --- | --- |
| Bransford, J. D., & Johnson, M. K. (1972). Contextual prerequisites for understanding. _Journal of Verbal Learning and Verbal Behavior_, 11(6). [DOI](<https://doi.org/10.1016/S0022-5371(72)80006-4>) | People not told first what it was about could not understand or recall the same text. Show the context of the talk first |
| Ausubel, D. P. (1960). The use of advance organizers in the learning and retention of meaningful verbal material. _Journal of Educational Psychology_, 51(5). [DOI](https://doi.org/10.1037/h0046669) | Before new content, put a framework (advance organizer) that connects it to the reader's prior knowledge |
| Haviland, S. E., & Clark, H. H. (1974). _Journal of Verbal Learning and Verbal Behavior_, 13(5). [DOI](<https://doi.org/10.1016/S0022-5371(74)80003-4>) | Readers connect new information using information they already know as a cue. Write from known to unknown |
| Cowan, N. (2001). The magical number 4 in short-term memory. _Behavioral and Brain Sciences_, 24(1). [DOI](https://doi.org/10.1017/S0140525X01003922) | About four elements can be held at once |
| Sweller, J., van Merriënboer, J. J. G., & Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. _Educational Psychology Review_, 31. [DOI](https://doi.org/10.1007/s10648-019-09465-5) | Cognitive load theory. The more interrelated elements are handled at once, the higher the load. Measures that work for novices backfire for experts (expertise reversal effect) |
| Loewenstein, G. (1994). The psychology of curiosity. _Psychological Bulletin_, 116(1). [DOI](https://doi.org/10.1037/0033-2909.116.1.75) | Curiosity arises when one notices a gap between what one knows and what one wants to know |
| Kang, M. J., et al. (2009). The wick in the candle of learning. _Psychological Science_, 20(8). [PubMed](https://pubmed.ncbi.nlm.nih.gov/19619181/) | Answers to questions people were curious about were recalled better later |
| Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect. _Journal of Experimental Psychology: Applied_, 15(3). [PDF](https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf) | Engaging with a question before reading the answer improved learning of the answer. Put the question before the answer |
| Knowles, M. S.'s andragogy (adult learning theory) [explanation](https://tecfa.unige.ch/themes/sa2/act-app-dos2-fic-andragog.htm) | Adults learn after knowing why they need to learn it |
| Reigeluth, C. M.'s elaboration theory [explanation](https://www.instructionaldesign.org/?p=133) | Show the whole once in a simple form, and elaborate the parts from there |
| Mayer, R. E.'s pretraining principle [bibliography](https://www.cambridge.org/core/books/abs/multimedia-learning/pretraining-principle/01791D57F5D4164251269E6DF56A8BF1) | Showing the names and functions of parts just before explaining the flow of a mechanism improves understanding. Used as the grounds for the exception in step 5 |
| Fyfe, E. R., McNeil, N. M., Son, J. Y., & Goldstone, R. L. (2014). Concreteness fading in mathematics and science instruction. _Educational Psychology Review_, 26. [DOI](https://doi.org/10.1007/s10648-014-9249-3) | Start from the concrete, and move gradually to the abstract |
| Gentner, D. (1983). Structure-mapping. _Cognitive Science_, 7(2). [DOI](https://doi.org/10.1207/s15516709cog0702_3) | Analogies are understood through the correspondence of relations between elements. Make the correspondence explicit |
| Mar, R. A., et al. (2021). Memory and comprehension of narrative versus expository texts. _Psychonomic Bulletin & Review_, 28. [DOI](https://doi.org/10.3758/s13423-020-01853-1) | In a meta-analysis of more than 33,000 people, narratives were understood and remembered better than expository text (g=0.55) |
| Schroeder, N. L., & Kucera, A. C. (2022). Refutation text facilitates learning. _Educational Psychology Review_, 34. [DOI](https://doi.org/10.1007/s10648-021-09656-z) | Text that names and denies misconceptions promoted learning more than ordinary explanation (g=0.41) |
| Petty, R. E., Cacioppo, J. T., & Goldman, R. (1981). Personal involvement as a determinant of argument-based persuasion. _Journal of Personality and Social Psychology_, 41(5). [DOI](https://doi.org/10.1037/0022-3514.41.5.847) | The more a talk concerns people, the more they are persuaded by the quality of the arguments. Used as the grounds for step 10 |
