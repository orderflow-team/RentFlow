var fs = require('fs');
var path = 'src/app.service.ts';
var content = fs.readFileSync(path, 'utf8');
var changes = 0;

// Fix 1: Back-link at position ~95805
// Replace: h(buildingName) + '") + '\\')">  with  h(buildingName) + '">
// The exact search string has specific character codes:
// h(buildingName) + '") - the quote after + is a double-quote that closes data-name
// Then space + + + space + ' + backslash + backslash + ' + ) + " + >
// Actually let me just find the unique context and do a string replace

// The exact substring to find: '") + '\\')">← Back to buildings
// In raw file: ' (39) " (34) ) (41) space (32) + (43) space (32) ' (39) \ (92) \ (92) ' (39) ) (41) " (34) > (62)
var str1 = '\") + \'\\\')\">←';
var str2 = '\">←';

var idx1 = content.indexOf(str1);
if (idx1 >= 0) {
  console.log('Fix 1 found at position ' + idx1);
  content = content.split(str1).join(str2);
  changes++;
  console.log('Fix 1 applied');
} else {
  console.log('Fix 1 NOT found with pattern 1');
  // Try with double backslashes  
  var str1b = '\") + \'\\\\\')\">←';
  var str2b = '\">←';
  var idx1b = content.indexOf(str1b);
  if (idx1b >= 0) {
    content = content.split(str1b).join(str2b);
    changes++;
    console.log('Fix 1 applied (pattern b)');
  } else {
    console.log('Fix 1 NOT found with pattern b either');
    // Show what's at position 95805
    console.log('  Content at 95805:', JSON.stringify(content.substring(95800, 95950)));
  }
}

// Fix 2: Add-unit button at position ~96099  
// Replace: <data-action="add-unit" ... "penUnitModal(...)">  with  <button class="btn btn-primary btn-sm" data-action="add-unit" ... ">
var str3 = '<data-action=\"add-unit\" data-building-id=\"';
var str4 = '<button class=\"btn btn-primary btn-sm\" data-action=\"add-unit\" data-building-id=\"';

var idx2 = content.indexOf(str3);
if (idx2 >= 0) {
  console.log('Fix 2 found at position ' + idx2);
  content = content.split(str3).join(str4);
  // Now fix the leftover penUnitModal(...)> after the buildingId
  // The current text after data-building-id="' + buildingId + '" is: penUnitModal(...)>
  // We need to find the )"> and replace with ">
  var str5 = '\"penUnitModal(';
  var idx3 = content.indexOf(str5);
  if (idx3 >= 0) {
    // Find the '>\"' that closes this button
    var btnEnd = content.indexOf('\">+ Add Unit</button>', idx3);
    if (btnEnd >= 0) {
      // Replace everything from "penUnitModal( to '">' with just '">'
      // Find the )"> that ends the penUnitModal call
      var parenEnd = content.indexOf(')\">', idx3);
      if (parenEnd >= 0) {
        content = content.substring(0, idx3) + '\">' + content.substring(parenEnd + 3);
        changes++;
        console.log('Fix 2b applied (removed penUnitModal leftover)');
      }
    }
  }
} else {
  console.log('Fix 2 NOT found');
}

// Fix 3: unitFilter - remove leftover ) + '\\',\\' + propId + '\\') 
var str6 = '\\') + \'\\\\\',\\\\\'\' + propId + \'\\\\\')\"';
var str7 = '\\">';

var idx4 = content.indexOf(str6);
if (idx4 >= 0) {
  console.log('Fix 3 found at position ' + idx4);
  content = content.split(str6).join(str7);
  changes++;
} else {
  console.log('Fix 3 NOT found');
}

// Fix 4: edit-unit - remove leftover args after data-desc
var str8 = '\\') + \'\\\\\',\\\\\'\' + (u.bedrooms||0)';
if (content.indexOf(str8) >= 0) {
  console.log('Fix 4 found');
  // Find the full edit-unit data-desc line
  var editDescIdx = content.indexOf('data-desc=\"' + "' + h(u.description||'') + '");
  if (editDescIdx >= 0) {
    var afterDesc = editDescIdx + ('data-desc=\"' + "' + h(u.description||'') + '").length;
    // After this comes the leftover args. Find '">Edit</button>' 
    var editBtnEnd = content.indexOf('\">Edit</button>', afterDesc);
    if (editBtnEnd >= 0) {
      // Remove from afterDesc to editBtnEnd (the leftover args)
      content = content.substring(0, afterDesc) + '\">Edit</button>' + content.substring(editBtnEnd + '\">Edit</button>'.length);
      changes++;
      console.log('Fix 4 applied');
    }
  }
} else {
  console.log('Fix 4 NOT found');
  // Try with fewer backslashes
  var str8b = '\\') + \'\\\\','';  
  var idx5 = content.indexOf(str8b);
  if (idx5 >= 0) {
    console.log('Fix 4 alt found at ' + idx5);
    var editBtnEnd2 = content.indexOf('Edit</button>', idx5);
    if (editBtnEnd2 >= 0) {
      var gtBtn = content.lastIndexOf('\"', idx5); // find the opening " of the Edit button
      if (gtBtn >= 0) {
        content = content.substring(0, gtBtn) + '\">Edit</button>' + content.substring(editBtnEnd2 + 'Edit</button>'.length);
        changes++;
      }
    }
  }
}

console.log('Total changes: ' + changes);
if (changes > 0) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('File saved');
}
