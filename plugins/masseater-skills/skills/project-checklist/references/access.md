# access

Confirm who can access each page and API. If a URL meant to be private is public, information leaks without anyone noticing. Follow the authentication and access control chapters of [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) as the standard.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Visibility of each page and API | From the routing definitions and authentication settings, make a list that classifies every page and every API as public, logged-in users only, or the owner only | Every page and every API is classified as one of them |
| Private pages and APIs | Send requests while logged out to production's private URLs and to the URLs the platform issues automatically | No content is returned |
| Authorization per API | In each API's handler, look for the code that verifies the caller's permissions. Look for tests of calls while logged out and of calls with someone else's permissions | Every API verifies permissions, and there are tests for it |

The reason to also check automatically issued URLs is that if authentication sits only in front of the custom domain, those URLs can be accessed without authentication.
