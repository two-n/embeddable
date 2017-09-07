#!/bin/sh
node_modules/.bin/browserify test/src/index.js > test/src/embeddable.build.js
node_modules/.bin/electron test/src/index.html
