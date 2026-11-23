# Check Cloudflare cost

Find designs that raise the bill and usage that has no cap.

1. For every repository that deploys to Cloudflare, check code and configuration against the Cloudflare cost criteria, and check production usage as well: the GraphQL Analytics API for Workers, Durable Objects, D1, Queues and the rest, and the AI Gateway logs for Workers AI. Code and configuration alone miss a loop that is expensive only in production.
2. Judge the totals against the included usage of the Workers Paid plan for the whole account, not per repository.
3. List each pay-as-you-go source that has no cap in infrastructure as code, and each design that raises cost. For anything above $0.10 a day beyond the included usage, say that the owner must approve it.
4. When a violation can be detected mechanically, add a proposal to put it in a msch check so every repository receives it.
