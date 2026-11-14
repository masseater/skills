# Writing a tech article

Also read [`article`](../references/article.md).

AI likes to put its own claim even in an introductory article, and the introduction of the subject is demoted to material for the claim.

- Make the axis what the subject contains and what happens when you use it
- Introduce the technology itself. Do not make how you use it in your own repository the axis
- Show behavior with sample code, and base it on both the results you confirmed by actually running it and the descriptions in the official documentation
- Besides introducing one subject, articles that research and compare several subjects also belong to this kind. When comparing, put the axes of comparison in a table
- When you cannot prepare a screenshot or figure you want to include, leave `<!-- TODO(media): what to include -->` where it goes and hand it to the owner
- Write only about the latest version, and do not write the history of older versions
- Do not write about topics covered in another article; link to that article

## What not to write

- Claims that stray from the introduction, such as "What humans write becomes a constraint that machines can execute"
- Steps for getting started, or a "who it is for" paragraph
- Paragraphs that merely rephrase what is written in the README. Readers only need to read the README, so there is no point in making it an article

## Do not make exceptions

If the owner's policy is "use it across the board", the writer must not add exceptions such as "small scripts may be excluded". Allowing one exception creates multiple ways of writing, and becomes a hole that enforcement cannot reach.
