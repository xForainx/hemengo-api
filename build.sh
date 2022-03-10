#!/bin/bash
npm run doc
git add docs
git commit docs -m "Build docs"
git push origin master
echo "docs has been built"