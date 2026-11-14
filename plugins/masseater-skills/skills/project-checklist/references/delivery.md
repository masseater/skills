# delivery

Confirm the path a change takes from passing checks to reaching production. If the path depends on a local environment, changes that have not passed the checks reach production. Follow build, release, run and config of [The Twelve-Factor App](https://12factor.net/) for the approach.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Where checks run | Check the workflow and hook settings, and check the latest run results on main | Checks run on push to main, and the latest run succeeded |
| Deployment path | Check the deploy job of the workflow | It does not depend on a local environment, and only what passed the checks is deployed |
| Rollback | Look for a procedure to redeploy the previous version | There is a procedure, and a rollback has actually been done once |
| Environment variables | Check `.env.example` and the workflow's environment variables | Only values that differ per environment are environment variables, and values that do not change are in code or configuration files |
