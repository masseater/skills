# reliability

Confirm that you can recover when a failure happens. Means of recovery are not tested until they are actually used, so you notice they are missing only after you have lost data. Follow the reliability pillar of the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) for the approach.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Data recovery | Check the data store's backup or point-in-time recovery settings, and records of a restore | There is a means of restoring, and a restore has actually been done once |
| Recreating resources | In the infrastructure definitions, look for resources that are recreated when their name changes | Resources that hold data are not recreated unintentionally |
| Failures of external calls | Check whether calls to external APIs have a timeout and a cap on the number of retries | Both exist. Operations that are retried are idempotent |
