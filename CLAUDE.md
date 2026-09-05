We are working on a tool called `chest` which a tool the user will use for:
1. Setting up a new machine from scratch, by installing apps, tools, etc.
2. Comparing the current machine's configuration or app, tools against this repo's manifests so the user knows what's currently missing and can cherry-pick what to sync.

Right now we are in the process of improving this tool, we are working on the `pchest` located at `chest/prototype/` which is a prototype of `chest` where the user is refining how the interactions with the tool will be like.

Once we reached a final state, we should use this prototype as a reference to build the final version of the tool. The user will prompt you to do that, when the time comes.

## Docs
Decisions are being written at `docs/adr` for later reference.

## Glossary
You can find the shared glossary for this project at `CONTEXT.md` update as you go, once we define new names or terms for this project.

## Instructions for @clack/prompts
In case you need more info on how to use it, read https://bomb.sh/docs/clack/packages/prompts.md
