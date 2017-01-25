.PHONY: all clean test dependencies

clean:
	rm -rf build node_modules

dependencies:
	npm install --save-dev jsdom mocha

test:


all: 
