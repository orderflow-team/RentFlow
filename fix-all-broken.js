var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var count = 0;

// Fix 1: Back-link line (line 1545)
// Current: '" data-name=\"' + h(buildingName) + '\") + '\\\\')\">'
// Target:  '" data-name=\"' + h(buildingName) + '\">'
var idx = content.indexOf(" + h(buildingName) + '\\') + '\\\\')\">");
if (idx >= 0) {
  var before = content.substring(0, idx);
  var after = content.substring(idx);
  after = after.replace(" + h(buildingName) + '\\') + '\\\\')\">", " + h(buildingName) + '\\\">");
  content = before + after;
  count++;
  console.log('Fix 1 applied');
} else {
  console.log('Fix 1 NOT found');
}

// Fix 2: Add-unit button (line 1547)
// Current: data-building-id=\"' + buildingId + '\"penUnitModal(...)
// Target:  data-building-id=\"' + buildingId + '\">+ Add Unit</button>
var idx2 = content.indexOf("'\"penUnitModal");
if (idx2 >= 0) {
  // Find what's between '\"penUnitModal and '>\"+ Add Unit</button>'
  var before2 = content.substring(0, idx2);
  var after2 = content.substring(idx2);
  // Replace from '\"penUnitModal' to the '>\"' before '+ Add Unit</button>'
  var addUnitEnd = after2.indexOf("'>+ Add Unit</button>");
  if (addUnitEnd >= 0) {
    after2 = '"' + after2.substring(addUnitEnd + 1);
    content = before2 + after2;
    count++;
    console.log('Fix 2 applied');
  }
} else {
  console.log('Fix 2 NOT found');
}

// Fix 3: unitFilter select (line 1549)
// Current: data-prop-id=\"' + propId + '\") + '\\\\',\\\\'' + propId + '\\\\')\">
// Target:  data-prop-id=\"' + propId + '\">
var idx3 = content.indexOf(" + propId + '\\') + '\\\\',\\\\'");
if (idx3 >= 0) {
  var before3 = content.substring(0, idx3);
  var after3 = content.substring(idx3);
  // Find the '>\"' after the leftover that starts with ' + propId'
  // After the " + propId + \" fragment, find '>\"<option'
  var optStart = after3.indexOf("><option");
  if (optStart >= 0) {
    after3 = after3.substring(optStart);
    content = before3 + after3;
    count++;
    console.log('Fix 3 applied');
  }
} else {
  console.log('Fix 3 NOT found');
}

// Fix 4: edit-unit button (line 1566)
// The line has data-desc=\"' + h(u.description||'') + '\") followed by leftover args
// Target: just '">Edit</button>
var idx4 = content.indexOf("h(u.description||'') + '\\') + '\\\\',\\\\'");
if (idx4 >= 0) {
  var before4 = content.substring(0, idx4);
  var after4 = content.substring(idx4);
  // Find where the leftover ends - look for '>\"Edit</button>'
  var editEnd = after4.indexOf("'>Edit</button>");
  if (editEnd >= 0) {
    after4 = '"' + after4.substring(editEnd + 1);
    content = before4 + after4;
    count++;
    console.log('Fix 4 applied');
  }
} else {
  console.log('Fix 4 NOT found - trying alternative pattern');
  // Try without one level of escaping
  var idx4b = content.indexOf("h(u.description||'') + '\\') + '\\\\',");
  if (idx4b >= 0) {
    var before4b = content.substring(0, idx4b);
    var after4b = content.substring(idx4b);
    var editEnd2 = after4b.indexOf("'>Edit</button>");
    if (editEnd2 >= 0) {
      after4b = '"' + after4b.substring(editEnd2 + 1);
      content = before4b + after4b;
      count++;
      console.log('Fix 4 applied (alt)');
    }
  }
}

console.log('Total fixes applied: ' + count);
fs.writeFileSync(path, content, 'utf8');
console.log('File written');
