---
name: create-slides
description: A procedure that, before making slides, presents defaults for the audience and the occasion and an outline built from the audience's questions, and after making them, writes a speaker script to check the flow of the presentation. Use when asked to make slides or presentation material.
---

# Making slides

To avoid making slides that miss the point, always decide and present the defaults for the audience and the occasion, and the outline, before making them.
Proceed through the phases in the order 1 → 2 → 4 → 5 → 6.
Put the results of phases 1 and 2 in the reply that starts the work, as defaults and an outline, and make the slides without waiting for an answer.
If the repository has a document that summarizes the feedback received so far and the procedures for checking, or a retrospective on structure, read it before making the slides.
Before handing them to the owner, review them with the procedure [Reviewing before reporting](usecases/review.md).
To order the structure and the speaker script in the order the reader's understanding is assembled, build them with the procedure of the `build-explanation` skill.

## Components

Build slides with the repository's deck component library. If there is none, install this skill's `assets/deck` (slide and icon components; the rules for color and type are in `assets/deck/DESIGN.md`) and `assets/single-html` (Vite settings that export a deck to a single HTML file and a PDF) as git subpath dependencies, such as `vp add github:masseater/skills#path:/plugins/masseater-skills/skills/create-slides/assets/deck`. Do not copy them.

## The intended reader and the amount of explanation

When there are no instructions about the audience or the occasion, assume as the intended reader someone with no prior knowledge but solid comprehension.
Make the deck something that person can understand by reading it. Do not make material that cannot be understood without hearing the speaker's explanation, or a memo that only lists key points.
Do not aim for many or few slides. Include all the information the intended reader needs to understand, and use as many slides as it takes to convey it. Do not add slides that are not needed for understanding.
People first hold the big picture, and understand by connecting new things to it one at a time. So build the structure to start from the big picture of something the audience already knows, and, as the explanation of the big picture reaches a point where a part is needed, explain that part right there. Do not line up the explanations of parts and basics together first and leave the big picture for later.
Explain proper nouns and technical terms (token, VLA and so on) right after the word comes up in the talk, unless it has been confirmed that the audience knows them. In the explanatory text of an explanation slide, write first the question the audience has after seeing the previous slide, and introduce the word as the answer to that question. On the explanation slide, write what the word refers to, and where and why it was needed on the previous slide.
Do not end by merely explaining terms or subjects. Write down the questions readers have when they see the slide, and put answering those questions at the center of the slide. Examples of questions are why it is needed, whether you would not understand it by using it, and which is best after all. Write the lead text as the answer to that question.
Even for decks that are lists or summaries of kinds, decide what the whole deck wants to convey as one sentence with a subject and predicate, and show that sentence on an early slide. Line up the slides for each item as the grounds for that sentence.
After making the outline, read the heading and point of each slide from the top from the intended reader's standpoint, and check whether there are words that appear without explanation, or talk that jumps from the previous slide. If you find any, add the explanation.

## Phase 1: Alignment

Confirm the following groups.
When an earlier answer changes a later question itself, ask only that question first. The choice between a presentation and reading material is an example; the items to ask change depending on the answer.
Gather items that do not affect each other into one round, attach defaults, and proceed without waiting.

| Group | What to confirm |
| --- | --- |
| Audience | Who they are (one person / several), roles and positions, whether they are a decision-maker, how many |
| Relationship | First meeting / already acquainted, our position (proposing side, contractor side, colleague, speaker), their attitude (keen, wait-and-see, wary) |
| Audience's premises | How much they know of internal circumstances and terms, how they perceive the problem, what they expect of us |
| Occasion | What kind of occasion it is (meeting, interview, talk, internal sharing), the surrounding context, time allotted, whether there is Q&A, screen / print |
| Goal | What we want them to think, what we want them to decide, what next action we want to happen afterward |
| Delivery | Spoken, handed over as reading material, or both. Tone (formal, casual) |
| Sharing and publication | Whether to share it as is after speaking, or make a separate slide deck for publication with supplements; scope of publication (internal, the client company, the public) |
| Constraints | Information that must not be shown, NDAs, consistency with existing material, notation to follow |
| Existing material | Whether there are past slides or reference material, and whether to reuse them |

