---
name: scheduled-task-prompt
description: Write or revise the instruction text that a scheduled task hands to Claude on every run, naming the information sources to read and the state that holds when the run is done, and leaving the procedure to Claude. Use when creating or editing a scheduled task's prompt, not for a one-off request made in the moment.
---

# scheduled-task-prompt

## Why this skill exists and the state it aims for

This skill exists because a scheduled run does not remember the conversation in which the task was requested. Claude reads only the instruction text and must carry the work to the end without asking anyone. A run that succeeds says only that the session ended without an error, not that the requested work was done, so whether it was done is decided by the finished state written in the instruction text. Whatever the requester left in their head, such as where to look, what counts as done or what to do when nothing applies, is filled in by Claude's guesses, and every run guesses again.

The state this skill aims for is that Claude, reading only the instruction text, can find what to read without searching, can tell without asking when the work is finished, and leaves a result from which a third party can tell whether the run did the work, found nothing or could not finish.

## Rules

### Write no procedure

- Do not write steps such as "first open X, then do Y". A procedure breaks when the layout of a page or a tool changes, and it turns carrying out the steps into the goal, so the run ends without meeting the finished state. When the information sources and the finished state are fixed, Claude can decide how to proceed.
- When you want to constrain how Claude proceeds, write it as a thing to keep or as a condition on the finished state, not as a procedure.
- Bad: "Open Slack and read #sales, then open the case database in Notion, find the matching rows and update them." Good: under information sources, "posts in #sales since the previous run"; under the finished state, "for every case mentioned in those posts, the 'latest status' in the case database matches the post".

### Name the information sources

Write what to read for the judgment in a form Claude can identify without searching.

- Write a place as a URL or an exact name: the URL for a Notion page or database, the channel name for Slack, the folder link for Google Drive.
- Write a period relative to the run: "since the previous run", "the last 24 hours", "since 0:00 on this week's Monday (JST)". A fixed date is stale from the second run on.
- Write times in JST.
- Write what not to read: channels out of scope, archived rows, posts by people outside the company.
- Write how to treat what the information sources do not say: do not fill it by guessing, leave it empty, or write "unknown".
- Include in the task's settings the connectors needed to read the information sources, and remove the ones that are not needed.

### Define the finished state

Write where, what and how things stand when the run is done, in a form a third party can judge as done or not done.

- Write the place and the format: the URL of a Notion page, a Slack channel, a Gmail draft.
- Write it as a state, not as an action such as "put together" or "tidy up". Bad: "Tidy up new inquiries." Good: "Every inquiry that arrived since the previous run is in the inquiry database as one row each, with 'category' and 'owner' filled in."
- Write the state for a run where nothing applied, for example "one line saying nothing applied is posted". If nothing is left behind, no one can tell whether the task ran or stopped.
- Write the state for a run that could not finish, for example "the information sources that could not be read, and why, are at the top of the post".
- Write the criteria for judgments when there are any: what "important" or "urgent" means, the options for a category. When there are no criteria, have Claude leave the field empty.
