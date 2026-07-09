var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var lines = content.split('\r\n');

// Fix the back-link line: remove extraneous onclick handler
// Current: ...data-name="' + h(buildingName) + '" onclick="showProperty(\\' + propId + '\\')">...
// Target:  ...data-name="' + h(buildingName) + '">...
for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf('back-link') >= 0 && lines[i].indexOf('show-property') >= 0) {
    console.log('LINE ' + (i + 1) + ' BEFORE: ' + JSON.stringify(lines[i]));
    // Remove onclick and everything between it and the >
    var onclickIdx = lines[i].indexOf('" onclick=');
    if (onclickIdx >= 0) {
      var gtIdx = lines[i].indexOf('">', onclickIdx);
      if (gtIdx >= 0) {
        lines[i] = lines[i].substring(0, onclickIdx + 1) + lines[i].substring(gtIdx + 1);
      }
    }
    console.log('LINE ' + (i + 1) + ' AFTER:  ' + JSON.stringify(lines[i]));
  }
}

content = lines.join('\r\n');
fs.writeFileSync(path, content, 'utf8');
console.log('File written');
