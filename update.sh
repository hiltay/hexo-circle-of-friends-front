rm -rf dist/ && npm version patch && npm run build && npm publish && git add . && git commit -m "update" && git pull --no-edit origin master && git push origin master
