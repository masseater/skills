# Writing the purpose and the reason

Write the purpose of doing something. With a purpose, readers can apply the criterion and judge even in unexpected situations.

- Do not substitute a description of behavior that is obvious from the specification or the code for a reason
- When a reason is complete in technical terms, trace back until you reach a business or product requirement
- When working backward from the current state to a reason, state explicitly that it is a guess, and reach agreement with a human

## The reason before the technology

If A in "We do B because we need to do A" is a technical element, there is a further reason before it: why that technology was adopted. If no grounds are found when you trace back, suspect that the choice itself is overengineering.

```
This setting is enabled in order to do SSR.
```

That the setting is for SSR can be found out in a minute of research. The reason SSR is needed is missing. With a reason, you can choose, among the ways of achieving it, the one that fits the purpose.

```
SSR is needed for SEO.
```

It looks good, but why SEO is considered is missing.

```
This product is a B2C service. Besides simple marketing traffic, we also want to expect search traffic. Therefore SEO must be considered, so we do SSR.
```

It includes the background of the requirement, but it is redundant. Writing product-level requirements everywhere duplicates existing information. If it is clear where the overarching principle lives, omit it here and keep the source of truth in one place.

```
So that traffic can flow from search results to product pages, crawlers need to be able to get the main product information from the first response. To meet this requirement, product pages are rendered on the server.
```

"We expect traffic from search engines" is a product requirement. It is not derived backward from technology, so it is where the reason lands. The reason for that requirement itself is a business matter and should not be tied to technical requirements, so it may be omitted.
