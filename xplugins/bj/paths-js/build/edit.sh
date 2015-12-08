#!/bin/bash


node ../../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8079 $:/core/save/all \
	|| exit 1


