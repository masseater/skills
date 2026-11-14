# cost

Confirm how costs grow when traffic increases. Most pay-as-you-go billing has no cap on spending, and a spike in traffic or the number of executions caused by a bug becomes the bill as it is. Follow the cost optimization pillar of the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) for the approach. For anything running on Cloudflare, also follow cloudflare-caution.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Charges incurred by one visit | List the requests made when opening a public page with the browser's developer tools, and write which billing unit of which service each one falls under | Delivery of an externally published site has no path that is billed by usage |
| Caps when things run away | Check the settings for the execution time limit, the cap on retries and budget alerts | Infinite loops and retry bugs stop at a cap |
| Actual billed amount | Check usage per billing unit on the billing dashboard | The estimate and production usage do not diverge |

"It fits within the free tier" is not a reason for being satisfied. If traffic spikes, the free tier is exceeded.