The language is Japanese unconditionally; do not ask.
Once it is decided to hand it over as reading material, do not assume spoken explanation; make the slides understandable when read on their own.

Once the answers or defaults are in place, define the taste from them together, and put it in the reply that starts the work along with the outline.
Define the taste by tone, density of text, ratio of figures to text, strength of decoration, and the tendency of the presentation patterns used.

## Phase 2: Structure

### Three lines to write before making

Before dividing into slides, write the following three lines.

1. The audience's question: write what the audience wants to know when they open this deck.
2. The answer: write the answer to that question as one sentence with a subject and predicate.
3. The judgment you want from the audience: write what the audience will decide, or become able to do, after reading. A deck for which you cannot write a decision is an explanation or a list, so write what the audience will become able to explain.

Build the structure in the order that answers this question. Do not build it in the order of the material, such as the order of the request text, the order of Slack comments, or the chapters of a speech.
If the request text contains the user's line of argument (such as "until now it was ..., but ... is ..."), use that line as the skeleton.

### The skeleton for each kind of deck

| Kind | Skeleton |
| --- | --- |
| Request and proposal | Premise (history and why we are talking about this) → the content of the request and what will be built with it (if there are two requests, separate them with a section divider) → comparison on the same criteria, including options not adopted → table of total costs per pattern (including all related contracts) → risks borne by the receiving side and how to lower them (also write the cost of options that eliminate the risk) → what we want decided → summary |
| Explanation of a new threat or change | A mechanism the audience knows → which part of that mechanism was attacked (cause and effect) → concrete cases → what changes in the audience's environment → possible responses → summary |
| Explanation with many terms | The audience's question → the big picture seen from something the audience knows → the parts of the big picture, one slide each, in the order they become needed (explain terms right after they appear on that slide) → list of options → individual slides for each option → summary |
| List | The table of contents may use the chapters of the material. Make each item "quotation of the original (a frame that visibly marks it as original) → laws, budgets or projects actually in motion → explanation" in that order |

### Checks when dividing into slides

- Premises: write down the facts the audience needs to know for the answer sentence to hold, and confirm they are on slides before the answer.
- What to compare against: always put on a numbers slide whichever of the proportion of the whole, a comparison target and the point in time are needed. Attach the denominator and source to proportions, and choose the latest ones or other options as comparison targets. For cost estimates, align all options to the same conditions on the premise of actual usage.
- Weight: put a lead sentence on a fact slide that shows what the problem is for the audience. Show weight through a comparison target.
- Objections: write down at least one objection or alternative the audience is likely to raise first, and put a slide that answers it.
- The receiving side's questions: for a request deck, write down at least three questions the receiving side is likely to ask first after reading. Always include "How much in total?", "What could happen if we hand it over?" and "What will be built?", and confirm there is a slide that answers each.
- Separation: do not put two states, such as "until now" and "from now on", or two requests on one slide. After listing the options, explain each option on its own slide.
- The real thing: decide the real thing to put on each slide before making it. Real things are product names, law names, budget amounts, model names and company names. A slide for which none is decided becomes a summary, so research it or delete it.
- Axis: look from the audience's side at whether each slide is needed for the answer sentence or the audience's judgment. Move slides that only explain mechanisms and are not needed for judgment into the speaker script. However, do not move explanation slides the intended reader needs to understand the answer sentence. Do not remove cost or risk slides, because even if they look superfluous to the speaker, the audience needs them for judgment.

### How to present the outline

