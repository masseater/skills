# rendering

Confirm the rendering method for each page. If you do not decide the method, the framework's default stays, and even pages with the same content for everyone are generated on the server on every request. Follow web.dev's [Rendering on the Web](https://web.dev/articles/rendering-on-the-web) for the classification of methods.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Method per page | See whether the route settings are prerender, SSR or client-only, and check whether each page's HTML is in the build output | Pages with the same content for everyone have their HTML generated at build time. Only the parts that change per viewer or per request are generated on the server or the client. For a page whose changing parts are generated on the client, it is enough that the HTML of its outer frame is generated at build time |
| Server processing on static pages | With the hosting provider's analytics API or dashboard, compare the number of server-processing invocations before and after opening a production page several times | Opening a static page does not invoke server processing |

Having HTML in the build output alone is not enough to be satisfied. If prerendered HTML is returned from server processing, the server starts on every request.
