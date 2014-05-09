MOCHA="node_modules/.bin/mocha"
_MOCHA="node_modules/.bin/_mocha"
JSHINT="node_modules/.bin/jshint"
ISTANBUL="node_modules/.bin/istanbul"
CODECLIMATE="node_modules/.bin/codeclimate"

TESTS=$(shell find test/ -name "*.test.js")

clean:
	rm -rf reports

test:
	$(MOCHA) -R spec $(TESTS)

jshint:
	$(JSHINT) src test

coverage:
	@# check if reports folder exists, if not create it
	@test -d reports || mkdir reports
	$(ISTANBUL) cover --dir ./reports $(_MOCHA) -- -R spec $(TESTS)

codeclimate:
	CODECLIMATE_REPO_TOKEN=6510cac38b6013d9863b71e55830a53ef5b850d76eeaa2b6ab2e15742cd64fa5 $(CODECLIMATE) < reports/lcov.info

ci: clean jshint test coverage codeclimate

.PHONY: clean test jshint coverage codeclimate