List the three lines and, for each slide, the heading and one sentence of what it wants to say, and put them in the reply that starts the work. Do not make it a question; start making without waiting for an answer.
Polish the outline with the yomiyasu skill before putting it in. Likewise polish the slide text and speaker script before handing them over.
When adding slides after feedback, rearrange the outline as it will be after the addition, and confirm there are no slides off the axis before adding them.

### How to write the list

List the number of slides and the role of each slide.
Attach to the list the presentation pattern (a layout from the deck component library) used for each slide.
Build exactly as the outline you showed, and do not add slides that were not instructed. If the user fixes the outline, rebuild to match that shape.
Put only one topic on a slide. If there are two topics, split the slide, or change one slide with animation.
Order the slides so that each answers the question the audience has next after seeing the previous slide. Make both sides of a comparison slide use the same subject matter.
Put the summary of the deck on the last slide, and make its heading plainly "まとめ" (Summary), not decorated like "この資料のまとめ" (Summary of this material). Do not make a slide that collects sources.

## How to show proper nouns and services

So that it is visually clear, when a proper noun appears, bring in and place its official logo if one is available.
If the talk contains a service that can be pictured concretely (Slack, GitHub, Twitter and so on), actively make slides that reproduce that service's screen layout.
Reproduce the real screen as it is. Do not turn it into something else by pulling its colors or the arrangement of its parts toward the design system.

## Figures and graphs

When showing a flow of input and output in a figure, do not leave the arrows static; show it actually flowing with animation. Move flowing points and labels only between the starting point and the arrival point, and do not let them pass through the box at the arrival point.
After writing an animation, open the built HTML with the Playwright chromium used for PDF output, and record the target slide with the recording feature (recordVideo) for longer than one cycle of the animation. Look at the recorded video with the frames laid out in one image, as in `ffmpeg -i x.webm -vf "fps=2,scale=640:-1,tile=5x5" -frames:v 1 sheet.png`. Look at the order of going and returning, whether things stop inside the arrival box, and whether they pass through boxes or text on the way, judge whether the expression is appropriate, and fix it before pushing.
Separately from checking animations, before reporting, open the built HTML with the same chromium and capture the state of every slide at every click. Look for misalignment, overlap, unnatural wrapping and gaps yourself, and fix what you find. When checking rendering, crop and enlarge each figure.
When a slide has only a figure, center the figure.
Do not attach icons to slides that merely list item names. Use icons to show figure elements as pictures.
Do not draw figure elements as boxes with only text in them. For things that can be pictured, such as a government office, a server, the internet, a PC, a document, a person or a key, draw icons with the icon component of the deck component library so that what concept they are is clear at a glance. When the picture you want is not among the components, add it to the component library rather than making one per deck.
Use step-by-step reveals only where you show a change, and show at once what may be shown together.
Make sure the arrows and short words in figures do not show stronger causation or relationships than the facts you researched, and do not drop conditions or possibilities.
Put only one graph on a slide, and draw it large across the full width of the body. Do not make it small by placing explanatory text or a column of items beside the graph, or by stacking two graphs vertically.
Do not split the same metric into separate graphs; combine it into one graph, drawn in a form like the common AI benchmark images.
When comparing numbers between models, use a line graph, which is more visually clear than a bar graph.
For line graphs of benchmark progress, do not connect the top score at each point in time with a single line; split the lines by developer, such as OpenAI, Anthropic and Google.
When including evaluations such as the weight of risks or returns, write the grounds so they do not look arbitrary.
For talk about where a range begins and ends, such as national borders or network routes, add a figure that shows the range visually.
For technical terms the audience does not know, such as law names, put an explanation slide such as "CLOUD Actとは" (What is the CLOUD Act) before using the word.

## Headings

