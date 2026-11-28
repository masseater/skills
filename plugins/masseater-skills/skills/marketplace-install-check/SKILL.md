---
name: marketplace-install-check
description: Check whether the masseater-skills plugin can be added from the claude.ai marketplace again, and if so move the cloud environment setup back to it and remove the temporary setup-script install. Use when the daily marketplace install check scheduled task fires or the owner asks whether the workaround can go.
---

# marketplace-install-check

## Why this skill exists and the state it aims for

This skill exists because `masseater-skills` is installed in the cloud environment 「個人・あすなろ」 by a line in its setup script, and that is a temporary workaround. The normal way is to add the plugin from the marketplace, but a bug in the Claude app made that impossible on 2026-11-28, so the setup script runs `claude plugin install masseater-skills@masseater` instead. A workaround that nobody checks becomes a second install path that stays forever: the plugin is then managed in two places, which `masseater-style` forbids, and a fix on the app side goes unnoticed.

The state this skill aims for is that `masseater-skills` comes from the marketplace alone, the setup script has no line that installs it, and no note says that a workaround is in place.

## Rules

- The information sources are the plugins the claude.ai account has (`ListPlugins`, and `SearchPlugins` with the keyword `masseater-skills`), the setup script of the environment `env_018gUDNTzQHd13KvJKc6FqQ4` (`get_environment`), the notes on the workaround in `plugins/masseater-skills/README.md` in masseater/skills and in the project memory note `cloud-plugins`.
- The marketplace install works again only when `ListPlugins` lists `masseater-skills` from the marketplace `masseater` as enabled. The `claude plugin list` of the session that runs this skill proves nothing, because the setup script installs the plugin there.
- When it works again, remove from the setup script the `masseater-skills` argument of `add_marketplace`, its `claude plugin update masseater-skills@masseater` and the comment that says it is a workaround, using `update_environment` and nothing else in the script. Remove the notes on the workaround from the README and the memory note, in a pull request for the README.
- When it does not work, change nothing. The run is not a reason to touch the setup script.
- Write the README text in English and translate it with PLaMo, fixing only clear mistranslations.

## Finished state

- When the marketplace install works again, the setup script of the environment no longer installs `masseater-skills`, the README and the memory note no longer call the install a workaround, and the last message of the run's thread says so in one line with the pull request.
- When it still does not work, the last message of the run's thread is one line saying that the marketplace install is still unavailable and the date checked. Nothing is sent to the coordinator.
- When a source could not be read, or `masseater-skills` is installed neither from the marketplace nor by the setup script, one line naming the source or the gap is sent to the coordinator.
- The thread is resolved.
