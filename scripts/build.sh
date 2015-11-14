#!/bin/bash -e

babel=node_modules/.bin/babel
webpack=node_modules/.bin/webpack

rm -rf build
mkdir -p build/app
$babel -d build/app src
node -p 'p=require("./package");p.main="app";p.scripts=p.devDependencies=undefined;JSON.stringify(p,null,2)' > build/package.json
#$webpack --config webpack.config.js --progress --colors