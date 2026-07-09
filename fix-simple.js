var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var changes = 0;

// Fix 1: Back-link - find "Back to buildings" with a show-property data-action
var anchor1 = 'data-action="show-property" data-id="\' + propId + \'" data-name="\' + h(buildingName) + \'';
var idx1 = content.indexOf(anchor1);
if (idx1 >= 0) {
  var afterAnchor = idx1 + anchor1.length;
  // Content after anchor is: '") + '\\')">← Back to buildings</a>'
  // Should be: '">← Back to buildings</a>'
  // Find '← Back to buildings' after the anchor
  var backLinkEnd = content.indexOf('← Back to buildings</a>\'', afterAnchor);
  if (backLinkEnd >= 0) {
    var beforeFix = content.substring(afterAnchor, backLinkEnd);
    console.log('Backlink leftover: ' + JSON.stringify(beforeFix.substring(0, 40)));
    // Replace from afterAnchor to backLinkEnd with just '">
    content = content.substring(0, afterAnchor) + '\">' + content.substring(backLinkEnd);
    changes++;
    console.log('Fix 1 applied');
  }
}

// Fix 2: Add-unit button - find the broken <data-action="add-unit"...>
var anchor2 = 'data-building-id="\' + buildingId + \'"penUnitModal(';
var idx2 = content.indexOf(anchor2);
if (idx2 >= 0) {
  var btnStart = content.lastIndexOf('<', idx2);
  // Find '> before + Add Unit</button>'
  var addUnitEnd = content.indexOf('\">+ Add Unit</button>', idx2);
  if (addUnitEnd >= 0 && btnStart >= 0) {
    var brokenBtn = content.substring(btnStart, addUnitEnd + 1);
    console.log('Broken add-unit: ' + JSON.stringify(brokenBtn.substring(0, 100)));
    // Replace with properly formed button
    var newBtn = '<button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="';
    // Find the closing '> that's right before + Add Unit
    var gtIdx = brokenBtn.lastIndexOf('\\">');
    if (gtIdx >= 0) {
      newBtn = '<button class="btn btn-primary btn-sm" data-action="add-unit" data-building-id="\' + buildingId + \'">';
      content = content.substring(0, btnStart) + newBtn + content.substring(addUnitEnd + 1);
      changes++;
      console.log('Fix 2 applied');
    }
  }
}

// Fix 3: unitFilter - find data-prop-id with leftover args
var anchor3 = 'data-prop-id="\' + propId + \'\\") + \'\\\\\',\\\\\'\'';
var idx3 = content.indexOf(anchor3);
if (idx3 >= 0) {
  // Find what comes after this leftover - should be '><option'
  var optionStart = content.indexOf('><option', idx3);
  if (optionStart >= 0) {
    // Replace from the closing of data-prop-id to ><option with just '><option
    var beforePropId = idx3 + 'data-prop-id="'.length;
    content = content.substring(0, beforePropId) + '\' + propId + \'"><option' + content.substring(optionStart + 8);
    changes++;
    console.log('Fix 3 applied');
  }
}

// Fix 4: edit-unit - find leftover args after data-desc
var anchor4 = 'data-desc="\' + h(u.description||\'\') + \'\\") + \'\\\\\',\\\\\'\'';
var idx4 = content.indexOf(anchor4);
if (idx4 >= 0) {
  var afterDesc = idx4 + 'data-desc="'.length;
  // Find '">Edit</button>' or similar
  var editEnd = content.indexOf('\">Edit</button>', idx4);
  if (editEnd >= 0) {
    // Replace everything from the start of data-desc value to '">Edit' with proper closing
    content = content.substring(0, afterDesc) + '\' + h(u.description||\'\') + \'">Edit</button>' + content.substring(editEnd + '\">Edit</button>'.length);
    changes++;
    console.log('Fix 4 applied');
  }
}

console.log('Total changes: ' + changes);
if (changes > 0) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('File saved');
}
