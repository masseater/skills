# publishing

Confirm what is published externally and the procedure for taking it down. A publishing destination missing from the list stays behind without being updated or deleted.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| What is published | Match the list of publishing destinations in the README against the externally accessible URLs, DNS and package destinations in the infrastructure definitions | Every externally accessible URL and every published package is in the list |
| URL changes | Look for redirect settings for pages that moved | The old URL redirects to the new URL |
| Takedown procedure | Make a list of the resources created from the infrastructure definitions and match it against the description of the takedown procedure | The takedown procedure is written, and it covers every created resource, including DNS, authentication settings and the list of publishing destinations |