In a heading, write in a short phrase what is on the slide, that is, what the figure, table or body shows.
Do not put a fact or claim as a sentence in the heading. Restating in the heading a fact written in the body or figure does not move the talk forward at all.
For example, for a slide with a graph of the number of CVEs per month, make the heading "2026年までのCVE数の変化" (Change in the number of CVEs up to 2026). Do not put a factual sentence such as "公開されるCVEは2026年7月に月1万件を超えた" (Published CVEs exceeded 10,000 per month in July 2026), nor a topic name that does not show the content, such as "OSSの配布" (Distribution of OSS).
On slides where the figure tells what follows, an opening that states only a condition or scene suits better than a label that names the figure's content. "ライブラリを使わずに作るもの" (What you build without libraries) becomes "ライブラリを使わずに作ると" (If you build without libraries), and "家づくりの部品と職人の仕事" (The parts of building a house and the work of craftsmen) becomes "例えば家を作る時" (For example, when building a house).
In decks that explain mechanisms, put in the heading the question the reader has before that slide (such as "なぜ答えは少しずつ表示されるのか", why does the answer appear little by little), and answer that question in the first sentence of the body. Readers take in answers when they have a question.
Headings of this form do not line up nouns with commas, so they do not fall under the ban on "〜、〜 (noun ending)".
Do not add headings to slides that do not need them, such as the cover, screen reproductions, and slides that get across with the figure alone.
Do not attach fade-in sentences to everything. Do not attach them to slides that are clear from the figure; attach them only to slides that do not get across without words to supplement them.

## Sentence form

Do not use the form "〜、〜 (noun ending)", which separates with a comma and ends with a noun, anywhere without exception: headings, body, text in figures, or the speaker script.
For example, rewrite "ボトルネック、人のやり取り" (bottleneck, human interaction) as a sentence with a subject and predicate, such as "ボトルネックは人のやり取りだった" (the bottleneck was human interaction).

Make the text on slides, not just headings but also text and labels in figures, phrases that name what is there. Do not put spoken-language sentences such as "〜だ" or "〜よね" on slides; write the words to be spoken in the speaker script.
For example, do not make a figure label "Claudeが読める範囲もこれと同じだ" (the range Claude can read is the same as this); make it "Claudeが読める範囲" (the range Claude can read).
Do not put closing words such as an appeal to the audience on the closing slide.
Do not add sentences, disclaimers or supplements that were not instructed. If you want to add one, do not make it; ask in one line in the report.

Write real names the audience can search for later, and write features by their official names. Choose technology examples that are in use now.
Assign one word to one concept, and write the full name of an abbreviation at its first occurrence.
When the audience is not engineers, do not show source code or file names. Choose figurative words the audience will not misunderstand.

## Phase 4: Gathering information

After the structure is settled, ask the owner only about the missing items.
Do not fill in a picture of the owner by guessing from public information.
Do not hand over a deliverable with holes marked [要確認] (to be confirmed). Write out fully what can be written from other slides in the same deck, past decks, and the owner's remarks, and make the places written by guesswork identifiable as guesses in the speaker script.
On slides that mention AI, confirm the latest release information on the web on the day you make them before writing, and leave the date of confirmation and the source in the speaker script. Three months' difference makes the available models and their performance something else entirely, so do not write from memory or from information in past material.
For the numbers of rankings and leaderboards, open the ranking itself, not a roundup article, on the day you make the slides, and confirm the date it was last updated and the newly listed models. Do not stop at the date of a roundup article.
For benchmarks, apart from the date you researched, confirm when the numbers were measured, and use only ones that compare the latest models with each other.
When introducing a case, do not put the source link in a separate place; make the introductory text of the case itself a clickable link to the source.

## Phase 5: Speaker script

After making the slides, always write a speaker script.
Make the script text that can be presented just by reading it aloud. Do not make it notes of key points.
Do not cut the script slide by slide; write it as one continuous talk from the cover to the close. Include in the script the connecting words that take up the talk of the previous slide and move to the next.
On each slide, talk about the reason you think so along with what you want to say.
Imagine what the audience thinks when they see the slide and where they get stuck, and write in the order that answers those questions.
Make the talk connect with the slides alone, even without reading the script. If there is a leap explained only in the script, fix the slides.

