# Thoughts
I'm working in this tool in parts, this note should remind me on what to do next, or things I'm thinking to improve and build.


## 0. Refine `chest` tool and use cases
Test a bit more the tool and refine the prototype until I think is solid.


## 1. Directory structure
We have `/bin` and `/packages` dirs, but I'm not convinced neither makes sense.

### Bin
I believe the root `/bin` doesn't necessarily need to be there anymore. I won't need to run them locally anymore from this directory.

What I really want is:
1. Each bin/tool to be located in their own dir, so they can grow in their own lands.
2. Having them accessible globally, so I can execute them by name. For example, running `vspeed` from anywhere. Currently they are copied to the $GLOBAL_BINS dir that is available in my fish config. The `chest` tool should setup this automatically for me.

For these requirements to be met I don't think I need them to be at this dir.

### Packages
I'm not sure I like the name packages here because it reminds me of a monorepo, which is not really the case, this is only one repo with multiple tools, but they are just lightweight dirs and files.

Maybe we could call them "tools", not sure, lets discuss and find a name.


## 2. Language
I want all the scripts to be written in TypeScript, to maintain consistency. This means I can fully read them, type-check them and add dependencies if I need or want any.


## 3. Bootstrapping
We need to consider that one of the first things I will do in a new machine would be to download the zip file of this repo and execute the `bootstrap.sh` to setup the bare minimum for me to setup this machine using `chest` tool.

We need to analyse what we have in `bootstrap.sh` and what `chest` needs in order to run, or what needs to happen for `chest` to be runnable at all.

I would guess we might also not necessarially need to run `bootstrap.sh` and then `chest` we could self invocate one after the other so the process of setting up the machine would be triggered right away after all the dependencies needed are installed.

It does seem that we would also need to run `bun install` or something to install its dependencies, so to avoid that, maybe we could build binaries of the `chest` tool with bun and release them into GitHub so I can just download it directly, then I don't even need to download a zip file and run anything myself, I could just execute that binary. Let's discuss that.


## 4. Tool execution
Now all those bins I have at `/bin` dir today, like `setup-devices` or `vspeed` are kind of shims that are validating some global variables before executing.

I'm not really sure we need this layer, in theory, at the time I'm running each one of them, they should be all set already. I don't think it would exist a use case where I would run one of them and the variables wouldn't be set already.

So I guess that's not needed at all.

The only exception would be the `chest` tool that I will actually run to setup a new machine, after running the `bootstrap.sh`.


## 5. Tidying things up
After we are done completing this tool, do the following:

1. Delete `/docs` dir, that's just temporary.
2. Double-check the `CONTEXT.md` to ensure the glossary actually is up to date with the latest version of what we have in this repo, check one item by one and lets see if they make sense.
3. Delete `NEXT_STEPS.md`, that's just temporary.
4. Delete `utilities/readme.md`.


## 6. utilities/compress-images.md
I should actually write a tool in TypeScript for that too, instead of having a manual guide there. But this will need to be properly refined into a good API and interaction through the CLI.


## 7. Write a proper README.md
Once the tool is complete and the bootstrapping process, I should add a good documentation to this repo.


## 8. Atomic installation and verification
Some tools need multiple commands in their installation or check processes, but currently if one of these steps that is not the first one fails, it still looks like it all when well.

I wanted to have all of them connected so if anything failing in checking, it goes red. If one of the steps in installation failed, revert everything back and I can see they fail and try again myself, or not.


## 9. Zed and `ide` configs
I want to drop completely the zed configurations, I need to find out what is their recommended way to sync things between machines.

The `ide switch` command changes my fish config, which causes the `chest` sync command to mark the fish config as out of sync, which makes sense. So I need to find another way to go around this, maybe I can have a local .config file that has my current ide instead, that file can be created if it doesn't exist automatically when I call `ide` or if is there, it will read it, but this file doesn't need to be synced.


## 10. Dirs
One thing I want `chest` to do as well is to create my `~/projects`
