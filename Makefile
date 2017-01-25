.PHONY: all clean test dependencies
all:
		tsc

clean:
	rm -rf build node_modules

dependencies:
	npm install --save-dev jsdom mocha

test:
