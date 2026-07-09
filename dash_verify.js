
(function() {
  var token = localStorage.getItem('accessToken');
  if (!token) { window.location.href = '/login'; return; }

  var currentView = 'dashboard';
  var userData = null;
  var roleTypes = [];

  function h(s) { return String(s).replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  function closeModal() {
    var el = document.querySelector('.modal-overlay.open');
    if (el) el.remove();
  }

  function api(path, opts) {
    opts = opts || {};
    opts.headers = opts.headers || {};
    opts.headers['Authorization'] = 'Bearer ' + token;
    if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    return fetch('/api/v1' + path, opts).then(function(r) {
      if (r.status === 401) { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); window.location.href = '/login'; }
      return r.json().then(function(d) { return { ok: r.ok, status: r.status, data: d }; });
    });
  }

  function toast(msg, type) {
    var tc = document.getElementById('toastContainer');
    if (!tc) { tc = document.createElement('div'); tc.id = 'toastContainer'; tc.className = 'toast'; document.body.appendChild(tc); }
    var el = document.createElement('div'); el.className = 'toast-item ' + (type || '');
    el.textContent = msg; tc.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function() { el.remove(); }, 300); }, 3000);
  }

  function confirmAction(msg, cb) {
    var html = '<div class=\"confirm-overlay open\" id=\"confirmDlg\"><div class=\"confirm-box\"><h3>Confirm</h3><p>' + h(msg) + '</p><div class=\"btn-row\"><button class=\"btn btn-danger btn-sm\" id=\"confirmYes\">Yes, proceed</button><button class=\"btn btn-secondary btn-sm\" id=\"confirmNo\">Cancel</button></div></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('confirmYes').onclick = function() { div.remove(); cb(); };
    document.getElementById('confirmNo').onclick = function() { div.remove(); };
  }

  window.showView = function(view) {
    currentView = view;
    document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
    var navEl = document.querySelector('.nav-item[data-view="' + view + '"]');
    if (navEl) navEl.classList.add('active');
    renderView(view);
  }

  function renderView(view) {
    switch(view) {
      case 'dashboard': renderDashboard(); break;
      case 'properties': renderProperties(); break;
      case 'tenants': renderTenants(); break;
      case 'leases': renderLeases(); break;
      case 'finance': renderFinance(); break;
      case 'maintenance': renderMaintenance(); break;
      case 'vendors': renderVendors(); break;
      default: renderDashboard();
    }
  }

  function setContent(html) {
    document.getElementById('mainContent').innerHTML = html;
  }

  /* ── Init ─────────────────────────────────────────────── */
  async function init() {
    try {
      var res = await api('/auth/profile');
      if (!res.ok) throw new Error('Unauthorized');
      userData = res.data;
      document.getElementById('sidebarEmail').textContent = userData.email;
      roleTypes = (userData.roles || []).map(function(r) { return typeof r === 'string' ? r : (r.type || r.name); });
      var displayRole = roleTypes.includes('ADMIN') ? 'Admin' : roleTypes.includes('MANAGER') ? 'Manager' : roleTypes.includes('ACCOUNTANT') ? 'Accountant' : roleTypes.includes('OWNER') ? 'Owner' : roleTypes.includes('TENANT') ? 'Tenant' : roleTypes[0] || 'User';
      document.getElementById('sidebarRole').textContent = displayRole;

      var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER' || r === 'ACCOUNTANT'; });
      var isTenant = roleTypes.includes('TENANT');
      var isOwner = roleTypes.includes('OWNER');

      // Show/hide nav items based on role
      document.getElementById('navMaintenance').style.display = isStaff ? '' : 'none';
      document.getElementById('navVendors').style.display = (isStaff && (roleTypes.includes('ADMIN') || roleTypes.includes('MANAGER'))) ? '' : 'none';

      // For non-staff users, hide irrelevant nav items
      if (!isStaff) {
        document.querySelectorAll('.nav-item[data-view="properties"]').forEach(function(el) { el.style.display = isOwner ? '' : 'none'; });
        document.querySelectorAll('.nav-item[data-view="tenants"]').forEach(function(el) { el.style.display = 'none'; });
        document.querySelectorAll('.nav-item[data-view="leases"]').forEach(function(el) { el.style.display = 'none'; });
        document.querySelectorAll('.nav-item[data-view="finance"]').forEach(function(el) { el.style.display = isOwner ? '' : 'none'; });
      }

      renderDashboard();
    } catch(e) {
      setContent('<div class="loading"><p style="font-size:.85rem;color:#71717a">Could not load dashboard. <a href="/login" style="color:#18181b;font-weight:500">Sign in again.</a></p></div>');
    }
  }

  /* ── Logout ───────────────────────────────────────────── */
  document.getElementById('logoutBtn').addEventListener('click', function() {
    var t = localStorage.getItem('accessToken');
    if (t) { fetch('/api/v1/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t } }).catch(function() {}); }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  });

  /* ═══════════════════════════════════════════════════════════
     DASHBOARD VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderDashboard() {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER' || r === 'ACCOUNTANT'; });
    var isTenant = roleTypes.includes('TENANT');
    var isOwner = roleTypes.includes('OWNER');

    if (isStaff) { renderStaffDashboard(); }
    else if (isTenant) { renderTenantPortal(); }
    else if (isOwner) { renderOwnerPortal(); }
    else { renderStaffDashboard(); }
  }

  async function renderStaffDashboard() {
    var name = (userData.firstName || '').split(' ')[0];
    var cn = (userData.company && userData.company.name) || 'your company';
    setContent(
      '<div class="page-header"><h2>Hello, ' + h(name) + '.</h2><p>Portfolio overview for <strong>' + h(cn) + '</strong></p></div>' +
      '<div class="stats-grid" id="dashStats">' +
        ['<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Total Units</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Occupied</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Vacant</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Maintenance</div></div>',
         '<div class="stat-card"><div class="stat-num">—</div><div class="stat-lbl">Collected</div></div>',
         '<div class="stat-card"><div class="stat-num">—%</div><div class="stat-lbl">Rate</div></div>'].join('') +
      '</div>' +
      '<div class="section-h">Recent activity</div>' +
      '<div class="table-wrap" id="dashActivity"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var statsRes = await api('/reports/dashboard');
      if (statsRes.ok) {
        var s = statsRes.data;
        var grid = document.getElementById('dashStats');
        if (grid) {
          var cards = grid.querySelectorAll('.stat-card');
          var occ = s.occupancy || {};
          var fin = s.financial || {};
          if (cards.length >= 6) {
            cards[0].innerHTML = '<div class="stat-num">' + (occ.totalUnits || 0) + '</div><div class="stat-lbl">Total Units</div><div class="stat-sub">Across portfolio</div>';
            cards[1].innerHTML = '<div class="stat-num">' + (occ.occupiedUnits || 0) + '</div><div class="stat-lbl">Occupied</div><div class="stat-sub"><span class="good">' + ((occ.occupancyRate || 0)).toFixed(1) + '%</span> rate</div>';
            cards[2].innerHTML = '<div class="stat-num">' + (occ.vacantUnits || 0) + '</div><div class="stat-lbl">Vacant</div><div class="stat-sub">Available</div>';
            cards[3].innerHTML = '<div class="stat-num">' + (occ.maintenanceUnits || 0) + '</div><div class="stat-lbl">Maintenance</div><div class="stat-sub">Under repair</div>';
            cards[4].innerHTML = '<div class="stat-num">$' + ((fin.totalCollected || 0)).toLocaleString() + '</div><div class="stat-lbl">Collected</div><div class="stat-sub">Revenue</div>';
            cards[5].innerHTML = '<div class="stat-num">' + ((occ.occupancyRate || 0)) + '%</div><div class="stat-lbl">Occupancy Rate</div><div class="stat-sub">' + (occ.occupiedUnits || 0) + ' of ' + (occ.totalUnits || 0) + ' rented</div>';
          }
        }
      }
    } catch(e) {}

    // Load recent activity (invoices and maintenance)
    var activityHtml = '';
    try {
      var invRes = await api('/invoices?limit=5');
      if (invRes.ok && invRes.data.data && invRes.data.data.length) {
        var rows = invRes.data.data.map(function(i) {
          var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : 'tag-yellow';
          return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="val">$' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + h(i.unit || '—') + '</td><td>' + h(i.tenant || '—') + '</td></tr>';
        }).join('');
        activityHtml = '<table><thead><tr><th>Invoice</th><th>Amount</th><th>Status</th><th>Unit</th><th>Tenant</th></tr></thead><tbody>' + rows + '</tbody></table>';
      } else {
        activityHtml = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No recent activity.</div>';
      }
    } catch(e) { activityHtml = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load activity.</div>'; }
    var el = document.getElementById('dashActivity');
    if (el) el.innerHTML = activityHtml;
  }

  /* ── Tenant Portal ─────────────────────────────────────── */
  async function renderTenantPortal() {
    var name = (userData.firstName || '').split(' ')[0];
    setContent(
      '<div class="page-header"><h2>Welcome, ' + h(name) + '.</h2><p>Your rental portal</p></div>' +
      '<div class="section-h">Your lease</div><div class="card-grid" id="tpLease"><div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Invoices</div><div class="table-wrap" id="tpInvoices"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Maintenance requests</div>' +
      '<div class="table-wrap" id="tpMaintenance"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<button class="btn btn-primary btn-sm" onclick="openMaintModal()">+ Submit request</button>');

    try {
      var leaseRes = await api('/tenants/me/lease');
      if (leaseRes.ok) {
        var l = leaseRes.data;
        var un = l.unit ? (l.unit.name || '—') : '—';
        var bn = l.unit && l.unit.building ? l.unit.building.name : '';
        var pn = l.unit && l.unit.building && l.unit.building.property ? l.unit.building.property.name : '';
        document.getElementById('tpLease').innerHTML = '<div class="card"><h4>Unit ' + h(un) + '</h4><p>' + h(bn) + (bn && pn ? ' · ' : '') + h(pn) + '</p><div class="meta">Rent: <strong>$' + (l.rentAmount || 0).toLocaleString() + '</strong> · ' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</div></div>';
      }
    } catch(e) { document.getElementById('tpLease').innerHTML = '<div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">No active lease.</div>'; }

    try {
      var invRes = await api('/tenants/me/invoices');
      if (invRes.ok && invRes.data && invRes.data.length) {
        var rows = invRes.data.map(function(i) {
          var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : 'tag-yellow';
          return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="val">$' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class="val">$' + (i.paidAmount || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td></tr>';
        }).join('');
        document.getElementById('tpInvoices').innerHTML = '<table><thead><tr><th>Invoice</th><th>Total</th><th>Paid</th><th>Status</th><th>Due</th></tr></thead><tbody>' + rows + '</tbody></table>';
      }
    } catch(e) { document.getElementById('tpInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No invoices.</div>'; }

    try {
      var maintRes = await api('/tenants/me/maintenance');
      if (maintRes.ok && maintRes.data && maintRes.data.length) {
        var rows = maintRes.data.map(function(r) {
          var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
          var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED' ? 'tag-blue' : 'tag-yellow';
          return '<tr><td>' + h(r.title) + '</td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td></tr>';
        }).join('');
        document.getElementById('tpMaintenance').innerHTML = '<table><thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead><tbody>' + rows + '</tbody></table>';
      }
    } catch(e) { document.getElementById('tpMaintenance').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No requests.</div>'; }
  }

  function openMaintModal() {
    var html =
      '<div class="modal-overlay open" id="maintModal">' +
      '<div class="modal">' +
      '<h2>Submit maintenance request</h2>' +
      '<form id="maintForm">' +
      '<div class="field"><label>Title *</label><input type="text" id="maintTitle" placeholder="e.g. Leaking faucet" required></div>' +
      '<div class="field"><label>Description</label><textarea id="maintDesc" placeholder="Describe the issue..."></textarea></div>' +
      '<div class="field"><label>Priority</label><select id="maintPriority"><option value="LOW">Low</option><option value="MEDIUM" selected>Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Submit</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('maintForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var title = document.getElementById('maintTitle').value.trim();
      var desc = document.getElementById('maintDesc').value.trim();
      var priority = document.getElementById('maintPriority').value;
      if (!title) return;
      try {
        var res = await api('/tenants/me/maintenance', { method: 'POST', body: { title: title, description: desc, priority: priority } });
        if (res.ok) { document.getElementById('maintModal').remove(); renderTenantPortal(); }
        else { toast(res.data.message || 'Failed'); }
      } catch(e) { toast('Failed to submit request'); }
    });
  }

  /* ── Owner Portal ──────────────────────────────────────── */
  async function renderOwnerPortal() {
    var name = (userData.firstName || '').split(' ')[0];
    setContent(
      '<div class="page-header"><h2>Welcome, ' + h(name) + '.</h2><p>Your properties and financial overview</p></div>' +
      '<div class="section-h">Financial summary</div>' +
      '<div class="stats-grid" id="ownFin"><div class="stat-card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Your properties</div>' +
      '<div class="card-grid" id="ownProps"><div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Maintenance requests <span style="font-size:.72rem;font-weight:400;color:#a1a1aa">(on your properties)</span></div>' +
      '<div class="table-wrap" id="ownMaint"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var finRes = await api('/owners/me/financials');
      if (finRes.ok) {
        var f = finRes.data;
        document.getElementById('ownFin').innerHTML =
          '<div class="stat-card"><div class="stat-num">' + (f.units ? f.units.total : 0) + '</div><div class="stat-lbl">Total Units</div><div class="stat-sub"><span class="good">' + (f.units ? f.units.occupied : 0) + ' occupied</span> · <span class="warn">' + (f.units ? f.units.vacant : 0) + ' vacant</span></div></div>' +
          '<div class="stat-card"><div class="stat-num">$' + ((f.finances ? f.finances.totalRent : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Total Rent</div></div>' +
          '<div class="stat-card"><div class="stat-num">$' + ((f.finances ? f.finances.totalCollected : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Collected</div><div class="stat-sub">Net: <strong>$' + ((f.finances ? f.finances.netIncome : 0) || 0).toLocaleString() + '</strong></div></div>' +
          '<div class="stat-card"><div class="stat-num">$' + ((f.finances ? f.finances.totalExpenses : 0) || 0).toLocaleString() + '</div><div class="stat-lbl">Expenses</div></div>';
      }
    } catch(e) { document.getElementById('ownFin').innerHTML = '<div class="stat-card" style="text-align:center;color:#a1a1aa;font-size:.82rem">Could not load financials.</div>'; }

    try {
      var propRes = await api('/owners/me/properties');
      if (propRes.ok && propRes.data && propRes.data.length) {
        var cards = propRes.data.map(function(p) {
          var units = 0, occupied = 0;
          if (p.buildings) { p.buildings.forEach(function(b) { if (b.units) { b.units.forEach(function(u) { units++; if (u.status === 'OCCUPIED') occupied++; }); } }); }
          return '<div class="card"><h4>' + h(p.name) + '</h4><p>' + h(p.address || '') + '</p><div class="meta">' + units + ' units · <span class="tag tag-green">' + occupied + ' occ.</span> <span class="tag tag-yellow">' + (units - occupied) + ' vac.</span></div></div>';
        }).join('');
        document.getElementById('ownProps').innerHTML = cards;
      }
    } catch(e) { document.getElementById('ownProps').innerHTML = '<div class="card" style="text-align:center;color:#a1a1aa;font-size:.82rem">No properties found.</div>'; }

    // Owner maintenance: fetch all maintenance, filter by their units
    try {
      var maintRes = await api('/maintenance?limit=100');
      if (maintRes.ok) {
        var allMaint = maintRes.data.data || [];
        // Try to get owner's unit IDs from their properties
        var propRes2 = await api('/owners/me/properties');
        var ownerUnitIds = [];
        if (propRes2.ok && propRes2.data) {
          propRes2.data.forEach(function(p) {
            if (p.buildings) p.buildings.forEach(function(b) {
              if (b.units) b.units.forEach(function(u) { ownerUnitIds.push(u.id); });
            });
          });
        }
        var filtered = allMaint.filter(function(m) { return ownerUnitIds.includes(m.unitId) || ownerUnitIds.length === 0; });
        if (filtered.length) {
          var rows = filtered.slice(0,10).map(function(r) {
            var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
            var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' ? 'tag-blue' : 'tag-yellow';
            return '<tr><td>' + h(r.title) + '</td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.unit ? h(r.unit.name) : '—') + '</td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td></tr>';
          }).join('');
          document.getElementById('ownMaint').innerHTML = '<table><thead><tr><th>Title</th><th>Priority</th><th>Status</th><th>Unit</th><th>Date</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('ownMaint').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No maintenance requests for your properties.</div>';
        }
      }
    } catch(e) { document.getElementById('ownMaint').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     PROPERTIES VIEW
     ═══════════════════════════════════════════════════════════ */
  window.renderProperties = async function() {
    var isOwner = roleTypes.includes('OWNER');
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });

    setContent(
      '<div class="page-header"><h2>Properties</h2><p>Manage your property portfolio</p></div>' +
      (isStaff ? '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openPropertyModal()">+ Add Property</button></div>' : '') +
      '<div class="filter-bar">' +
      '<select id="propFilter" onchange="renderProperties()"><option value="">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="UNDER_MAINTENANCE">Under Maintenance</option></select>' +
      '<input id="propSearch" placeholder="Search..." onkeyup="if(event.keyCode===13)renderProperties()">' +
      '</div>' +
      '<div class="card-grid" id="propList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var status = document.getElementById('propFilter').value;
      var search = document.getElementById('propSearch').value;
      var path = '/properties?limit=50';
      if (status) path += '&status=' + status;
      if (search) path += '&search=' + encodeURIComponent(search);

      var res = await api(path);
      if (res.ok) {
        var props = res.data.data || [];
        if (props.length) {
          var cards = props.map(function(p) {
            return '<div class="card" style="cursor:pointer" onclick="showPropertyDetail(\\'' + p.id + '\',\\'' + h(p.name) + '\')">' +
              '<h4>' + h(p.name) + '</h4>' +
              '<p>' + h(p.address || '') + ', ' + h(p.city || '') + '</p>' +
              '<div class="meta">' + (p.buildingCount || 0) + ' buildings · <span class="tag ' + (p.status === 'ACTIVE' ? 'tag-green' : p.status === 'UNDER_MAINTENANCE' ? 'tag-yellow' : 'tag-gray') + '">' + (p.status || '—') + '</span></div>' +
              '</div>';
          }).join('');
          document.getElementById('propList').innerHTML = cards;
        } else {
          document.getElementById('propList').innerHTML = '<div class="empty-state"><div class="icon">🏠</div><p>No properties found. ' + (isStaff ? 'Click "Add Property" to get started.' : '') + '</p></div>';
        }
      }
    } catch(e) { document.getElementById('propList').innerHTML = '<div class="empty-state"><p>Could not load properties.</p></div>'; }
  }

  /* ── Property Edit/Delete ─────────────────────────────── */
  window.editProperty = function(id, name, address, city, status) {
    var html =
      '<div class="modal-overlay open" id="editPropModal">' +
      '<div class="modal"><h2>Edit Property</h2>' +
      '<form id="editPropForm">' +
      '<div class="field"><label>Name</label><input type="text" id="epName" value="' + h(name) + '" required></div>' +
      '<div class="field"><label>Address</label><input type="text" id="epAddr" value="' + h(address) + '"></div>' +
      '<div class="field"><label>City</label><input type="text" id="epCity" value="' + h(city) + '"></div>' +
      '<div class="field"><label>Status</label><select id="epStatus"><option value="ACTIVE"' + (status==='ACTIVE'?' selected':'') + '>Active</option><option value="INACTIVE"' + (status==='INACTIVE'?' selected':'') + '>Inactive</option><option value="UNDER_MAINTENANCE"' + (status==='UNDER_MAINTENANCE'?' selected':'') + '>Under Maintenance</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Save</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('editPropForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      try {
        var res = await api('/properties/' + id, { method: 'PATCH', body: { name: document.getElementById('epName').value.trim(), address: document.getElementById('epAddr').value.trim(), city: document.getElementById('epCity').value.trim(), status: document.getElementById('epStatus').value } });
        if (res.ok) { document.getElementById('editPropModal').remove(); toast('Property updated', 'success'); renderProperties(); }
        else { toast(res.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to update', 'error'); }
    });
  }

  async function deleteProperty(id) {
    try {
      var res = await api('/properties/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Property deleted', 'success'); renderProperties(); }
      else { toast(res.data.message || 'Failed to delete', 'error'); }
    } catch(e) { toast('Failed to delete', 'error'); }
  }

  /* ── Property Detail ────────────────────────────────────── */
  window.showPropertyDetail = async function(propId, propName) {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });

    setContent(
      '<a class="back-link" onclick="showView(\'properties\')">← Back to properties</a>' +
      '<div class="page-header"><h2>' + h(propName) + '</h2><p>Buildings and units</p></div>' +
      (isStaff ? '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openBuildingModal(\\'' + propId + '\')">+ Add Building</button></div>' : '') +
      '<div id="propBuildings"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var res = await api('/properties/' + propId + '/buildings');
      if (res.ok) {
        var buildings = res.data || [];
        if (buildings.length) {
          var html = buildings.map(function(b) {
            return '<div class="card" style="cursor:pointer;margin-bottom:.75rem" onclick="showBuildingDetail(\\'' + b.id + '\',\\'' + h(b.name) + '\',\\'' + propId + '\')">' +
              '<h4>' + h(b.name) + (b.code ? ' <span style="color:#a1a1aa;font-weight:400">(' + h(b.code) + ')</span>' : '') + '</h4>' +
              '<p>' + (b.totalFloors || '—') + ' floors · ' + (b.totalUnits || 0) + ' units' + (b.yearBuilt ? ' · Built ' + b.yearBuilt : '') + '</p>' +
              '<div class="meta">' + (b.unitCount || 0) + ' units</div></div>';
          }).join('');
          document.getElementById('propBuildings').innerHTML = html;
        } else {
          document.getElementById('propBuildings').innerHTML = '<div class="empty-state"><p>No buildings yet.</p></div>';
        }
      }
    } catch(e) { document.getElementById('propBuildings').innerHTML = '<div class="empty-state"><p>Could not load buildings.</p></div>'; }
  }

  window.showBuildingDetail = async function(buildingId, buildingName, propId) {
    var isStaff = roleTypes.some(function(r) { return r === 'ADMIN' || r === 'MANAGER'; });

    setContent(
      '<a class="back-link" onclick="showPropertyDetail(\\'' + propId + '\',\\'' + h(buildingName.replace(/'/g,"\\'")) + '\')">← Back to buildings</a>' +
      '<div class="page-header"><h2>' + h(buildingName) + '</h2><p>Units in this building</p></div>' +
      (isStaff ? '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openUnitModal(\\'' + buildingId + '\')">+ Add Unit</button></div>' : '') +
      '<div class="filter-bar">' +
      '<select id="unitFilter" onchange="showBuildingDetail(\\'' + buildingId + '\',\\'' + h(buildingName.replace(/'/g,"\\'")) + '\',\\'' + propId + '\')"><option value="">All status</option><option value="VACANT">Vacant</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select>' +
      '</div>' +
      '<div id="buildingUnits"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var status = document.getElementById('unitFilter').value;
      var path = '/properties/buildings/' + buildingId + '/units';
      if (status) path += '?status=' + status;
      var res = await api(path);
      if (res.ok) {
        var units = res.data || [];
        if (units.length) {
          var html = units.map(function(u) {
            return '<div class="card" style="margin-bottom:.75rem">' +
              '<h4>' + h(u.name) + ' <span class="tag ' + (u.status === 'OCCUPIED' ? 'tag-green' : u.status === 'VACANT' ? 'tag-gray' : 'tag-yellow') + '" style="font-size:.65rem">' + (u.status || '—') + '</span></h4>' +
              '<p>' + (u.bedrooms || 0) + 'bd / ' + (u.bathrooms || 0) + 'ba · ' + (u.squareFootage || '—') + ' sqft' + (u.floorNumber ? ' · Floor ' + u.floorNumber : '') + '</p>' +
              '<div class="meta">Rent: <strong>$' + ((u.rentAmount || 0)).toLocaleString() + '</strong>' + (u.depositAmount ? ' · Deposit: $' + u.depositAmount.toLocaleString() : '') + '</div>' +
              (isStaff ? '<div style="margin-top:.5rem"><button class="btn btn-secondary btn-xs" onclick="editUnit(\\'' + u.id + '\',\\'' + h(u.name.replace(/'/g,"\\'")) + '\',\\'' + (u.bedrooms||0) + '\',\\'' + (u.bathrooms||0) + '\',\\'' + (u.squareFootage||'') + '\',\\'' + (u.rentAmount||0) + '\',\\'' + (u.status||'VACANT') + '\',\\'' + (u.floorNumber||'') + '\',\\'' + (u.depositAmount||0) + '\',\\'' + h((u.description||'').replace(/'/g,"\\'")) + '\')">Edit</button></div>' : '') +
              '</div>';
          }).join('');
          document.getElementById('buildingUnits').innerHTML = html;
        } else {
          document.getElementById('buildingUnits').innerHTML = '<div class="empty-state"><p>No units found.</p></div>';
        }
      }
    } catch(e) { document.getElementById('buildingUnits').innerHTML = '<div class="empty-state"><p>Could not load units.</p></div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     TENANTS VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderTenants() {
    setContent(
      '<div class="page-header"><h2>Tenants</h2><p>Manage your residents</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openTenantModal()">+ Add Tenant</button></div>' +
      '<div class="table-wrap" id="tenantTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var search = (document.getElementById('tenantSearch') || {}).value; var path = '/tenants?limit=50'; if (search) path += '&search=' + encodeURIComponent(search); var res = await api(path);
      if (res.ok) {
        var tenants = res.data.data || [];
        if (tenants.length) {
          var rows = tenants.map(function(t) {
            var st = t.status === 'ACTIVE' ? 'tag-green' : t.status === 'FORMER' ? 'tag-red' : 'tag-gray';
            return '<tr style="cursor:pointer" onclick="showTenantDetail(\\'' + t.id + '\')"><td><span class="val">' + h(t.firstName) + ' ' + h(t.lastName) + '</span></td><td>' + h(t.email) + '</td><td>' + (t.phone || '—') + '</td><td><span class="tag ' + st + '">' + (t.status || '—') + '</span></td><td>' + new Date(t.createdAt).toLocaleDateString() + '</td></tr>';
          }).join('');
          document.getElementById('tenantTable').innerHTML = '<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Added</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('tenantTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No tenants found.</div>';
        }
      }
    } catch(e) { document.getElementById('tenantTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     LEASES VIEW
     ═══════════════════════════════════════════════════════════ */
  window.renderLeases = async function() {
    setContent(
      '<div class="page-header"><h2>Leases</h2><p>Active and past rental contracts</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openLeaseModal()">+ Create Lease</button></div>' +
      '<div class="filter-bar">' +
      '<select id="leaseFilter" onchange="renderLeases()"><option value="">All status</option><option value="ACTIVE">Active</option><option value="EXPIRED">Expired</option><option value="TERMINATED">Terminated</option><option value="DRAFT">Draft</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="leaseTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var status = document.getElementById('leaseFilter').value;
      var path = '/leases?limit=50';
      if (status) path += '&status=' + status;
      var res = await api(path);
      if (res.ok) {
        var leases = res.data.data || [];
        if (leases.length) {
          var rows = leases.map(function(l) {
            var st = l.status === 'ACTIVE' ? 'tag-green' : l.status === 'EXPIRED' ? 'tag-yellow' : l.status === 'TERMINATED' ? 'tag-red' : 'tag-gray';
            return '<tr><td><span class="val">' + h(l.tenant ? (l.tenant.firstName + ' ' + l.tenant.lastName) : '—') + '</span></td><td>' + (l.unit ? h(l.unit.name) : '—') + (l.unit && l.unit.building ? ' · ' + h(l.unit.building.name) : '') + '</td><td><span class="val">$' + ((l.rentAmount || 0)).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (l.status || '—') + '</span></td><td>' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</td></tr>'
          }).join('');
          document.getElementById('leaseTable').innerHTML = '<table><thead><tr><th>Tenant</th><th>Unit</th><th>Rent</th><th>Status</th><th>Term</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('leaseTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No leases found.</div>';
        }
      }
    } catch(e) { document.getElementById('leaseTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     FINANCE VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderFinance() {
    setContent(
      '<div class="page-header"><h2>Finance</h2><p>Invoices, payments, and expenses</p></div>' +
      '<div class="btn-row">' +
      '<button class="btn btn-primary btn-sm" onclick="openInvoiceModal()">+ Create Invoice</button>' +
      '<button class="btn btn-secondary btn-sm" onclick="openExpenseModal()">+ Add Expense</button>' +
      '</div>' +
      '<div class="section-h">Invoices <span class="count" id="invCount"></span></div>' +
      '<div class="table-wrap" id="finInvoices"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>' +
      '<div class="section-h">Expenses</div>' +
      '<div class="table-wrap" id="finExpenses"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var invRes = await api('/invoices?limit=20');
      if (invRes.ok) {
        var invs = invRes.data.data || [];
        document.getElementById('invCount').textContent = invs.length;
        if (invs.length) {
          var rows = invs.map(function(i) {
            var st = i.status === 'PAID' ? 'tag-green' : i.status === 'OVERDUE' ? 'tag-red' : i.status === 'PENDING' ? 'tag-yellow' : 'tag-gray';
            return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class="val">$' + ((i.totalAmount || 0)).toLocaleString() + '</span></td><td><span class="val">$' + ((i.paidAmount || 0)).toLocaleString() + '</span></td><td><span class="val">$' + ((i.totalAmount - i.paidAmount) || 0).toLocaleString() + '</span></td><td><span class="tag ' + st + '">' + (i.status || '—') + '</span></td><td>' + (i.tenant ? h(i.tenant) : '—') + '</td><td>' + (i.unit ? h(i.unit) : '—') + '</td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td></tr>'
          }).join('');
          document.getElementById('finInvoices').innerHTML = '<table><thead><tr><th>Invoice</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Tenant</th><th>Unit</th><th>Due</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('finInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No invoices.</div>';
        }
      }
    } catch(e) { document.getElementById('finInvoices').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }

    try {
      var expRes = await api('/expenses?limit=20');
      if (expRes.ok) {
        var exps = expRes.data.data || [];
        if (exps.length) {
          var rows = exps.map(function(e) {
            return '<tr><td>' + new Date(e.expenseDate).toLocaleDateString() + '</td><td><span class="tag tag-gray">' + (e.category || '—') + '</span></td><td><span class="val">$' + ((e.amount || 0)).toLocaleString() + '</span></td><td>' + (e.description ? h(e.description) : '—') + '</td><td>' + (e.vendor ? h(e.vendor) : '—') + '</td></tr>'
          }).join('');
          document.getElementById('finExpenses').innerHTML = '<table><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th><th>Vendor</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('finExpenses').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No expenses.</div>';
        }
      }
    } catch(e) { document.getElementById('finExpenses').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     MAINTENANCE VIEW (Staff)
     ═══════════════════════════════════════════════════════════ */
  window.renderMaintenance = async function() {
    setContent(
      '<div class="page-header"><h2>Maintenance</h2><p>All maintenance requests across your portfolio</p></div>' +
      '<div class="filter-bar">' +
      '<select id="maintFilter" onchange="renderMaintenance()"><option value="">All status</option><option value="SUBMITTED">Submitted</option><option value="ACKNOWLEDGED">Acknowledged</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select>' +
      '<select id="maintPriorityFilter" onchange="renderMaintenance()"><option value="">All priority</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select>' +
      '</div>' +
      '<div class="table-wrap" id="maintTable"><div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Loading...</div></div>');

    try {
      var status = document.getElementById('maintFilter').value;
      var priority = document.getElementById('maintPriorityFilter').value;
      var path = '/maintenance?limit=50';
      if (status) path += '&status=' + status;
      if (priority) path += '&priority=' + priority;
      var res = await api(path);
      if (res.ok) {
        var reqs = res.data.data || [];
        if (reqs.length) {
          var rows = reqs.map(function(r) {
            var pt = r.priority === 'URGENT' || r.priority === 'HIGH' ? 'tag-red' : r.priority === 'MEDIUM' ? 'tag-yellow' : 'tag-gray';
            var st = r.status === 'COMPLETED' ? 'tag-green' : r.status === 'IN_PROGRESS' || r.status === 'ACKNOWLEDGED' ? 'tag-blue' : 'tag-yellow';
            var tenantName = r.tenant ? (r.tenant.firstName + ' ' + r.tenant.lastName) : '—';
            return '<tr><td><span class="val">' + h(r.title) + '</span></td><td>' + h(tenantName) + '</td><td>' + (r.unit ? h(r.unit.name) : '—') + '</td><td><span class="tag ' + pt + '">' + (r.priority || '—') + '</span></td><td><span class="tag ' + st + '">' + (r.status || '—') + '</span></td><td>' + (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—') + '</td><td>' +
              (roleTypes.includes('ADMIN') || roleTypes.includes('MANAGER') ? '<select class="maint-status-update" data-id="' + r.id + '" onchange="updateMaintStatus(this)"><option value="">Update</option><option value="ACKNOWLEDGED">Acknowledge</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancel</option></select>' : '') +
              '</td></tr>';
          }).join('');
          document.getElementById('maintTable').innerHTML = '<table><thead><tr><th>Title</th><th>Tenant</th><th>Unit</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>' + rows + '</tbody></table>';
        } else {
          document.getElementById('maintTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">No maintenance requests found.</div>';
        }
      }
    } catch(e) { document.getElementById('maintTable').innerHTML = '<div style="padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem">Could not load.</div>'; }
  }

  window.updateMaintStatus = async function(sel) {
    var id = sel.getAttribute('data-id');
    var status = sel.value;
    if (!status) return;
    try {
      var res = await api('/maintenance/' + id + '/status', { method: 'PATCH', body: { status: status } });
      if (res.ok) { renderMaintenance(); }
      else { toast(res.data.message || 'Failed to update'); }
    } catch(e) { toast('Failed to update'); }
  }

  /* ═══════════════════════════════════════════════════════════
     VENDORS VIEW
     ═══════════════════════════════════════════════════════════ */
  async function renderVendors() {
    setContent(
      '<div class="page-header"><h2>Vendors</h2><p>Service providers and contractors</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" onclick="openVendorModal()">+ Add Vendor</button></div>' +
      '<div class="card-grid" id="vendorList"><div class="loading" style="padding:2rem"><div class="pulse"></div></div></div>');

    try {
      var res = await api('/vendors');
      if (res.ok) {
        var vendors = res.data || [];
        if (vendors.length) {
          var cards = vendors.map(function(v) {
            return '<div class="card"><h4>' + h(v.name) + '</h4><p>' + (v.contactPerson ? h(v.contactPerson) + ' · ' : '') + (v.email ? h(v.email) + ' · ' : '') + (v.phone || '') + '</p><div class="meta"><span class="tag tag-blue">' + (v.specialty || 'OTHER') + '</span>' + (v.isApproved ? ' <span class="tag tag-green">Approved</span>' : '') + '</div></div>';
          }).join('');
          document.getElementById('vendorList').innerHTML = cards;
        } else {
          document.getElementById('vendorList').innerHTML = '<div class="empty-state"><div class="icon">🏪</div><p>No vendors yet. Add one to get started.</p></div>';
        }
      }
    } catch(e) { document.getElementById('vendorList').innerHTML = '<div class="empty-state"><p>Could not load vendors.</p></div>'; }
  }

  /* ═══════════════════════════════════════════════════════════
     MODAL HELPERS
     ═══════════════════════════════════════════════════════════ */

  // Property Modal
  window.openPropertyModal = function() {
    var html =
      '<div class="modal-overlay open" id="propModal"><div class="modal">' +
      '<h2>Add Property</h2><form id="propForm">' +
      '<div class="field"><label>Name *</label><input id="pName" placeholder="Property name" required></div>' +
      '<div class="field"><label>Address *</label><input id="pAddr" placeholder="Street address" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>City *</label><input id="pCity" required></div><div class="field"><label>State *</label><input id="pState" required></div><div class="field"><label>ZIP</label><input id="pZip"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Type</label><select id="pType"><option value="APARTMENT_COMPLEX">Apartment Complex</option><option value="SINGLE_FAMILY">Single Family</option><option value="MULTI_FAMILY">Multi Family</option><option value="COMMERCIAL">Commercial</option><option value="MIXED_USE">Mixed Use</option></select></div><div class="field"><label>Year Built</label><input id="pYear" type="number" placeholder="e.g. 2020"></div></div>' +
      '<div class="field"><label>Description</label><textarea id="pDesc" placeholder="Optional description"></textarea></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('propForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('pName').value.trim(), address: document.getElementById('pAddr').value.trim(), city: document.getElementById('pCity').value.trim(), state: document.getElementById('pState').value.trim(), zipCode: document.getElementById('pZip').value.trim(), type: document.getElementById('pType').value, yearBuilt: parseInt(document.getElementById('pYear').value) || undefined, description: document.getElementById('pDesc').value.trim() || undefined };
      try { var r = await api('/properties', { method: 'POST', body: body }); if (r.ok) { document.getElementById('propModal').remove(); renderProperties(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Building Modal
  window.openBuildingModal = function(propId) {
    var html =
      '<div class="modal-overlay open" id="bldgModal"><div class="modal">' +
      '<h2>Add Building</h2><form id="bldgForm">' +
      '<div class="field"><label>Name *</label><input id="bName" placeholder="Building name" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Code</label><input id="bCode" placeholder="e.g. BLDG-A"></div><div class="field"><label>Floors</label><input id="bFloors" type="number" placeholder="1"></div></div>' +
      '<div class="field"><label>Description</label><textarea id="bDesc" placeholder="Optional"></textarea></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('bldgForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('bName').value.trim(), code: document.getElementById('bCode').value.trim() || undefined, totalFloors: parseInt(document.getElementById('bFloors').value) || undefined, description: document.getElementById('bDesc').value.trim() || undefined };
      try { var r = await api('/properties/' + propId + '/buildings', { method: 'POST', body: body }); if (r.ok) { document.getElementById('bldgModal').remove(); showPropertyDetail(propId, ''); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Unit Modal
  window.openUnitModal = function(buildingId) {
    var html =
      '<div class="modal-overlay open" id="unitModal"><div class="modal">' +
      '<h2>Add Unit</h2><form id="unitForm">' +
      '<div class="field"><label>Unit Name *</label><input id="uName" placeholder="e.g. 101" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Bedrooms</label><input id="uBeds" type="number" value="0"></div><div class="field"><label>Bathrooms</label><input id="uBaths" type="number" value="0"></div><div class="field"><label>Sq Ft</label><input id="uSqft" type="number"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent $</label><input id="uRent" type="number" value="0"></div><div class="field"><label>Deposit $</label><input id="uDep" type="number" value="0"></div></div>' +
      '<div class="field"><label>Floor</label><input id="uFloor" type="number"></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('unitForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('uName').value.trim(), bedrooms: parseInt(document.getElementById('uBeds').value) || 0, bathrooms: parseInt(document.getElementById('uBaths').value) || 0, squareFootage: parseInt(document.getElementById('uSqft').value) || undefined, rentAmount: parseFloat(document.getElementById('uRent').value) || 0, depositAmount: parseFloat(document.getElementById('uDep').value) || 0, floorNumber: parseInt(document.getElementById('uFloor').value) || undefined };
      try { var r = await api('/properties/buildings/' + buildingId + '/units', { method: 'POST', body: body }); if (r.ok) { document.getElementById('unitModal').remove(); showBuildingDetail(buildingId, '', ''); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Delete Unit Modal
  window.editUnit = function(id, name, beds, baths, sqft, rent, status, floor, deposit, desc) {
    var html =
      '<div class="modal-overlay open" id="editUnitModal"><div class="modal">' +
      '<h2>Edit Unit ' + h(name) + '</h2><form id="editUnitForm">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Bedrooms</label><input id="euBeds" type="number" value="' + beds + '"></div><div class="field"><label>Bathrooms</label><input id="euBaths" type="number" value="' + baths + '"></div><div class="field"><label>Sq Ft</label><input id="euSqft" type="number" value="' + sqft + '"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem"><div class="field"><label>Rent $</label><input id="euRent" type="number" value="' + rent + '"></div><div class="field"><label>Deposit $</label><input id="euDep" type="number" value="' + deposit + '"></div><div class="field"><label>Floor</label><input id="euFloor" type="number" value="' + floor + '"></div></div>' +
      '<div class="field"><label>Status</label><select id="euStatus"><option value="VACANT"' + (status==='VACANT'?' selected':'') + '>Vacant</option><option value="OCCUPIED"' + (status==='OCCUPIED'?' selected':'') + '>Occupied</option><option value="MAINTENANCE"' + (status==='MAINTENANCE'?' selected':'') + '>Maintenance</option></select></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Save</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('editUnitForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { bedrooms: parseInt(document.getElementById('euBeds').value) || 0, bathrooms: parseInt(document.getElementById('euBaths').value) || 0, squareFootage: parseInt(document.getElementById('euSqft').value) || undefined, rentAmount: parseFloat(document.getElementById('euRent').value) || 0, depositAmount: parseFloat(document.getElementById('euDep').value) || 0, floorNumber: parseInt(document.getElementById('euFloor').value) || undefined, status: document.getElementById('euStatus').value };
      try { var r = await api('/properties/units/' + id, { method: 'PATCH', body: body }); if (r.ok) { document.getElementById('editUnitModal').remove(); showView('properties'); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Tenant Modal
  window.openTenantModal = function() {
    var html =
      '<div class="modal-overlay open" id="tenantModal"><div class="modal">' +
      '<h2>Add Tenant</h2><form id="tenantForm">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>First Name *</label><input id="tFn" required></div><div class="field"><label>Last Name *</label><input id="tLn" required></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Email *</label><input type="email" id="tEmail" required></div><div class="field"><label>Phone</label><input id="tPhone"></div></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('tenantForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { firstName: document.getElementById('tFn').value.trim(), lastName: document.getElementById('tLn').value.trim(), email: document.getElementById('tEmail').value.trim(), phone: document.getElementById('tPhone').value.trim() || undefined };
      try { var r = await api('/tenants', { method: 'POST', body: body }); if (r.ok) { document.getElementById('tenantModal').remove(); renderTenants(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  // Lease Modal
  window.openLeaseModal = function() {
    // Fetch units and tenants for dropdowns
    Promise.all([api('/properties?limit=200'), api('/tenants?limit=200')]).then(function(results) {
      var units = [];
      var tenants = [];
      if (results[0].ok) {
        var props = results[0].data.data || [];
        // We need to get buildings and units - simplified: use a units endpoint
        api('/properties?limit=200').then(function() {});
      }
      var html =
        '<div class="modal-overlay open" id="leaseModal"><div class="modal">' +
        '<h2>Create Lease</h2><form id="leaseForm">' +
        '<div class="field"><label>Tenant *</label><select id="lTenant" required>' +
        (results[1].ok ? (results[1].data.data || []).map(function(t) { return '<option value="' + t.id + '">' + h(t.firstName) + ' ' + h(t.lastName) + '</option>'; }).join('') : '') +
        '</select></div>' +
        '<div class="field"><label>Unit *</label><select id="lUnit" required><option value="">Select tenant first</option></select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent Amount $ *</label><input type="number" id="lRent" required></div><div class="field"><label>Deposit $</label><input type="number" id="lDep" value="0"></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Start Date *</label><input type="date" id="lStart" required></div><div class="field"><label>End Date</label><input type="date" id="lEnd"></div></div>' +
        '<div class="field"><label>Payment Day</label><input type="number" id="lPayDay" value="1" min="1" max="31"></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);

      // When tenant is selected, fetch units with leases
      document.getElementById('lTenant').addEventListener('change', function() {
        // For now, fetch all units and show vacant ones
        api('/properties?limit=200').then(function(pr) {
          var allUnits = [];
          if (pr.ok) {
            var props = pr.data.data || [];
            Promise.all(props.map(function(p) {
              return api('/properties/' + p.id + '/buildings').then(function(br) {
                if (br.ok) (br.data || []).forEach(function(b) {
                  b.units = []; // will be fetched separately
                });
              });
            }));
          }
        });
      });

      document.getElementById('leaseForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { tenantId: document.getElementById('lTenant').value, unitId: document.getElementById('lUnit').value, rentAmount: parseFloat(document.getElementById('lRent').value) || 0, depositAmount: parseFloat(document.getElementById('lDep').value) || 0, startDate: document.getElementById('lStart').value, endDate: document.getElementById('lEnd').value || null, paymentDay: parseInt(document.getElementById('lPayDay').value) || 1, status: 'ACTIVE' };
        try { var r = await api('/leases', { method: 'POST', body: body }); if (r.ok) { document.getElementById('leaseModal').remove(); renderLeases(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Invoice Modal
  window.openInvoiceModal = function() {
    // Fetch leases to populate dropdown
    api('/leases?limit=200').then(function(lr) {
      var html =
        '<div class="modal-overlay open" id="invModal"><div class="modal">' +
        '<h2>Create Invoice</h2><form id="invForm">' +
        '<div class="field"><label>Lease *</label><select id="iLease" required>' +
        (lr.ok ? (lr.data.data || []).map(function(l) { return '<option value="' + l.id + '">' + h(l.tenant ? l.tenant.firstName + ' ' + l.tenant.lastName : '') + ' - ' + (l.unit ? l.unit.name : '') + '</option>'; }).join('') : '') +
        '</select></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Rent Amount $ *</label><input type="number" id="iRent" required></div><div class="field"><label>Late Fee $</label><input type="number" id="iLate" value="0"></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Period Start *</label><input type="date" id="iPerStart" required></div><div class="field"><label>Period End *</label><input type="date" id="iPerEnd" required></div></div>' +
        '<div class="field"><label>Due Date *</label><input type="date" id="iDue" required></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
      document.getElementById('invForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { leaseId: document.getElementById('iLease').value, rentAmount: parseFloat(document.getElementById('iRent').value) || 0, lateFee: parseFloat(document.getElementById('iLate').value) || 0, periodStart: document.getElementById('iPerStart').value, periodEnd: document.getElementById('iPerEnd').value, dueDate: document.getElementById('iDue').value, status: 'PENDING' };
        try { var r = await api('/invoices', { method: 'POST', body: body }); if (r.ok) { document.getElementById('invModal').remove(); renderFinance(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Expense Modal
  window.openExpenseModal = function() {
    api('/properties?limit=200').then(function(pr) {
      var html =
        '<div class="modal-overlay open" id="expModal"><div class="modal">' +
        '<h2>Add Expense</h2><form id="expForm">' +
        '<div class="field"><label>Amount $ *</label><input type="number" id="eAmt" required></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Category</label><select id="eCat"><option value="REPAIRS">Repairs</option><option value="MAINTENANCE">Maintenance</option><option value="UTILITIES">Utilities</option><option value="INSURANCE">Insurance</option><option value="TAXES">Taxes</option><option value="MANAGEMENT">Management</option><option value="OTHER">Other</option></select></div><div class="field"><label>Property</label><select id="eProp"><option value="">None</option>' +
        (pr.ok ? (pr.data.data || []).map(function(p) { return '<option value="' + p.id + '">' + h(p.name) + '</option>'; }).join('') : '') +
        '</select></div></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Date</label><input type="date" id="eDate"></div><div class="field"><label>Vendor</label><input id="eVendor"></div></div>' +
        '<div class="field"><label>Description</label><textarea id="eDesc"></textarea></div>' +
        '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
      document.getElementById('expForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        var body = { amount: parseFloat(document.getElementById('eAmt').value) || 0, category: document.getElementById('eCat').value, propertyId: document.getElementById('eProp').value || null, expenseDate: document.getElementById('eDate').value || new Date().toISOString().split('T')[0], vendor: document.getElementById('eVendor').value.trim() || undefined, description: document.getElementById('eDesc').value.trim() || undefined };
        try { var r = await api('/expenses', { method: 'POST', body: body }); if (r.ok) { document.getElementById('expModal').remove(); renderFinance(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
      });
    });
  };

  // Vendor Modal
  window.openVendorModal = function() {
    var html =
      '<div class="modal-overlay open" id="vendorModal"><div class="modal">' +
      '<h2>Add Vendor</h2><form id="vendorForm">' +
      '<div class="field"><label>Company Name *</label><input id="vName" required></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Contact Person</label><input id="vContact"></div><div class="field"><label>Specialty</label><select id="vSpec"><option value="PLUMBING">Plumbing</option><option value="ELECTRICAL">Electrical</option><option value="HVAC">HVAC</option><option value="GENERAL">General</option><option value="PAINTING">Painting</option><option value="ROOFING">Roofing</option><option value="LANDSCAPING">Landscaping</option><option value="CLEANING">Cleaning</option><option value="OTHER">Other</option></select></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem"><div class="field"><label>Email</label><input type="email" id="vEmail"></div><div class="field"><label>Phone</label><input id="vPhone"></div></div>' +
      '<div class="btn-row"><button type="submit" class="btn btn-primary btn-sm">Create</button><button type="button" class="btn btn-secondary btn-sm" onclick="closeModal()">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div'); div.innerHTML = html; document.body.appendChild(div);
    document.getElementById('vendorForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      var body = { name: document.getElementById('vName').value.trim(), contactPerson: document.getElementById('vContact').value.trim() || undefined, email: document.getElementById('vEmail').value.trim() || undefined, phone: document.getElementById('vPhone').value.trim() || undefined, specialty: document.getElementById('vSpec').value };
      try { var r = await api('/vendors', { method: 'POST', body: body }); if (r.ok) { document.getElementById('vendorModal').remove(); renderVendors(); } else { toast(r.data.message || 'Failed'); } } catch(e) { toast('Failed'); }
    });
  };

  /* ── Start ─────────────────────────────────────────────── */
  init();
})();
