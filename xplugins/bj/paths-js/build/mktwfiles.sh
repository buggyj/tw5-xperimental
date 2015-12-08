 find ../source -type f -exec ls {} \; 2> /dev/null| cut -c 11- | ./twfileshelper.sh >../source/tiddlywiki.files
