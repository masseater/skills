---
name: check-ci-duration
description: Find CI that has become slow for good, from real GitHub Actions durations on main across all masseater repositories. Use when running the CI duration check of the daily audit.
---

# check-ci-duration

## Why this skill exists and the state it aims for

This skill exists because slow CI creeps: each change adds seconds, every run still passes, and nobody notices until every merge waits. The state it aims for is that a sustained slowdown is found from measurements, traced to the step that causes it, and handed to the thread that can fix it.

## Rules

- Change nothing. Return findings as concrete fixes for the owner.
- Read the durations of `verify`, `release` and the other workflows on main for the last week from real runs. A guess from the workflow file is not a measurement.
- If most successful runs exceed 10 minutes and have for days, report an anomaly. A single slow run is not one.
- For an anomaly, find the cause from step timings and name the step that dominates.
- If a thread is already working on CI speed, send it the timings instead of starting a second effort.
