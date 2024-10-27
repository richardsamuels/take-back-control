.PHONY: all clean yarn

all: dist/anti-doomscroll.xpi dist/anti-doomscroll.tar.gz

yarn:
	yarn build -c vite.cs.config.ts
	yarn build -c vite.config.ts

dist/anti-doomscroll.xpi: yarn $(wildcard dist/**/*)
	cd dist && zip -r -FS anti-doomscroll.xpi * --exclude '*.git*' --exclude '*.map'

dist/anti-doomscroll.tar.gz: yarn $(wildcard dist/**/*)
	tar -czvf dist/anti-doomscroll.tar.gz --exclude='.git' --exclude='dist' --exclude="node_modules" .

clean:
	rm dist/*.xpi
