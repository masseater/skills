# Check CI duration

Find CI that has become slow for good, not once.

1. For every repository, read the durations of `verify`, `release` and the other workflows on main for the last week, from real runs.
2. If most successful runs exceed 10 minutes and have for days, that is an anomaly. A single slow run is not.
3. For an anomaly, find the cause from timings, and name the step that dominates.
4. If a thread is already working on CI speed, send the timings to it rather than starting a second effort.
