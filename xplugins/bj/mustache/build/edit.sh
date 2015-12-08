#!/bin/bash


node ../../../../../tiddlywiki.js \
	./demoedit \
	--verbose \
	--server 8077 $:/core/save/all \
	|| exit 1


