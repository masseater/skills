# search-and-sharing

Confirm whether pages are listed in search engines and how they appear when a link is shared. If you do not decide this, pages you do not want listed get listed, and pages you do want listed get listed without their content. Follow [Google Search Essentials](https://developers.google.com/search/docs/essentials) and the [Open Graph protocol](https://ogp.me/) as the standard.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Listing in search engines | Check production's `robots.txt`, each page's `meta name="robots"`, and the `X-Robots-Tag` header | Which pages are listed and which are not is decided according to the users and purpose in requirements, and it is configured that way |
| Content of listed pages | Fetch the production HTML with `curl` and check whether it has the body, title, description and canonical | The body and metadata are in the HTML without running JavaScript |
| Appearance when shared | Check the OGP tags in the production HTML and open the og:image URL | og:title, og:description and og:image exist, and the image is returned |
