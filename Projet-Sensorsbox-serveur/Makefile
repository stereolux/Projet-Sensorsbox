clean:
	rm -rf build
	rm -rf server/node_modules
	rm -rf client/node_modules
	rm -rf client/app/bower_components
	rm -rf client/dist

create_build_dir:
	mkdir build

build_server:
	cp -R -a server/* build
	cd build && npm install

build_client:
	cd client && npm install && bower install && grunt build && cp -R dist ../build/

build: clean create_build_dir build_server build_client
