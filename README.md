# Take Back Control

![Screenshot](/.github/screenshot.png?raw=true)

Take back control.
A browser plugin to reduce doomscrolling.

Scroll too far on a blacklisted website, and you'll be prompted with one of
a small selection of inspirational messages. You can customize those
messages to your heart's content, making them as positive or as mean spirited
as you need.

You can also whitelist parts of a website, for example to permit access to
/r/YourHobbySubreddit, while blocking the rest of reddit.

If you really need to, you can click the "It's important" button to see
the content.

## Privacy

No data is collected by this extension for the developer.

If your browser is configured to synchronize addon settings, this feature will
be used to share settings across all logged in instances of that browser. You should review your browser vendor's settings and privacy policy.

## Build Instructions (for Production Extension & Addon Review)

This repo assumes that `make`, `yarn`, `zip`, and `tar` are available on the
path.

1. `git checkout ...` (or decompress the archive)
2. `yarn install`
3. `make`
4. For Firefox:
   - Unsigned extension can be found in `dist/anti-doomscroll.xpi`
   - Source archive for addon review can be found in `dist/anti-doomscroll.tar.gz`
5. For Chrome:
   - Unsigned extension can be found in `dist-chrome/anti-doomscroll.xpi`
   - Source archive for addon review can be found in `dist-chrome/anti-doomscroll.tar.gz`

### Warning for Developers

The build system is a touch messy due to rollUp limitations. `vite.config.ts`
builds the options and popup ui as a module. `vite.cs.config.ts` builds the
content scripts as an IIFE module because content scripts cannot be modules.
An additional pair of config files, `vite.chrome.config.ts` and
`vite.chrome.cs.config.ts` are used for the Chrome build.

RollUp does not allow for these outputs to be represented in the same config
file, so workarounds have been implemented

#### Watch

To run a watch operation:
`yarn watch -t [firefox|chrome]`

This will run scripts/watch.js, which will launch a watch operation on both
config files. Firefox is the default.

#### Build

To build, without packaging, use:
`make yarn-[firefox|chrome]`

To build with packaging, use
`make [firefox|chrome]`

To build and package everything, use
`make`

The current build system does NOT support HMR.

## Legal & Credit

This plugin derives from [opey's "Finite"](https://addons.mozilla.org/en-US/firefox/addon/finite/) plugin. As such,
this code is made available under the MPLv2 License, as described in the LICENSE
file.

This repository contains commits prior to addition of the LICENSE file. Those
commits should be considered made available under MPLv2 as they are a
derivative work.

No warranty, and no liabilty comes with this software.

Thank you opey for the initial implementation.
