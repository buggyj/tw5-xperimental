#!/bin/bash

# add the root of tw5 
if [  -z "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

if [  ! -d "$TW5_ROOT" ]; then
    TW5_ROOT=../../../../../../..
fi

# add path to root of plugin
export TIDDLYWIKI_PLUGIN_PATH="${PWD%/*/*/*}:$TIDDLYWIKI_PLUGIN_PATH"

node $TW5_ROOT/tiddlywiki.js \
	./demo \
	--verbose \
	--rendertiddler $/mcore/templates/testing $TW5_BUILD_OUTPUT/msgbtag.html text/plain \
	|| exit 1


