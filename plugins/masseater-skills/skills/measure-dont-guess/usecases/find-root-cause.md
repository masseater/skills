# Finding the root cause of a bug

Do not write a fix until you know the cause.

1. Read the error message and the stack trace to the end. The answer is often written there as it is
2. Build a procedure that reproduces it reliably. Until it reproduces, add observation points and gather information
3. Look at recent changes: diffs, commits, dependencies, configuration and differences in environment
4. For processing that spans multiple layers, log the values coming in and going out at each layer boundary. Identify the broken layer before investigating that layer
5. Trace an invalid value back through its callers to where it comes from, and fix it there
6. Look for similar implementations that work in the same codebase, and list every difference from the broken one, however small
7. Write a failing test first, then apply just one fix

Examples of processing that spans multiple layers are going from CI to build to signing, and from API to service to DB.

Do not mix incidental improvements or refactoring into a fix. If you mix them in, you cannot tell what worked.

If three fixes do not fix it, do not try a fourth; doubt the design and consult the user. When every fix breaks another place, it is often a problem of design.
