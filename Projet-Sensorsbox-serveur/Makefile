clean:
	rm -rf node_modules
	rm -rf client/node_modules
	rm -rf client/app/bower_components
	rm -rf client/dist

build_server:
	npm install

build_client:
	cd client && npm install && bower install && grunt build

build: clean build_server build_client

.PHONY: clean build_server build_client build
