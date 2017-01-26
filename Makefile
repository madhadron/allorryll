.PHONY: all clean test dependencies
all: build

build: src/allorryll.ts
		tsc

clean:
	rm -rf build

dependencies:
	npm install --save-dev jsdom mocha

test: build
	./node_modules/mocha/bin/mocha
