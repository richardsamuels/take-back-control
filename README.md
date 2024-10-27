# Anti-Doomscroll

Take back control.
A browser plugin to prevent doomscrolling.

Scroll too far on a blacklisted website, and you'll be prompted with one of
a small selection of inspirational messages. You can customize those
messages to your heart's content, making them as positive or mean spirited
as you need.

You can also whitelist parts of a website, for example to permit access to
/r/HobbySubreddit, while blocking the rest of reddit.

If you really need to, you can click the "It's important" button to see
the content.

## Future Work
- Offer feature to trigger anti-doomscroll wall after measuring time on page instead of scrolling (User configurable)
- Make it less ugly
- Dark mode
- Import and Export of settings

## Build Instructions (for Production Extension & Addon Review)
This repo assumes that `make`, `yarn`, `zip`, and `tar` are available on the
path.

1. `git checkout ...` (or decompress the archive)
2. `yarn install`
3. `make`
4. Unsigned extension can be found in `dist/anti-doomscroll.xpi`
5. Source archive for addon review can be found in `dist/anti-doomscroll.tar.gz`

### Warning for Developers
The build system is a touch messy due to rollUp limitations. `vite.config.ts`
builds the options and popup ui as a module. `vite.cs.config.ts` builds the
content scripts as an IIFE module because content scripts cannot be modules.

RollUp does not allow for these outputs to be represented in the same
config file,so you should run two watch commands in separate windows when
developing:
- `yarn watch . -c vite.config.ts`
- `yarn watch . -c vite.cs.config.ts`

You can manually reload the extension after making changes to the content script

When using `make` (including the `yarn` target) to run the build, both
config files will be built.

## Legal & Credit
This plugin derives from [opey's "Finite"](https://addons.mozilla.org/en-US/firefox/addon/finite/) plugin. As such,
this code is made available under the MPLv2 License, as described in the LICENSE
file.

This repository contains commits prior to addition of the LICENSE file. Those
commits should be considered made available under MPLv2 as they are a
derivative work.

No warranty, and no liabilty comes with this software.

Thank you opey for the initial implementation.
