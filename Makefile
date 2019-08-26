BIN = node_modules/.bin

.PHONY: bootstrap lint start test

bootstrap:
	npm install

lint:
	$(BIN)/standard

start:
	${BIN}/nodemon index.js

test:
	make lint
	node index.js &
	${BIN}/newman run https://www.getpostman.com/collections/89ba0c919d73304be70d -e postman_environment.json
