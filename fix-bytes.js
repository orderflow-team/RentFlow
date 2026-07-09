var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var buf = Buffer.from(content, 'utf8');

// Helper: search for a byte sequence in a buffer
function searchBytes(buf, seq) {
  for (var i = 0; i <= buf.length - seq.length; i++) {
    var match = true;
    for (var j = 0; j < seq.length; j++) {
      if (buf[i + j] !== seq[j]) { match = false; break; }
    }
    if (match) return i;
  }
  return -1;
}

// Helper: create a byte sequence from a string
function toBytes(s) {
  return Buffer.from(s, 'utf8');
}

// Helper: convert content to string, replace, and back
function replaceText(content, oldText, newText) {
  if (content.indexOf(oldText) >= 0) {
    return content.split(oldText).join(newText);
  }
  return null;
}

var count = 0;

// Fix 1: Back-link line 1545 - leftover '") + '\\')"> 
// The content has: h(buildingName) + '") + '\\')">
// Should be:      h(buildingName) + '">
// Note: In the raw file, the backslash-quote sequences are:
// Inside the TS template literal, we have literal backslashes and quotes
// Let me search for the unique pattern: '") + '
var result = replaceText(content, "h(buildingName) + '\\') + '\\\\')\">", "h(buildingName) + '\\\">");
if (result) {
  content = result; count++;
  console.log('Fix 1 applied');
} else {
  // Try without some escapes
  result = replaceText(content, "h(buildingName) + '\") + '\\\\')\">", "h(buildingName) + '\">");
  if (result) { content = result; count++; console.log('Fix 1 (alt) applied'); }
}

// Let's also try more direct approach: read the actual bytes around known positions

console.log('Total fixes:', count);
fs.writeFileSync(path, content, 'utf8');
console.log('File written');

// Now debug: find the exact byte pattern for the other issues
var c2 = content;
var search1 = c2.indexOf('<button');
var search2 = c2.indexOf('penUnitModal');
console.log('First <button at:', search1);
console.log('penUnitModal at:', search2);

// Show what's around penUnitModal
if (search2 >= 0) {
  var start = Math.max(0, search2 - 80);
  var end = Math.min(c2.length, search2 + 80);
  console.log('Around penUnitModal:');
  var snippet = c2.substring(start, end);
  console.log(JSON.stringify(snippet));
}