## Phase 6: Checking and fixing the flow

When the script is done, check whether the axis and core of the presentation get across to the audience if presented exactly as written.
If there are places that do not get across, fix both the script and the slides, and check again straight through from the beginning.
The viewpoints for checking were taken from well-regarded books on presentation structure.

| Viewpoint | What to check | Source |
| --- | --- | --- |
| Can the core be said in one sentence? | Can what you most want to convey in the presentation be written as one sentence with a subject and predicate? If not, revisit the structure. Does every part of the script support that sentence? Delete parts that do not | Duarte's Big Idea, the Heath brothers' Commander's Intent |
| Does it start from where the audience is now? | Does the opening start from what the audience already knows or can agree with, and arrive at the core sentence as an answer by way of a change or a problem from there? | Minto's SCQ (Situation, Complication, Question), Atkinson's Act One |
| Does it go back and forth between the present and the changed future? | Does the middle proceed by going back and forth between the contrast of "this is how it is now" and "this is how it could be", and end with what you want the audience to do? | Duarte's sparkline |
| Does the line hold with just the one sentence of each point? | Extract from the script one sentence of what you want to say on each slide and line them up; can the line of the talk be followed with these alone? Fix the order or content where they do not connect | Minto's horizontal logic, Atkinson's headlines |
| Are premises you know skipped? | Are there premises or terms you omitted because you know them? Read the script from the audience's standpoint and pick out words that appear without explanation | The Heath brothers' Curse of Knowledge |

The core sentence is a tool for checking. Do not put it on a summary slide.
The question of SCQ is also a tool for checking the order of the talk; do not make a slide titled "問い" (Question).
Show the owner the results of the check and the places you fixed, together with the core sentence.

## References

| Reference | What was taken from it |
| --- | --- |
| Nancy Duarte, "Resonate" (2010; Japanese translation "The Presentation", Diamond) [explanation](https://www.duarte.com/blog/ultimate-guide-to-contrast/) | Write the Big Idea as one sentence with a subject and predicate, and cut everything else. The sparkline that goes back and forth between "what is" and "what could be" |
| Barbara Minto, "The Pyramid Principle" (Japanese translation "Kangaeru Gijutsu, Kaku Gijutsu", Diamond) [explanation](https://modelthinkers.com/mental-model/minto-pyramid-scqa) | Build the introduction in the order situation, complication, question, answer. Line up one sentence of each slide's point and check whether the line can be followed |
| Chip Heath and Dan Heath, "Made to Stick" (2007; Japanese translation "Idea no Chikara", Nikkei BP) [explanation](https://actionablebooks.com/summaries/made-to-stick/) | Narrow the core with the Commander's Intent of "if nothing else, at least this". The Curse of Knowledge, by which those who know more skip premises |
| Cliff Atkinson, "Beyond Bullet Points" (O'Reilly) [bibliography](https://www.oreilly.com/library/view/beyond-bullet-points/9780735660052/) | In Act One, show a scene and the current state the audience can relate to. Make each slide's point a sentence with a subject and predicate, and connect what comes before and after |

## Turning feedback into rules

When writing feedback down as a rule, gather one good example and one bad example in the words of the person who gave the feedback before writing it. Generalizing by guesswork from a few words produces a rule opposite to the intent.
When you receive the same feedback twice, before adding a prose rule, investigate whether it can be stopped by a mechanical check such as a textlint rule or a hook. Rules broken by the model's habits do not stop being broken by adding prose.

## Handling sharing

Slides that were presented orally are, as a rule, published as they are.
Only when necessary, make a separate slide deck for publication with supplements.

When showing a deck to the owner, as a rule and without being told, attach all three of the PDF, the HTML and the speaker script together to the report.
