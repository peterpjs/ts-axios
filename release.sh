#!/usr/bin/env sh
set -e
echo "Enter release version: "
read version
read -p "Releasing $version -are you sure?(y/n)" -n 1 -release
echo #(optional) move to a new line
if[[$REPLY=~^[Yy]$ ]]
then
  echo "Releasing $version ..."
  # commit
  git add -a
  git commit -m "[build] $version"
  npm version $version --message "[release] $version"
  git push origin master

  #publich
  npm publish
fi
