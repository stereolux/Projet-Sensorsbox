clean:
	rm -rf build

test:
	echo "some tests"

build:
	mkdir build
	cd server && rm -rf node_modules && npm i && cd .. && cp -R -a server/* build
	cd client && rm -rf node_modules && rm -rf app/bower_components && rm -rf dist && npm i && bower i && grunt build && cp -R dist ../build/

heroku:
	git subtree push --prefix build heroku master

ci: test build heroku
