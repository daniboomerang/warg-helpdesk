#!/bin/bash

grunt build
git status
git add -A
git commit -m "generated www via grunt build for heroku"
git push git@heroku.com:warg-helpdesk.git