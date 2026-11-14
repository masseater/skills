# Reviewing before reporting

When you finish making a deck, review it in the following order before handing it to the owner. The rules themselves are in SKILL.md; this file only describes the procedure for confirming that they are followed. Confirm none of them in the writer's head; confirm them by looking at extracted lists and captured images.

## Structure

1. Line up the headings of each finished slide and match them line by line against the approved outline. Look for slides not in the outline and slides in the outline that were not made
2. For each slide, write down the question the audience has just before it, and see whether that slide answers it. A slide that answers no question is a restatement of the material, so cut it or replace it with the real thing
3. If a slide has two topics, split it
4. Find the comparison slides, and see whether there is a matching slide for the other side
5. Check that the heading of the last slide is not the single word "Summary", and that there is no slide that only collects sources and no "In a word" slide
6. Look for sentences and slides that have no grounds anywhere in the approved outline or the owner's instructions. Delete them, or ask in the report whether to add them

## Text

1. Extract all the headings, and see whether each heading is a phrase that points to the slide's figure itself, or an opening that leads into what the figure shows next. If a one-sentence claim, a one-sentence fact, a topic name or decoration such as "this deck's ..." is mixed in, fix it
2. Extract all the text on the slides and look for spoken-language endings ("〜だ", "〜なんです", "〜しよう"), direct address to the audience, and stock closing phrases
3. Try deleting the fade-in sentences one by one, and remove them from slides that still get across without them
4. Extract all the terms, and see whether there are two words with the same meaning, whether an abstract paraphrase (such as "distribution source") can be made the actual name (such as npm), and whether the first occurrence of an abbreviation has its full name. If the audience is not engineers, also check that source code and file names do not appear
5. If the repository has textlint rules or hooks that check for things like noun-ending sentences, run them on the slide text and the speaker script

## Figures and graphs

1. Read each arrow in a figure back as a sentence of who passes what to which side under what condition, and compare it with the facts you researched. Also confirm that something that cannot be chosen does not look as though it can be
2. See whether graphs have tick marks, values at key points, the period of the source data, and notes on differences in how things were measured

## Grounds and freshness

1. Extract every model name and benchmark that appears in the deck, and confirm against that day's official announcements whether they are the latest and when the numbers were measured
2. See whether slides with evaluations or weightings have the supporting numbers and links to sources on the same slide

## Rendering

1. Capture every slide of the built HTML in every click state
2. Crop the captured images per figure and enlarge them at least twofold. The whole image is loaded scaled down, so without enlarging, misalignments such as a point slipping off a line are not visible
3. In the enlarged images, check slide by slide whether points sit on lines, whether the figure is centered on figure-only slides, whether text wraps at odd positions, and whether anything overflows its box
4. For motion, use images that lay out a recording frame by frame, and see whether points and labels stop between the starting point and the arrival point
5. Finally, reread whether what each slide wants to convey can be understood from the figure and the heading alone

## What to hand over

See whether the PDF, the HTML and the speaker script are all attached to the report.
