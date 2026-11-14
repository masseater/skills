# security

Confirm the countermeasures against attacks and information leaks. The application runs even if any of them is missing, so you will not notice unless you check with detection tools. Follow [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) and the [OWASP Top 10](https://owasp.org/www-project-top-ten/) as the standard.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Where secrets are kept | Run a secret detection tool such as Betterleaks against the entire history of the repository | Nothing is detected. Secrets exist only in a secret storage service |
| Vulnerabilities in dependency packages | Run the package manager's audit | There are no advisories. Only advisories without a fixed version are excluded, with a reason |
| Response headers | Send `curl -I` to each production page that returns HTML, and check CSP, HSTS, X-Content-Type-Options, Referrer-Policy and Permissions-Policy | All of them are set |
| Dynamic scanning | Run a ZAP scan against production | There are no alerts, including warnings |
| Mass requests to write and authentication endpoints | Look for rate limiting settings | There is rate limiting in front of writes, authentication and public APIs |

The reason to target the entire history is that secrets you thought you deleted remain in past commits.
