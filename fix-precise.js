var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var fixed = false;

// Fix 1: Back-link line 1545
// Find the exact pattern and fix it
// Target: h(buildingName) + '\") + '\\')\">
// The issue: leftover onclick args
var search = "h(buildingName) + '\\') + '\\\\')\">←";
if (content.indexOf(search) >= 0) {
  content = content.split(search).join("h(buildingName) + '\\\">←");
  console.log('Fix 1 (a) applied');
  fixed = true;
} else {
  // Try alt pattern  
  search = "h(buildingName) + '\") + '\\\\')\">";
  if (content.indexOf(search) >= 0) {
    content = content.split(search).join("h(buildingName) + '\">");
    console.log('Fix 1 (b) applied - backslash escaped q');
    fixed = true;
  }
}

// Fix 2: Add-unit button - line 1547
// <data-action="add-unit" data-building-id="' + buildingId + '"penUnitModal(\\' + buildingId + '\\')">
// Should be: <button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="' + buildingId + '">
var brokenBtn = '<data-action="add-unit" data-building-id="' + buildingId + '\\"penUnitModal(\\\\' + buildingId + '\\\\')\\\">';
var goodBtn   = '<button class=\\"btn btn-primary btn-sm\\" data-action=\\"add-unit\\" data-building-id=\\"' + buildingId + '\\\">';
if (content.indexOf(brokenBtn) >= 0) {
  content = content.split(brokenBtn).join(goodBtn);
  console.log('Fix 2 applied');
  fixed = true;
} else {
  // Try without the escaped backslashes
  var brokenBtn2 = '<data-action=\\"add-unit\\" data-building-id=\\"' + buildingId + '\\"penUnitModal(\\\\' + buildingId + '\\\\')\\\">';
  var goodBtn2 = '<button class=\\"btn btn-primary btn-sm\\" data-action=\\"add-unit\\" data-building-id=\\"' + buildingId + '\\\">';
  if (content.indexOf(brokenBtn2) >= 0) {
    content = content.split(brokenBtn2).join(goodBtn2);
    console.log('Fix 2 (escaped) applied');
    fixed = true;
  }
}

// Fix 3: unitFilter - line 1549
// ...data-prop-id="' + propId + '") + '\\',\\' + propId + '\\')"><option...  
// Should be: ...data-prop-id="' + propId + '"><option...
var filterBroken = " + propId + '\\') + '\\\\',\\\\'' + propId + '\\\\')\"><option";
var filterGood   = " + propId + '\\\"><option";
if (content.indexOf(filterBroken) >= 0) {
  content = content.split(filterBroken).join(filterGood);
  console.log('Fix 3 applied');
  fixed = true;
}

// Fix 4: edit-unit line 1566
// After data-desc="' + h(u.description||'') + '") there are leftover args
var editSearch = "h(u.description||'') + '\\') + '\\\\',\\\\''";
if (content.indexOf(editSearch) >= 0) {
  var idx = content.indexOf(editSearch);
  // Find the '">Edit</button>' after the leftover
  var editTag = content.indexOf("'>Edit</button>", idx);
  if (editTag >= 0) {
    // Remove from idx to editTag (everything between data-desc close and Edit)
    // We need to keep the closing "> that was consumed
    // After data-desc="' + h(u.description||'') + '" we want just '">
    // So find what comes before: h(u.description||'') + '
    var beforeDesc = content.lastIndexOf("h(u.description||'') + '", idx);
    if (beforeDesc >= 0) {
      // Replace from after '" (after h(u.description||'') + ') to '">Edit</button>'
      var closeQuote = beforeDesc + "h(u.description||'') + '".length;
      // The content right after this should be: '") or '")
      content = content.substring(0, closeQuote) + '\\">Edit</button>' + content.substring(editTag + "'>Edit</button>".length);
      console.log('Fix 4 applied');
      fixed = true;
    }
  }
}

if (fixed) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('File written with fixes');
} else {
  console.log('No fixes applied');
}
