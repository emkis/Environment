# Context

I want to solve a few problems and your goal right now is to make sure that you understand the problems I'm talking about. If not, ask me questions. If you do understand, just say you do understand, is it is clear and is ready to be worked on. and I do not care too much about the details right now. I only care about you understanding what are my pain and what are my pain points and what are my goals. And based on that, I you would work by yourself. But first, once we are in enlightenment, I want you to write like a small plan that will show to me what you understood, and then I will confirm when you should start working.

Many existing markdown files in this repository and also scripts will be able to be dropped soon as we have like a good more like a stable solution. So it's also fine to delete them. I can get them back on a different branch as they are already committed. So no worries about changing/deleting files.

## Use case 1: Dotfiles and Bin syncing
This is my main pain point, the one I'm looking for the best solution for, as this is the thing that mostly annoys me in my day to day work.

There are already a lot of well-known tools that solve this problem, we don't need to create another tool, if an existing one already solves all I need. Do research to find some, the ones I know are:

- GNU Stow
- chezmoi

What I want
1. Symlink all my dotfiles in this repository with my machine, in the right directory each one of them should be. If is a new machine that doesn't have them there, it should do the initial setup.
2. Symlink in `~/bins` dir, all my local bins. Now this happens manually with the `./bin/sync-bins` script.
3. These key files should be kept in this repo, and I prefer symlinks because if I need to edit them outside this repo, I know they will be updated here too, so I can commit them myself.
4. I don't want to put my dotfiles neither these bins in any other repo, I only want to use this one.
5. If I pull this repo from remote and I now have new dotfiles and bins, that aren't yet available outside this repo, I should be able to run a command to make them available too.


## Use case 2: Setting up a new MacOS machine
This is a secondary pain point, this doesn't happen often, so I'm fine not having the best solution.

This problem depends on Use case 1 being solved, but we can still discuss about it.

so I actually I'm setting up a new Mac Mac OS machine right now and in a few months I'll need to set up a new one. So this is not something that actually happens quite often. It's just something that by accident happened right now. And so I'm not trying to optimize setting up a new Mac OS like every month or anything. So this is actually a problem that the majority of the time is not actually going to be a problem. So I don't need perfection right now. I only want to automate certain parts of the setup of a new macOS for when I actually have those situations as right now where I need to set up two machines. So my goal is to optimize as much as possible of my setup of a new machine. But if things are too complicated, I don't want to overcomplicate things. I know that macOS requires a lot of manual actions and I'm fine having manual steps to do. What I'm looking for right now is specifically automating installing the applications and my colony some key repositories that I need is essentially setting up my machine with the applications I need, the CLIs I need, and my core directories that I rely on.

So here we should consider that this new machine is really like empty. so what I'm thinking on doing right now is essentially running a few scripts or maybe just one script. I don't know actually what's the best way of doing this and this is something for you to figure it out. But I'm what I was thinking was on going to GitHub through the browser, as I don't have anything set up on this new machine, right? So then I can open the browser, I can go to my repository which is public, the repository where I have this this this repository you are right now is public on GitHub and I can go there, I can bu download a few bash scripts or something, and then I can run them and then this will configure a few things that I need, and that's kind of what I'm looking for. It's just like an easy way to go to hip GitHub, download this file, run this file, and then I have a few things set up. I don't need everything to be set up at once. And I know that Mac OS, for example, requires to have the X code tools need to approve permissions and settings and so on so there's a lot of manual things I I know I I will need to do and I'm fine with that. so if you need to split sections of different things I need to do, like few scripts that I need to run in this particular particularly order, that's alright as well.

Consider a new macOS machine doesn't have a lot of built-in tools, and we might require installing some tools first so the requirements can be fulfilled.

What I need in a new machine
1. Install everything in the `Brewfile` in the root of this repo.
2. Update the MacOS dock configuration located at `recipes/setting-up-user-apps/run.sh`
3. Creating `~/projects` dir.
4. Cloning the `https://github.com/emkis/Environment.git` (this repository) into `~/projects` dir.
5. Syncing all my dotfiles from the `Environment` repository (this repository). Assuming we already have a easy way to sync them.
6. Syncing all my bins inside the `Environment` repository (this repository) with my `~/bin` dir. Look for `sync-bins` script to see all of them that are global accessible in my PATH.

Many of these `run.sh` scripts and markdown files can be dropped, as they were already replaced by the `Brewfile`.

## Organising this repo
I want the repo to have a directory structure similar to this below.

Each tool, which is one of my CLIs or bash scripts I have in my global bins should have their own directories, which will allow them to grow into multiple files if needed.

Dotfiles should be all colocated and together.

For now, lets move the `compress-images.md` and other .md files into `guides` dir, later I will organise them. Feel free to drop the ones that aren't needed, as the `readme.md` dirs inside each dir that might not be helpful anymore.

```
dotfiles/
tools/
  ide/
    index.ts
  vspeed/
    index.ts
  setup-devices/
    index.sh
setup/ # all scripts for setting up a new machine
  macos.sh
guides/
  manual-steps.md
```


## Constraints

- Do not install or remove anything existing in this machine.
- Do not edit this file.
