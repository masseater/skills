# performance

Measure and confirm the speed of pages and APIs. With the developer's local environment and connection, slowness goes unnoticed. Follow [Web Vitals](https://web.dev/articles/vitals) for the metrics.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| LCP, INP, CLS | Measure several times, with a Lighthouse user flow, the load of each production page and the navigation caused by clicking a link on the page | The median of each step is 0.9 or higher, which is Lighthouse's passing line |
| FCP, TTFB, TBT | Check the results of the same measurement | The numbers are recorded |
| Server response time | Compute the p95 for each API from production spans or logs | It is within the time in the requirements |

The reason to measure several times and judge by the median is that Lighthouse's numbers vary with the load on the machine doing the measurement.
