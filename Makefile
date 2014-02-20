.PHONY: all f-dev server setup test install clean rebuild-js

lint:
	@node_modules/jshint/bin/jshint --reporter=./config/reporter.js ./

