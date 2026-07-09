var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');

// Find showPropertyDetail onclick patterns
var idx = 0;
var found = 0;
while (true) {
  idx = content.indexOf('showPropertyDetail', idx);
  if (idx < 0) break;
  // Check if this is an onclick handler (not the function definition)
  var before = content.substring(Math.max(0, idx - 80), idx + 80);
  if (before.includes('onclick=') && !before.includes('getAttribute') && !before.includes('case')) {
    found++;
    console.log('=== showPropertyDetail #' + found + ' at byte ' + idx + ' ===');
    // Show the onclick part specifically
    var onclickIdx = before.indexOf('onclick=');
    var realIdx = Math.max(0, idx - 80) + onclickIdx;
    var onclickHandler = content.substring(realIdx, Math.min(content.length, realIdx + 100));
    console.log('ONCLICK JSON:', JSON.stringify(onclickHandler));
    console.log('ONCLICK HEX:', Buffer.from(onclickHandler, 'utf8').toString('hex'));
    // Show character codes
    var codes = [];
    for (var i = 0; i < onclickHandler.length; i++) {
      codes.push(onclickHandler.charCodeAt(i));
    }
    console.log('ONCLICK CODES:', codes.join(','));
  }
  idx++;
}

console.log('\nTotal onclick showPropertyDetail found: ' + found);

// Also check for showBuildingDetail
idx = 0;
var bFound = 0;
while (true) {
  idx = content.indexOf('showBuildingDetail', idx);
  if (idx < 0) break;
  var before = content.substring(Math.max(0, idx - 80), idx + 80);
  if ((before.includes('onclick=') || before.includes('onchange=')) && !before.includes('getAttribute') && !before.includes('case')) {
    bFound++;
    console.log('\n=== showBuildingDetail #' + bFound + ' ===');
    var onclickIdx = before.indexOf('onclick=') >= 0 ? before.indexOf('onclick=') : before.indexOf('onchange=');
    var realIdx = Math.max(0, idx - 80) + onclickIdx;
    var onclickHandler = content.substring(realIdx, Math.min(content.length, realIdx + 120));
    console.log('JSON:', JSON.stringify(onclickHandler));
    console.log('HEX:', Buffer.from(onclickHandler, 'utf8').toString('hex'));
  }
  idx++;
}

console.log('\nTotal onclick/onchange showBuildingDetail found: ' + bFound);

// Also show the raw line with \n chars
var lines = content.split('\n');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].includes('showPropertyDetail') && lines[i].includes('p.id')) {
    console.log('\n=== RAW LINE ' + (i+1) + ' ===');
    var buf = Buffer.from(lines[i], 'utf8');
    for (var j = 0; j < buf.length; j++) {
      process.stdout.write(buf[j].toString(16).padStart(2,'0') + ' ');
    }
    console.log();
  }
}
