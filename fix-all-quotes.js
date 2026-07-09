var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Find the getDashboardPage function
var dashIdx = content.indexOf('getDashboardPage(): string');
if (dashIdx === -1) {
  console.log('ERROR: Could not find getDashboardPage');
  process.exit(1);
}

// Get the content from getDashboardPage onwards
var beforeDash = content.substring(0, dashIdx);
var dashContent = content.substring(dashIdx);

// In the TS source, the issue is: \'' (backslash + two single quotes)
// This compiles to '' (two unescaped quotes) in the JS output
// The fix: replace \'' with \\'' (double backslash + two single quotes)
// Which compiles to \'' (escaped quote + quote) in the JS output

var bs = String.fromCharCode(92); // backslash
var sq = String.fromCharCode(39); // single quote

// Pattern to find: \'' (backslash + quote + quote)
var searchPattern = bs + sq + sq;
// Replacement: \\'' (two backslashes + two quotes)  
var replacePattern = bs + bs + sq + sq;

// But we need to be careful - some \'' might be in CSS or other contexts
// Let's only replace in JS code sections (after the first <script> tag)
var scriptIdx = dashContent.indexOf('<script>');
if (scriptIdx === -1) {
  console.log('ERROR: Could not find script tag');
  process.exit(1);
}

var beforeScript = dashContent.substring(0, scriptIdx);
var scriptContent = dashContent.substring(scriptIdx);

// Count occurrences
var count = 0;
var pos = scriptContent.indexOf(searchPattern);
while (pos >= 0) {
  count++;
  scriptContent = scriptContent.substring(0, pos) + replacePattern + scriptContent.substring(pos + searchPattern.length);
  pos = scriptContent.indexOf(searchPattern, pos + replacePattern.length);
}

console.log('Replaced ' + count + ' occurrences');

// Reassemble
content = beforeDash + beforeScript + scriptContent;
fs.writeFileSync('src/app.service.ts', content, 'utf8');
console.log('Done');
