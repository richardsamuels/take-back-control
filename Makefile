.PHONY: all clean yarn yarn-firefox yarn-chrome firefox chrome

all: firefox chrome
firefox: dist/FIREFOX_anti-doomscroll_UNSIGNED.xpi dist/FIREFOX_anti-doomscroll.tar.gz
chrome: dist-chrome/CHROME_anti-doomscroll_UNSIGNED.xpi dist-chrome/CHROME_anti-doomscroll.tar.gz

yarn: yarn-firefox yarn-chrome

yarn-firefox:
	yarn build -c vite.cs.config.ts
	yarn build -c vite.config.ts
yarn-chrome:
	yarn build -c vite.chrome.cs.config.ts
	yarn build -c vite.chrome.config.ts

dist/FIREFOX_anti-doomscroll_UNSIGNED.xpi: yarn $(wildcard dist/**/*)
	cd dist && zip -r -FS FIREFOX_anti-doomscroll_UNSIGNED.xpi * --exclude '*.git*' --exclude '*.map'

dist/FIREFOX_anti-doomscroll.tar.gz: yarn $(wildcard dist/**/*)
	tar -czvf dist/FIREFOX_anti-doomscroll.tar.gz --exclude='.git' --exclude='dist' --exclude='dist-chrome' --exclude="node_modules" .

dist-chrome/CHROME_anti-doomscroll_UNSIGNED.xpi: yarn $(wildcard dist-chrome/**/*)
	cd dist-chrome && zip -r -FS CHROME_anti-doomscroll_UNSIGNED.xpi * --exclude '*.git*' --exclude '*.map'

dist-chrome/CHROME_anti-doomscroll.tar.gz: yarn $(wildcard dist-chrome/**/*)
	tar -czvf dist-chrome/CHROME_anti-doomscroll.tar.gz --exclude='.git' --exclude='dist' --exclude='dist-chrome' --exclude="node_modules" .

clean:
	rm -rf dist/ dist-chrome/
