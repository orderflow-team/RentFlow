var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Simple unique string replacements
var count = 0;

// 1. Fix btn-primardata-action -> btn-primary btn-sm" data-action
var r1 = content.indexOf('btn-primardata-action');
if (r1 >= 0) {
  content = content.substring(0, r1) + 'btn-primary btn-sm" data-action' + content.substring(r1 + 'btn-primardata-action'.length);
  count++;
  console.log('Fixed 1: btn-primardata-action');
}

// 2. Remove the leftover "Id + '\')" after the data-prop-id value
// The leftover is: "Id + '\')" 
// This should just be: "
var r2 = content.indexOf('"Id + ');
if (r2 >= 0) {
  // Check if it has the pattern we expect: "Id + '\')"
  var leftover = content.substring(r2, r2 + 30);
  if (leftover.includes("Id + '")) {
    content = content.substring(0, r2) + '"' + content.substring(r2 + leftover.indexOf("')") + 2);
    count++;
    console.log('Fixed 2: leftover Id string');
  }
}

fs.writeFileSync('src/app.service.ts', content, 'utf8');
console.log('Applied ' + count + ' fixes');
