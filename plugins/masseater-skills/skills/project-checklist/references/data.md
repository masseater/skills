# data

Confirm where data is stored and how it is changed. When the source of truth is in two places, the contents diverge, and when the schema is changed by hand, production drifts from the definition. Follow the backing services and admin processes of [The Twelve-Factor App](https://12factor.net/) for the approach.

| Item to check | How to check the current state | Condition for being satisfied |
| --- | --- | --- |
| Storage location for each piece of data | From the infrastructure definitions and the schema, make a list of storage locations for each kind of data | The source of truth for each piece of data is in one place |
| Procedure for changing the schema | Check the migration files and the diff check against the schema | The schema is changed only through migrations, and the check fails if there is a diff |
| Per-viewer data and caches | Check the cache keys and the values that are cached | Values that differ per viewer do not go into a cache shared between viewers |
