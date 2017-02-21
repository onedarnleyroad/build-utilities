# Build Utilities for One Darnley Road

It's probably not of much use to anyone but us! We're used to doing things in a certain way in most
of our projects, so this is a way to DRY out our gulpfiles, and allow older projects to benefit from 
improvements made in newer ones. 

It's also a way to reuse little front end components (mostly JS) again doing things in the same way we always do. Hopefully our projects start to become a bit more about configuration of functionality that lives here.

## Installation
### As a contributor to this repo

You can use NPM link:

As you develop, assuming you have access, you'll want to add things to this repo and thus the package. One way would be to add code, commit, push, npm publish, and then have to npm update in the active project. It's a bit of a faff that might get in the way of developing files in the project.

To get around this, we can use npm link to the git repo.

The steps go like this:

First clone the repository of this module (somewhere other than your main project), and
cd into it. Then set it up as an npm to be linked elsewhere.

```
$ git clone https://github.com/onedarnleyroad/build-utilities
$ cd build-utilities
$ npm link
```

The last command will set it up as a globally available symlink to NPM. Or something. I'm still R-ing-TFM

The next step is to link this module in your current project(s):

```
$ cd /my/project
$ npm install --save-dev 1dr-build-utitilies // this is kinda optional
$ npm link 1dr-build-utilities
```

That's actually it, the utilities are now available in the repo. The second install is optional as it means that if someone else is working on the `/my/project` repo, but you do *not* want them to have access to edit `1dr-build-utilities` then you are saving this package to `package.json` and other developers can still use the tools. But bear in mind there may be a discrepancy in what they compile and what you compile. But for our own use case, this is probably not a real scenario.

**NB: You must `npm install` before the `npm link`, so that the link 'overwrites' the package downloaded from npm. If it's already linke then `npm install` will not overwrite it. However, if you run `npm install 1dr-build-utilities` after the `npm link 1dr-build-utilities` this will remove the link, and install whatever is hosted on NPM.

Further reading: http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears
The above is useful because it explains getting around having to type `sudo` to make the link work, and what's going on with this method.


### Simple installation

If you're just using this repo, but not ever making changes to it (perhaps you aren't 1DR), **or** you're happy to just `npm publish` on this repo whenever you've got new files to add or change then you can install the traditional way:

```
$ npm install --save-dev 1dr-build-utilities
```

It's just a module like any other, but since this set of utilities will contain front end assets that are most likely going to be compiled with gulp, if people have different versions of the modules, then the resulting bundles may have outdated or differently-behaving code, and it could be a bit of a mess for production code. That may just be the price to pay, but it's also possible to use package.json (assuming you're not npm linking) to control the package version.


## Usage

TBC...

