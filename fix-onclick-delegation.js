var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');
var lines = content.split('\n');
var modified = false;

for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (!line.includes('onclick=') && !line.includes('onchange=')) continue;
  if (line.includes('addEventListener') || line.includes('getAttribute')) continue;
  var origLine = line;

  // In the TS template literal, onclick attributes use \" for double-quotes
  // So we search for onclick=\" and )\" as boundaries
  
  // Helper function to replace an onclick handler
  function replaceHandler(funcName, extraCheck, newAttr) {
    var idx = line.indexOf(funcName);
    if (idx < 0) return false;
    if (extraCheck && !line.includes(extraCheck)) return false;
    
    // Find start: onclick=\" ...
    var start = line.lastIndexOf('onclick=\\"', idx);
    if (start < 0) start = line.lastIndexOf('onchange=\\"', idx);
    if (start < 0) return false;
    
    // Find end: )\" 
    // Search from the end of the function name for ) followed by \"
    var end = -1;
    var searchFrom = idx + funcName.length;
    while (true) {
      var parenPos = line.indexOf(')', searchFrom);
      if (parenPos < 0 || parenPos > searchFrom + 200) break;
      if (line.charAt(parenPos + 1) === '\\' && line.charAt(parenPos + 2) === '"') {
        end = parenPos + 2; // position of the closing "
        break;
      }
      searchFrom = parenPos + 1;
    }
    if (end < 0) return false;
    
    var before = line.substring(0, start);
    var after = line.substring(end + 1);
    line = before + newAttr + after;
    console.log('  Replaced ' + funcName + ' on line ' + (i+1));
    return true;
  }

  // P1: showPropertyDetail(p.id, h(p.name))
  replaceHandler('showPropertyDetail', 'p.id',
    'data-action="show-property" data-id="\' + p.id + \'" data-name="\' + h(p.name) + \'"');

  // P2: openBuildingModal(propId)
  replaceHandler('openBuildingModal', 'propId',
    'data-action="add-building" data-prop-id="\' + propId + \'"');

  // P3: showBuildingDetail(b.id, h(b.name), propId)
  replaceHandler('showBuildingDetail', 'b.id',
    'data-action="show-building" data-id="\' + b.id + \'" data-name="\' + h(b.name) + \'" data-prop-id="\' + propId + \'"');

  // P4: showPropertyDetail(propId, buildingName.replace...) - back link
  replaceHandler('showPropertyDetail', 'buildingName',
    'data-action="show-property" data-id="\' + propId + \'" data-name="\' + h(buildingName) + \'"');

  // P5: openUnitModal(buildingId)
  replaceHandler('openUnitModal', 'buildingId',
    'data-action="add-unit" data-building-id="\' + buildingId + \'"');

  // P6: showBuildingDetail(buildingId, buildingName.replace...) - unitFilter onchange
  // This uses onchange=\" instead of onclick=\"
  var idx = line.indexOf('showBuildingDetail');
  if (idx >= 0 && line.includes('buildingName.replace')) {
    var start = line.lastIndexOf('onchange=\\"', idx);
    if (start >= 0) {
      var end = -1;
      var searchFrom = idx + 'showBuildingDetail'.length;
      while (true) {
        var parenPos = line.indexOf(')', searchFrom);
        if (parenPos < 0 || parenPos > searchFrom + 200) break;
        if (line.charAt(parenPos + 1) === '\\' && line.charAt(parenPos + 2) === '"') {
          end = parenPos + 2;
          break;
        }
        searchFrom = parenPos + 1;
      }
      if (end >= 0) {
        var before = line.substring(0, start);
        var after = line.substring(end + 1);
        line = before + 'data-action="show-building" data-id="\' + buildingId + \'" data-name="\' + h(buildingName) + \'" data-prop-id="\' + propId + \'"' + after;
        console.log('  Replaced showBuildingDetail (unitFilter) on line ' + (i+1));
      }
    }
  }

  // P7: editUnit(u.id, ...)
  replaceHandler('editUnit', 'u.id',
    'data-action="edit-unit" data-id="\' + u.id + \'" data-name="\' + h(u.name) + \'" data-bedrooms="\' + (u.bedrooms||0) + \'" data-bathrooms="\' + (u.bathrooms||0) + \'" data-sqft="\' + (u.squareFootage||\'\') + \'" data-rent="\' + (u.rentAmount||0) + \'" data-status="\' + (u.status||\'VACANT\') + \'" data-floor="\' + (u.floorNumber||\'\') + \'" data-deposit="\' + (u.depositAmount||0) + \'" data-desc="\' + h(u.description||\'\') + \'"');

  // P8: showTenantDetail(t.id)
  replaceHandler('showTenantDetail', 't.id',
    'data-action="show-tenant" data-id="\' + t.id + \'"');

  // Simple onchange handlers (remove them)
  line = line.replace(' onchange="renderProperties()"', '');
  line = line.replace(' onchange="renderLeases()"', '');
  line = line.replace(' onchange="renderMaintenance()"', '');

  if (line !== origLine) {
    lines[i] = line;
    modified = true;
  }
}

content = lines.join('\n');
if (!modified) {
  console.log('WARNING: No replacements made!');
}

// Add event delegation code after closeModal function
var closeModalFn = `  function closeModal() {
    var el = document.querySelector('.modal-overlay.open');
    if (el) el.remove();
  }`;

var delegationCode = `  function closeModal() {
    var el = document.querySelector('.modal-overlay.open');
    if (el) el.remove();
  }

  // Event delegation for data-action elements
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    switch(action) {
      case 'show-property':
        showPropertyDetail(el.getAttribute('data-id'), el.getAttribute('data-name'));
        break;
      case 'show-building':
        showBuildingDetail(el.getAttribute('data-id'), el.getAttribute('data-name'), el.getAttribute('data-prop-id'));
        break;
      case 'show-tenant':
        showTenantDetail(el.getAttribute('data-id'));
        break;
      case 'add-building':
        openBuildingModal(el.getAttribute('data-prop-id'));
        break;
      case 'add-unit':
        openUnitModal(el.getAttribute('data-building-id'));
        break;
      case 'edit-unit':
        editUnit(el.getAttribute('data-id'), el.getAttribute('data-name'),
          el.getAttribute('data-bedrooms'), el.getAttribute('data-bathrooms'),
          el.getAttribute('data-sqft'), el.getAttribute('data-rent'),
          el.getAttribute('data-status'), el.getAttribute('data-floor'),
          el.getAttribute('data-deposit'), el.getAttribute('data-desc'));
        break;
    }
  });

  // Event delegation for change events (select filters)
  document.addEventListener('change', function(e) {
    var el = e.target;
    if (el.id === 'propFilter') renderProperties();
    if (el.id === 'leaseFilter') renderLeases();
    if (el.id === 'maintFilter' || el.id === 'maintPriorityFilter') renderMaintenance();
  });

  // Event delegation for keyup (Enter in search)
  document.addEventListener('keyup', function(e) {
    if (e.keyCode === 13 && e.target.id === 'propSearch') renderProperties();
  });`;

var closeIdx = content.indexOf(closeModalFn);
if (closeIdx >= 0) {
  content = content.substring(0, closeIdx) + delegationCode + content.substring(closeIdx + closeModalFn.length);
  console.log('Added event delegation code');
} else {
  console.log('ERROR: closeModal not found');
  process.exit(1);
}

fs.writeFileSync('src/app.service.ts', content, 'utf8');
console.log('File written');
