var fs = require('fs');
var content = fs.readFileSync('src/app.service.ts', 'utf8');
var lines = content.split('\n');

// Find lines with showPropertyDetail or showBuildingDetail that still have onclick=
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];
  if (!line.includes('onclick=') && !line.includes('onchange=')) continue;
  if (line.includes('addEventListener') || line.includes('getAttribute')) continue;
  
  // Check for showPropertyDetail + p.id
  if (line.includes('showPropertyDetail') && line.includes('p.id')) {
    console.log('LINE ' + (i+1) + ' showPropertyDetail + p.id FOUND');
    console.log('  has onclick=":', line.indexOf('onclick="'));
    console.log('  has lastIndexOf onclick before showPropertyDetail:', line.lastIndexOf('onclick="', line.indexOf('showPropertyDetail')));
    console.log('  has ") after showPropertyDetail:', line.indexOf('")', line.indexOf('showPropertyDetail')));
    
    var p1 = line.indexOf('showPropertyDetail');
    var os = line.lastIndexOf('onclick="', p1);
    var oe = line.indexOf('")', p1);
    console.log('  onclickStart:', os, 'onclickEnd:', oe);
    if (os >= 0 && oe >= 0) {
      console.log('  onclick text:', JSON.stringify(line.substring(os, oe + 2)));
    }
  }
  
  // Check for showBuildingDetail + b.id
  if (line.includes('showBuildingDetail') && line.includes('b.id')) {
    console.log('LINE ' + (i+1) + ' showBuildingDetail + b.id FOUND');
    var p1 = line.indexOf('showBuildingDetail');
    var os = line.lastIndexOf('onclick="', p1);
    var oe = line.indexOf('")', p1);
    console.log('  onclickStart:', os, 'onclickEnd:', oe);
    if (os >= 0 && oe >= 0) {
      console.log('  onclick text:', JSON.stringify(line.substring(os, oe + 2)));
    }
  }
  
  // Check for openBuildingModal + propId
  if (line.includes('openBuildingModal') && line.includes('propId')) {
    console.log('LINE ' + (i+1) + ' openBuildingModal + propId FOUND');
    var p1 = line.indexOf('openBuildingModal');
    var os = line.lastIndexOf('onclick="', p1);
    if (os < 0) { 
      os = line.lastIndexOf('onclick=\\"', p1); // With backslash before double-quote
    }
    var oe = line.indexOf('")', p1);
    console.log('  onclickStart:', os, 'onclickEnd:', oe);
    if (os >= 0 && oe >= 0) {
      console.log('  onclick text:', JSON.stringify(line.substring(os, oe + 2)));
    }
  }
  
  // Check for openUnitModal + buildingId
  if (line.includes('openUnitModal') && line.includes('buildingId')) {
    console.log('LINE ' + (i+1) + ' openUnitModal + buildingId FOUND');
  }
  
  // Check for showTenantDetail + t.id
  if (line.includes('showTenantDetail') && line.includes('t.id')) {
    console.log('LINE ' + (i+1) + ' showTenantDetail + t.id FOUND');
    var p1 = line.indexOf('showTenantDetail');
    var os = line.lastIndexOf('onclick="', p1);
    var oe = line.indexOf('")', p1);
    console.log('  onclickStart:', os, 'onclickEnd:', oe);
    if (os >= 0 && oe >= 0) {
      console.log('  onclick text:', JSON.stringify(line.substring(os, oe + 2)));
    } else {
      console.log('  onclick not found with lastIndexOf, trying direct...');
      console.log('  line before showTenantDetail:', JSON.stringify(line.substring(0, p1)));
    }
  }
}
