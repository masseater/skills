# Effects and data

The only thing you may write in an Effect is synchronization with the outside world that React does not know about: the DOM, measurement, widgets, and subscriptions that are not data. Return a cleanup.

| What you want to do | How to write it |
| --- | --- |
| A value that can be computed from props or state | Compute it during render |
| Reset state when a prop changes | Pass a `key` to the child, or compute it during render |
| Notify the parent of a change | Call the parent's function in the event handler |
| Do something only once on mount | First check whether it can be an event or a loader |
