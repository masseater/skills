# testing

Confirm that each mechanism has a reproducible way of checking it, and that production code has not been changed just for tests. Even without a way of checking, and even with test-only exports or wrappers, the tests pass and the build passes.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Production code that exists only for tests | With fallow's production analysis, list exports used only from tests. Look for functions, wrappers, entry points and arguments that are not called from production and are called only by tests | Production code has no exports, wrappers or entry points that exist only for tests. Tests call through the entry points production uses |
| Way of checking each mechanism | For each app, tool and workflow, look for tests and checks that run from `vp run verify`. For anything with a screen, look for a check that compares the rendered image with a baseline | Every mechanism has, in verify, a way of checking that returns the same verdict without an agent or a human looking at it. Only the parts that cannot be checked statically (external services in production, real devices, judgments of taste) remain, and it is known what remains |
| Way of checking behind authentication | For each screen and API with authentication, look for a mechanism by which AI gets in through the same path as the owner's authentication | AI can get in without using a bypass or a service token |
