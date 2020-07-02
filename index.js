#!/usr/bin/env node

var fs = require('fs');

const { classes } = require('./tailwind-classes')
const escapeRegExp = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
const prefix = 'tw-'

const  fileArg = process.argv[2];

if(!fileArg){
  console.log("Please Specify file to Transform! Exiting!");
  process.exit(1);
}

console.log("Transforming " + fileArg);

const CURR_DIR = process.cwd();

fs.readFile(`${CURR_DIR}/${fileArg}`, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  classes.forEach(cls => {
    data = data.replace(
      new RegExp(
        `(["':\\s])(?!${prefix})(-?${escapeRegExp(cls)})(?![-\/])`,
        'g',
      ),
      `$1${prefix}$2`,
    )
  });
  //Replace class names for react
  data = data.replace(/class=/g,'className=');

  fs.writeFile(`${CURR_DIR}/${fileArg}`, data, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
