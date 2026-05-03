#!/bin/zsh


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source ~/.zshrc

nvm install 22
nvm use 22

npm install babylonjs --save
npm install babylonjs-materials --save