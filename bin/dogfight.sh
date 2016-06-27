#!/bin/bash
if [ "$1" = "hello" ]; then
    echo "Action: Hello"
elif [ "$1" = "serve" ]; then
    (cd ../; sproutcore server --allow-from-ips='*.*.*.*')
elif [ "$1" = "build" ]; then
    (cd ../; sproutcore build --buildroot=./build --languages=en)
    (cd ../; find ./build/ -type f -name '*.js' -o -name '*.css' -o -name '*.html' -exec sed -i '' -e 's/\"\/static\/sproutcore/\"\/dogfight.io\/build\/static\/sproutcore/g' {} \;)
    (cd ../; find ./build/ -type f -name '*.js' -o -name '*.css' -o -name '*.html' -exec sed -i '' -e 's/\"\/static\/df/\"\/dogfight.io\/build\/static\/df/g' {} \;)
elif [ "$1" = "commit" ]; then
    (cd ../; git add .)
    (cd ../; git commit -m "Commit")
    (cd ../; git push origin gh-pages)
else
    echo "Usage:"
    echo "- serve: Serve"
    echo "- build: Build"
fi
