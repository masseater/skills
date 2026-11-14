# requirements

Confirm the users, the purpose and the expected scale. Unless these are decided, the conditions for satisfying the other areas cannot be decided either. Follow the approach of the [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) and decide the design from the load and the requirements.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Users and purpose | Read the README and docs | It says who uses it and what they can do |
| Expected scale | Compare the description of scale with the numbers from production analytics | The number of users, requests and amount of data at the next stage are written as numbers, accompanied by measured production values and the date they were taken |

The reason to write the scale of the next stage rather than the current one is that the scale changes before the design does.
