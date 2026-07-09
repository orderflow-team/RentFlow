var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var changes = 0;

// Define replacements as [oldString, newString] pairs
// The oldString is what's currently in the file, newString is what it should be
var replacements = [];

// Fix 1: Back-link line - leftover '") + '\') after h(buildingName) + '
// Currently: h(buildingName) + '") + '\\')">
// Should be:  h(buildingName) + '">
//
// In raw file content (inside template literal):
// The actual characters are: + ' + " + ) + space + + + space + ' + \ + \ + ' + ) + " + >
// Which looks like: '") + '\\')">
// But due to TS template literal escaping, the \\ in the file represents two backslashes

// Let me search for the ACTUAL content by reading the file as bytes and finding the unique substring
var backlinkSearch = 'h(buildingName) + \\""';
// Actually, let me search for it with file.read

// Find the exact location of the back-link with show-property in the template
var idxBL = content.indexOf("data-action=\"show-property\" data-id=\"");
if (idxBL >= 0) {
  // Find the full line
  var lineStart = content.lastIndexOf('\n', idxBL);
  var lineEnd = content.indexOf('\n', idxBL);
  var line = content.substring(lineStart, lineEnd);
  console.log('Backlink line found at', idxBL);
  console.log('Full line:', JSON.stringify(line.substring(0, 200)));
}
