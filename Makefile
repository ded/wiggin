.PHONY: all f-dev server setup test install clean rebuild-js

# IMPORTANT! - put your env variables in makefile-variables.mk
include ./config/makefile-variables.mk

# installs the dev environment dependencies
install:
	npm install .

# get this party started
setup: install build-ender rebuild-js

# used to prepare new ender builds
# see ./client/ender/package.json for client deps
build-ender:
	mkdir -p ./public/js/ender
	node $(TASKS_PATH)/build-ender

# builds, concats, minifies dependency tree in client/app.js
build-js: copy-vendor-to-public
	DEBUG=wiggin:task node $(TASKS_PATH)/build-js-bundles.js

copy-vendor-to-public:
	mkdir -p $(PUBLIC_PATH)/js/vendor
	cp -r ./client/vendor/* $(PUBLIC_PATH)/js/vendor/

# runs the Less Parser and compiles to app.min.css
build-css: $(PUBLIC_CSS)
	$(NODE_MODULES_PATH)/less/bin/lessc -x ./app/assets/less/boot.less > $(PUBLIC_PATH)/css/app.min.css
	DEBUG=wiggin:task node $(TASKS_PATH)/rtl.js
	DEBUG=wiggin:task node $(TASKS_PATH)/gzip-css-assets.js

lint:
	$(NODE_MODULES_PATH)/jshint/bin/jshint --reporter=./config/reporter.js ./

rebuild: clean-public build-ender rebuild-js build-css copy-img

rebuild-js: build-client-views build-js

copy-img:
	mkdir -p $(PUBLIC_IMG)
	find app/assets/img -maxdepth 2 -type f -exec cp '{}' $(PUBLIC_IMG) \;

$(PUBLIC_CSS) $(PUBLIC_IMG):
	mkdir -p $@

clean-public:
	rm -rf $(PUBLIC_PATH)/*

clean: clean-public
	rm -rf $(NODE_MODULES_PATH)

build-client-views:
	rm -rf $(PUBLIC_PATH)/js/views
	$(NODE_MODULES_PATH)/jade/bin/jade.js --client --no-debug --path ./ app/views
	DEBUG=wiggin:task node $(TASKS_PATH)/build-client-views.js
