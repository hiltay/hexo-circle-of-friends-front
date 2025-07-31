rm -rf dist/ && git add . && git commit -m "update" && npm version patch && npm run build && npm publish && git pull --no-edit origin master && git push origin master
