# observability

Confirm that what happened in production, and who uses it and how, can be understood from outside. If it cannot, you end up fixing every bug by guesswork. Follow [Google SRE's Production Readiness Review](https://sre.google/sre-book/evolving-sre-engagement-model/) for the approach.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Tracing production requests | Pick one request that failed in production and follow what happened from the logs and spans | Where and what happened is known without redeploying |
| Measuring processing that costs time or money | Check whether there are spans where external APIs, models, DBs and child processes are called | All of them are spans |
| Detecting failures | Look for settings for error rates and failure notifications | That a failure happened is notified to a place people look at |
| CI run records | Check whether there is a job at the end of the workflow that sends the execution times of jobs and steps | The execution times of jobs and steps are recorded |
| User analytics | Check that the production page HTML has an analytics beacon and that views reach the analytics dashboard | Every public page is measured by default from the start of the project. Choose one that does not use cookies and has no usage-based billing (such as Cloudflare Web Analytics) |
