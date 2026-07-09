var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Find line 2055 which has: h(buildingName) + '\") + '\\')\">
// Should be: h(buildingName) + '\">
var lines = content.split('\r\n');
var changed = false;

for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf('back-link') >= 0 && lines[i].indexOf('show-property') >= 0) {
    console.log('Found at line ' + (i + 1) + ':');
    console.log('BEFORE: ' + JSON.stringify(lines[i]));
    // Fix: remove the ') + '\\')" part after h(buildingName) + '
    // Old: ...h(buildingName) + '\") + '\\')\">...
    // New: ...h(buildingName) + '\">...
    lines[i] = lines[i].replace(
      "h(buildingName) + '\\') + '\\\\')\">",
      "h(buildingName) + '\\\">"
    );
    console.log('AFTER:  ' + JSON.stringify(lines[i]));
    changed = true;
  }
}

if (changed) {
  content = lines.join('\r\n');
  fs.writeFileSync(path, content, 'utf8');
  console.log('File updated');
} else {
  console.log('No change made');
}
