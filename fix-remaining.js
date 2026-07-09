var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');

// Fix 1: Replace the broken show-building card line
// The broken text contains "margdata-action" as a single word
// Old partial: ...so;margdata-action="show-building" ... + propId + '\\')">
// New: ...so;margin-right:10px;" data-action="show-building" ... propId + '">
var fix1Count = 0;
var lines = content.split('\n');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf('margdata-action') >= 0) {
    console.log('Found margdata-action in line ' + (i + 1));
    // Replace margdata-action with proper format
    lines[i] = lines[i].replace('margdata-action', 'margin-right:10px;" data-action');
    // Also remove leftover + propId + '\\')" 
    var leftoverIdx = lines[i].indexOf("+ propId + '");
    if (leftoverIdx >= 0) {
      // Find the '"> after this leftover and keep only up to that
      var endIdx = lines[i].indexOf("'>", leftoverIdx);
      if (endIdx >= 0) {
        lines[i] = lines[i].substring(0, endIdx + 2);
      }
    }
    fix1Count++;
    console.log('Fix 1 applied: ' + JSON.stringify(lines[i]).substring(0, 200));
  }
}
console.log('Fix 1 applied ' + fix1Count + ' times');

// Fix 2: Fix show-tenant line - "tag-gray'data-action" needs space
for (var i = 0; i < lines.length; i++) {
  if (lines[i].indexOf("tag-gray'data-action") >= 0) {
    console.log('Found tag-gray data-action issue in line ' + (i + 1));
    lines[i] = lines[i].replace("tag-gray'data-action", "tag-gray' data-action");
    // Also remove leftover onclick handler text after data-id
    var lidx = lines[i].indexOf('\\"ter\\" onclick=');
    if (lidx >= 0) {
      // Find the '> that closes the <tr> opening tag after this leftover
      var trEnd = lines[i].indexOf('><td>', lidx);
      if (trEnd >= 0) {
        lines[i] = lines[i].substring(0, trEnd);
      }
    }
    console.log('Fix 2 applied');
  }
}

content = lines.join('\n');
fs.writeFileSync(path, content, 'utf8');
console.log('File written');
