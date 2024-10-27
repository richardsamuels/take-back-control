.PHONY: all clean yarn firefox chrome

all: firefox chrome
firefox: dist/anti-doomscroll.xpi dist/anti-doomscroll.tar.gz
chrome: dist-chrome/anti-doomscroll.xpi dist-chrome/anti-doomscroll.tar.gz

yarn:
	yarn build -c vite.cs.config.ts
	yarn build -c vite.chrome.cs.config.ts
	yarn build -c vite.config.ts
	yarn build -c vite.chrome.config.ts

chrome:

dist/anti-doomscroll.xpi: yarn $(wildcard dist/**/*)
	cd dist && zip -r -FS anti-doomscroll.xpi * --exclude '*.git*' --exclude '*.map'

dist/anti-doomscroll.tar.gz: yarn $(wildcard dist/**/*)
	tar -czvf dist/anti-doomscroll.tar.gz --exclude='.git' --exclude='dist' --exclude='dist-chrome' --exclude="node_modules" .

dist-chrome/anti-doomscroll.xpi: yarn $(wildcard dist-chrome/**/*)
	cd dist-chrome && zip -r -FS anti-doomscroll.xpi * --exclude '*.git*' --exclude '*.map'

dist-chrome/anti-doomscroll.tar.gz: yarn $(wildcard dist-chrome/**/*)
	tar -czvf dist-chrome/anti-doomscroll.tar.gz --exclude='.git' --exclude='dist' --exclude='dist-chrome' --exclude="node_modules" .

clean:
	rm -rf dist/ dist-chrome/
