.PHONY: start
export NODE_PATH = .

start:
	DEBUG=wiggin:* ./node_modules/.bin/supervisor -i app/views --no-restart-on error -- index
