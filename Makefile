.PHONY: all clean test dependencies build dropdown_example

TSC=$(CURDIR)/node_modules/typescript/bin/tsc
MOCHA=$(CURDIR)/node_modules/mocha/bin/mocha
BEEFY=$(CURDIR)/node_modules/beefy/bin/beefy

all: build

build: src/allorryll.ts dependencies
	$(TSC)

clean:
	rm -rf build

clean_dependencies:
	rm -rf node_modules

dependencies:
	if [ ! -d node_modules ]; then npm install; fi

test: build
	$(MOCHA)

dropdown_example:
	$(BEEFY) src/examples/dropdown.ts:build/examples/dropdown.js --live -- -p [ tsify ]



