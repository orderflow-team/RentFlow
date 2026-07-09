const fs = require('fs');
let c = fs.readFileSync('src/app.service.ts', 'utf8');
let changes = 0;

function replace(oldStr, newStr) {
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    changes++;
    console.log('  OK: ' + oldStr.substring(0, 60).replace(/\n/g, '\\n'));
  } else {
    console.log('  MISS: ' + oldStr.substring(0, 60).replace(/\n/g, '\\n'));
  }
}

// === 1. ADD TOAST + CONFIRM CSS ===
console.log('\n=== 1. Toast + Confirm CSS ===');
replace(
  `.back-link:hover{color:#18181b}

    /* === Responsive === */`,
  `.back-link:hover{color:#18181b}

    /* === Toast === */
    .toast{position:fixed;bottom:1.5rem;right:1.5rem;z-index:300;display:flex;flex-direction:column;gap:.5rem;pointer-events:none}
    .toast-item{background:#18181b;color:#fff;padding:.65rem 1rem;border-radius:8px;font-size:.82rem;box-shadow:0 8px 24px rgba(0,0,0,.15);animation:toastIn .2s ease;pointer-events:auto;max-width:360px;line-height:1.4}
    .toast-item.success{background:#16a34a}
    .toast-item.error{background:#dc2626}
    .toast-item.info{background:#2563eb}
    @keyframes toastIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}

    /* === Confirm Dialog === */
    .confirm-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:250;align-items:center;justify-content:center;padding:2rem}
    .confirm-overlay.open{display:flex}
    .confirm-box{background:#fff;border-radius:12px;padding:1.5rem;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.15)}
    .confirm-box h3{font-size:1rem;font-weight:600;margin-bottom:.5rem}
    .confirm-box p{font-size:.82rem;color:#71717a;margin-bottom:1.25rem}
    .confirm-box .btn-row{display:flex;gap:.5rem;justify-content:flex-end}

    /* === Responsive === */`
);

// === 2. ADD TOAST CONTAINER HTML ===
console.log('\n=== 2. Toast Container ===');
replace(
  `  </div>
</div>

<script>
(function() {
  var token =`,
  `  </div>
</div>
<div id="toastContainer" class="toast"></div>

<script>
(function() {
  var token =`
);

// === 3. ADD toast() AND confirmAction() FUNCTIONS ===
console.log('\n=== 3. Toast + Confirm Functions ===');
replace(
  `    });
  }

  window.showView = function(view) {`,
  `    });
  }

  function toast(msg, type) {
    var tc = document.getElementById('toastContainer');
    if (!tc) { tc = document.createElement('div'); tc.id = 'toastContainer'; tc.className = 'toast'; document.body.appendChild(tc); }
    var el = document.createElement('div'); el.className = 'toast-item ' + (type || '');
    el.textContent = msg; tc.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(function() { el.remove(); }, 300); }, 3000);
  }

  function confirmAction(msg, cb) {
    var html = '<div class=\\"confirm-overlay open\\" id=\\"confirmDlg\\"><div class=\\"confirm-box\\"><h3>Confirm</h3><p>' + h(msg) + '</p><div class=\\"btn-row\\"><button class=\\"btn btn-danger btn-sm\\" id=\\"confirmYes\\">Yes, proceed</button><button class=\\"btn btn-secondary btn-sm\\" id=\\"confirmNo\\">Cancel</button></div></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('confirmYes').onclick = function() { div.remove(); cb(); };
    document.getElementById('confirmNo').onclick = function() { div.remove(); };
  }

  window.showView = function(view) {`
);

// === 4. REPLACE alert() CALLS ===
console.log('\n=== 4. Replace alert() calls ===');
replace(
  `else { alert(res.data.message || 'Failed'); }
      } catch(e) { alert('Failed to submit request'); }`,
  `else { toast(res.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to submit request', 'error'); }`
);

replace(
  `else { alert(res.data.message || 'Failed to update'); }
    } catch(e) { alert('Failed to update'); }`,
  `else { toast(res.data.message || 'Failed to update', 'error'); }
    } catch(e) { toast('Failed to update', 'error'); }`
);

// === 5. TENANTS: Add search bar ===
console.log('\n=== 5. Tenant search bar + clickable rows ===');
replace(
  `async function renderTenants() {
    setContent(
      '<div class=\"page-header\"><h2>Tenants</h2><p>Manage your residents</p></div>' +
      '<div class=\"btn-row\"><button class=\"btn btn-primary btn-sm\" onclick=\"openTenantModal()\">+ Add Tenant</button></div>' +
      '<div class=\"table-wrap\" id=\"tenantTable\"><div style=\"padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem\">Loading...</div></div>');`,
  `async function renderTenants() {
    setContent(
      '<div class=\"page-header\"><h2>Tenants</h2><p>Manage your residents</p></div>' +
      '<div class=\"btn-row\"><button class=\"btn btn-primary btn-sm\" onclick=\"openTenantModal()\">+ Add Tenant</button></div>' +
      '<div class=\"filter-bar\"><input id=\"tenantSearch\" placeholder=\"Search by name or email...\" onkeyup=\"if(event.key===\\'Enter\\')renderTenants()\"></div>' +
      '<div class=\"table-wrap\" id=\"tenantTable\"><div style=\"padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem\">Loading...</div></div>');`
);

replace(
  `var res = await api('/tenants?limit=50');`,
  `var search = (document.getElementById('tenantSearch') || {}).value; var path = '/tenants?limit=50'; if (search) path += '&search=' + encodeURIComponent(search); var res = await api(path);`
);

replace(
  `return '<tr><td><span class=\"val\">' + h(t.firstName) + ' ' + h(t.lastName) + '</span></td><td>' + h(t.email) + '</td><td>' + (t.phone || '—') + '</td><td><span class=\"tag ' + st + '\">' + (t.status || '—') + '</span></td><td>' + new Date(t.createdAt).toLocaleDateString() + '</td></tr>';`,
  `return '<tr style=\"cursor:pointer\" onclick=\"showTenantDetail(\\'' + t.id + '\\')\"><td><span class=\"val\">' + h(t.firstName) + ' ' + h(t.lastName) + '</span></td><td>' + h(t.email) + '</td><td>' + (t.phone || '—') + '</td><td><span class=\"tag ' + st + '\">' + (t.status || '—') + '</span></td><td>' + new Date(t.createdAt).toLocaleDateString() + '</td></tr>';`
);

// === 6. ADD TENANT DETAIL VIEW FUNCTION ===
console.log('\n=== 6. Tenant Detail View ===');
replace(
  `  /* ═══════════════════════════════════════════════════════════
     LEASES VIEW
     ═══════════════════════════════════════════════════════════ */`,
  `  /* ── Tenant Detail ────────────────────────────────────── */
  window.showTenantDetail = async function(id) {
    try {
      var res = await api('/tenants/' + id);
      if (!res.ok) { toast('Could not load tenant', 'error'); showView('tenants'); return; }
      var t = res.data;
      var isAdmin = roleTypes.includes('ADMIN');
      setContent(
        '<a class=\"back-link\" onclick=\"showView(\\'tenants\\')\">← Back to tenants</a>' +
        '<div class=\"page-header\"><h2>' + h(t.firstName) + ' ' + h(t.lastName) + '</h2><p>' + h(t.email) + '</p></div>' +
        '<div class=\"card-grid\" id=\"tdDetail\"></div>' +
        '<div class=\"btn-row\">' +
          '<button class=\"btn btn-primary btn-sm\" onclick=\"editTenant(\\'' + id + '\\',\\'' + h(t.firstName.replace(/'/g,'\\\\\\'')) + '\\',\\'' + h(t.lastName.replace(/'/g,'\\\\\\'')) + '\\',\\'' + h(t.email) + '\\',\\'' + h((t.phone||'')) + '\\',\\'' + (t.status||'ACTIVE') + '\\')\">Edit Tenant</button>' +
          (isAdmin ? ' <button class=\"btn btn-danger btn-sm\" onclick=\"confirmAction(\\'Delete this tenant? This cannot be undone.\\',function(){deleteTenant(\\'' + id + '\\')})\">Delete Tenant</button>' : '') +
        '</div>');
      document.getElementById('tdDetail').innerHTML =
        '<div class=\"card\"><h4>Contact Info</h4><p>Email: ' + h(t.email) + '</p><p>Phone: ' + h(t.phone || '—') + '</p><div class=\"meta\">Status: <span class=\"tag ' + (t.status === 'ACTIVE' ? 'tag-green' : 'tag-gray') + '\">' + (t.status || '—') + '</span></div></div>' +
        '<div class=\"card\"><h4>Emergency Contact</h4><p>' + h((typeof t.emergencyContact === 'string' ? t.emergencyContact : '—')) + '</p></div>';
    } catch(e) { toast('Failed to load tenant', 'error'); showView('tenants'); }
  }

  window.editTenant = function(id, fn, ln, email, phone, status) {
    var html =
      '<div class=\"modal-overlay open\" id=\"editTenantModal\">' +
      '<div class=\"modal\"><h2>Edit Tenant</h2>' +
      '<form id=\"editTenantForm\">' +
      '<div class=\"field\"><label>First Name</label><input type=\"text\" id=\"etFn\" value=\"' + h(fn) + '\" required></div>' +
      '<div class=\"field\"><label>Last Name</label><input type=\"text\" id=\"etLn\" value=\"' + h(ln) + '\" required></div>' +
      '<div class=\"field\"><label>Email</label><input type=\"email\" id=\"etEmail\" value=\"' + h(email) + '\" required></div>' +
      '<div class=\"field\"><label>Phone</label><input type=\"text\" id=\"etPhone\" value=\"' + h(phone) + '\"></div>' +
      '<div class=\"field\"><label>Status</label><select id=\"etStatus\"><option value=\"ACTIVE\"' + (status==='ACTIVE'?' selected':'') + '>Active</option><option value=\"FORMER\"' + (status==='FORMER'?' selected':'') + '>Former</option></select></div>' +
      '<div class=\"btn-row\"><button type=\"submit\" class=\"btn btn-primary btn-sm\">Save</button>' +
      '<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"this.closest(\\'.modal-overlay\\').remove()\">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('editTenantForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      try {
        var res = await api('/tenants/' + id, { method: 'PATCH', body: { firstName: document.getElementById('etFn').value.trim(), lastName: document.getElementById('etLn').value.trim(), email: document.getElementById('etEmail').value.trim(), phone: document.getElementById('etPhone').value.trim(), status: document.getElementById('etStatus').value } });
        if (res.ok) { document.getElementById('editTenantModal').remove(); toast('Tenant updated', 'success'); showTenantDetail(id); }
        else { toast(res.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to update', 'error'); }
    });
  }

  async function deleteTenant(id) {
    try {
      var res = await api('/tenants/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Tenant deleted', 'success'); showView('tenants'); }
      else { toast(res.data.message || 'Failed to delete', 'error'); }
    } catch(e) { toast('Failed to delete', 'error'); }
  }

  /* ═══════════════════════════════════════════════════════════
     LEASES VIEW
     ═══════════════════════════════════════════════════════════ */`
);

// === 7. LEASES: Add edit/terminate buttons + search ===
console.log('\n=== 7. Lease edit/delete + search ===');
replace(
  `window.renderLeases = async function() {
    setContent(
      '<div class=\"page-header\"><h2>Leases</h2><p>Active and past rental contracts</p></div>' +
      '<div class=\"btn-row\"><button class=\"btn btn-primary btn-sm\" onclick=\"openLeaseModal()\">+ Create Lease</button></div>' +
      '<div class=\"filter-bar\">' +
      '<select id=\"leaseFilter\" onchange=\"renderLeases()\"><option value=\"\">All status</option><option value=\"ACTIVE\">Active</option><option value=\"EXPIRED\">Expired</option><option value=\"TERMINATED\">Terminated</option><option value=\"DRAFT\">Draft</option></select>' +
      '</div>' +
      '<div class=\"table-wrap\" id=\"leaseTable\"><div style=\"padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem\">Loading...</div></div>');`,
  `window.renderLeases = async function() {
    setContent(
      '<div class=\"page-header\"><h2>Leases</h2><p>Active and past rental contracts</p></div>' +
      '<div class=\"btn-row\"><button class=\"btn btn-primary btn-sm\" onclick=\"openLeaseModal()\">+ Create Lease</button></div>' +
      '<div class=\"filter-bar\">' +
      '<select id=\"leaseFilter\" onchange=\"renderLeases()\"><option value=\"\">All status</option><option value=\"ACTIVE\">Active</option><option value=\"EXPIRED\">Expired</option><option value=\"TERMINATED\">Terminated</option><option value=\"DRAFT\">Draft</option></select>' +
      '<input id=\"leaseSearch\" placeholder=\"Search tenant...\" style=\"width:160px\" onkeyup=\"if(event.key===\\'Enter\\')renderLeases()\">' +
      '</div>' +
      '<div class=\"table-wrap\" id=\"leaseTable\"><div style=\"padding:1.25rem;text-align:center;color:#a1a1aa;font-size:.82rem\">Loading...</div></div>');`
);

replace(
  `var status = document.getElementById('leaseFilter').value;
      var path = '/leases?limit=50';
      if (status) path += '&status=' + status;`,
  `var status = document.getElementById('leaseFilter').value;
      var search = (document.getElementById('leaseSearch') || {}).value;
      var path = '/leases?limit=50';
      if (status) path += '&status=' + status;
      if (search) path += '&search=' + encodeURIComponent(search);`
);

replace(
  `return '<tr><td><span class=\"val\">' + h(l.tenant ? (l.tenant.firstName + ' ' + l.tenant.lastName) : '—') + '</span></td><td>' + (l.unit ? h(l.unit.name) : '—') + (l.unit && l.unit.building ? ' · ' + h(l.unit.building.name) : '') + '</td><td><span class=\"val\">$' + ((l.rentAmount || 0)).toLocaleString() + '</span></td><td><span class=\"tag ' + st + '\">' + (l.status || '—') + '</span></td><td>' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</td></tr>';`,
  `return '<tr><td><span class=\"val\">' + h(l.tenant ? (l.tenant.firstName + ' ' + l.tenant.lastName) : '—') + '</span></td><td>' + (l.unit ? h(l.unit.name) : '—') + (l.unit && l.unit.building ? ' · ' + h(l.unit.building.name) : '') + '</td><td><span class=\"val\">$' + ((l.rentAmount || 0)).toLocaleString() + '</span></td><td><span class=\"tag ' + st + '\">' + (l.status || '—') + '</span></td><td>' + new Date(l.startDate).toLocaleDateString() + ' — ' + (l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open') + '</td><td><button class=\"btn btn-secondary btn-xs\" onclick=\"editLease(\\'' + l.id + '\\')\">Edit</button>' + (roleTypes.includes('ADMIN') ? ' <button class=\"btn btn-danger btn-xs\" onclick=\"confirmAction(\\'Delete this lease?\\',function(){deleteLease(\\'' + l.id + '\\')})\">Delete</button>' : '') + '</td></tr>';`
);

// === 8. ADD LEASE EDIT/DELETE FUNCTIONS ===
console.log('\n=== 8. Lease Edit/Delete Functions ===');
replace(
  `  /* ═══════════════════════════════════════════════════════════
     FINANCE VIEW
     ═══════════════════════════════════════════════════════════ */`,
  `  /* ── Lease Edit/Delete ────────────────────────────────── */
  window.editLease = async function(id) {
    try {
      var res = await api('/leases/' + id);
      if (!res.ok) { toast('Could not load lease', 'error'); return; }
      var l = res.data;
      var html =
        '<div class=\"modal-overlay open\" id=\"editLeaseModal\">' +
        '<div class=\"modal\"><h2>Edit Lease</h2>' +
        '<form id=\"editLeaseForm\">' +
        '<div class=\"field\"><label>Rent Amount ($)</label><input type=\"number\" id=\"elRent\" value=\"' + (l.rentAmount || 0) + '\" required></div>' +
        '<div class=\"field\"><label>Status</label><select id=\"elStatus\"><option value=\"ACTIVE\"' + (l.status==='ACTIVE'?' selected':'') + '>Active</option><option value=\"EXPIRED\"' + (l.status==='EXPIRED'?' selected':'') + '>Expired</option><option value=\"TERMINATED\"' + (l.status==='TERMINATED'?' selected':'') + '>Terminated</option><option value=\"DRAFT\"' + (l.status==='DRAFT'?' selected':'') + '>Draft</option></select></div>' +
        '<div class=\"field\"><label>End Date</label><input type=\"date\" id=\"elEnd\" value=\"' + (l.endDate ? l.endDate.split('T')[0] : '') + '\"></div>' +
        '<div class=\"btn-row\"><button type=\"submit\" class=\"btn btn-primary btn-sm\">Save</button>' +
        '<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"this.closest(\\'.modal-overlay\\').remove()\">Cancel</button></div>' +
        '</form></div></div>';
      var div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div);
      document.getElementById('editLeaseForm').addEventListener('submit', async function(ev) {
        ev.preventDefault();
        try {
          var body = { rentAmount: +document.getElementById('elRent').value, status: document.getElementById('elStatus').value };
          var endDate = document.getElementById('elEnd').value;
          if (endDate) body.endDate = new Date(endDate).toISOString();
          var r = await api('/leases/' + id, { method: 'PATCH', body: body });
          if (r.ok) { document.getElementById('editLeaseModal').remove(); toast('Lease updated', 'success'); renderLeases(); }
          else { toast(r.data.message || 'Failed', 'error'); }
        } catch(e) { toast('Failed to update', 'error'); }
      });
    } catch(e) { toast('Failed to load lease', 'error'); }
  }

  async function deleteLease(id) {
    try {
      var res = await api('/leases/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Lease deleted', 'success'); renderLeases(); }
      else { toast(res.data.message || 'Failed to delete', 'error'); }
    } catch(e) { toast('Failed to delete', 'error'); }
  }

  /* ═══════════════════════════════════════════════════════════
     FINANCE VIEW
     ═══════════════════════════════════════════════════════════ */`
);

// === 9. FINANCE: Add Record Payment + expense delete ===
console.log('\n=== 9. Record Payment + Expense Delete ===');
replace(
  `return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class=\"val\">$' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class=\"val\">$' + (i.paidAmount || 0).toLocaleString() + '</span></td><td><span class=\"val\">$' + (i.balanceDue || 0).toLocaleString() + '</span></td><td><span class=\"tag ' + st + '\">' + (i.status || '—') + '</span></td><td>' + h(i.tenant || '—') + '</td><td>' + h(i.unit || '—') + '</td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td></tr>';`,
  `return '<tr><td>' + h(i.invoiceNumber) + '</td><td><span class=\"val\">$' + (i.totalAmount || 0).toLocaleString() + '</span></td><td><span class=\"val\">$' + (i.paidAmount || 0).toLocaleString() + '</span></td><td><span class=\"val\">$' + (i.balanceDue || 0).toLocaleString() + '</span></td><td><span class=\"tag ' + st + '\">' + (i.status || '—') + '</span></td><td>' + h(i.tenant || '—') + '</td><td>' + h(i.unit || '—') + '</td><td>' + new Date(i.dueDate).toLocaleDateString() + '</td><td>' + (i.status !== 'PAID' && i.balanceDue > 0 ? '<button class=\"btn btn-primary btn-xs\" onclick=\"recordPayment(\\'' + i.id + '\\',\\'' + h(i.invoiceNumber) + '\\',\\'' + (i.balanceDue || 0) + '\\')\">Pay</button>' : '') + '</td></tr>';`
);

replace(
  `return '<tr><td>' + new Date(e.expenseDate).toLocaleDateString() + '</td><td><span class=\"tag tag-gray\">' + (e.category || '—') + '</span></td><td><span class=\"val\">$' + (e.amount || 0).toLocaleString() + '</span></td><td>' + h(e.description || '') + '</td><td>' + h(e.vendor || '') + '</td></tr>';`,
  `return '<tr><td>' + new Date(e.expenseDate).toLocaleDateString() + '</td><td><span class=\"tag tag-gray\">' + (e.category || '—') + '</span></td><td><span class=\"val\">$' + (e.amount || 0).toLocaleString() + '</span></td><td>' + h(e.description || '') + '</td><td>' + h(e.vendor || '') + '</td><td><button class=\"btn btn-danger btn-xs\" onclick=\"confirmAction(\\'Delete this expense?\\',function(){deleteExpense(\\'' + e.id + '\\')})\">Delete</button></td></tr>';`
);

// === 10. ADD RECORD PAYMENT + DELETE EXPENSE FUNCTIONS ===
console.log('\n=== 10. Record Payment + Delete Expense Functions ===');
replace(
  `  /* ═══════════════════════════════════════════════════════════
     MAINTENANCE VIEW (Staff)
     ═══════════════════════════════════════════════════════════ */`,
  `  /* ── Record Payment ──────────────────────────────────── */
  window.recordPayment = function(invId, invNum, balance) {
    var html =
      '<div class=\"modal-overlay open\" id=\"payModal\">' +
      '<div class=\"modal\"><h2>Record Payment - ' + h(invNum) + '</h2>' +
      '<form id=\"payForm\">' +
      '<div class=\"field\"><label>Amount ($)</label><input type=\"number\" id=\"payAmount\" value=\"' + balance + '\" step=\"0.01\" required></div>' +
      '<div class=\"field\"><label>Payment Method</label><select id=\"payMethod\"><option value=\"ONLINE\">Online</option><option value=\"CHECK\">Check</option><option value=\"CASH\">Cash</option><option value=\"BANK_TRANSFER\">Bank Transfer</option></select></div>' +
      '<div class=\"field\"><label>Date</label><input type=\"date\" id=\"payDate\" value=\"' + new Date().toISOString().split('T')[0] + '\"></div>' +
      '<div class=\"field\"><label>Reference (optional)</label><input type=\"text\" id=\"payRef\" placeholder=\"e.g. Check #1234\"></div>' +
      '<div class=\"btn-row\"><button type=\"submit\" class=\"btn btn-primary btn-sm\">Record Payment</button>' +
      '<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"this.closest(\\'.modal-overlay\\').remove()\">Cancel</button></div>' +
      '</form></div></div>';
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    document.getElementById('payForm').addEventListener('submit', async function(ev) {
      ev.preventDefault();
      try {
        var res = await api('/invoices/' + invId + '/pay', { method: 'POST', body: { amount: +document.getElementById('payAmount').value, paymentMethod: document.getElementById('payMethod').value, paymentDate: document.getElementById('payDate').value, reference: document.getElementById('payRef').value.trim() } });
        if (res.ok) { document.getElementById('payModal').remove(); toast('Payment recorded', 'success'); renderFinance(); }
        else { toast(res.data.message || 'Failed', 'error'); }
      } catch(e) { toast('Failed to record payment', 'error'); }
    });
  }

  async function deleteExpense(id) {
    try {
      var res = await api('/expenses/' + id, { method: 'DELETE' });
      if (res.ok) { toast('Expense deleted', 'success'); renderFinance(); }
      else { toast(res.data.message || 'Failed to delete', 'error'); }
    } catch(e) { toast('Failed to delete', 'error'); }
  }

  /* ═══════════════════════════════════════════════════════════
     MAINTENANCE VIEW (Staff)
     ═══════════════════════════════════════════════════════════ */`
);

// === 11. PROPERTIES: Add edit/delete buttons ===
console.log('\n=== 11. Property Edit/Delete ===');
replace(
  `return '<div class=\"card\" style=\"cursor:pointer\" onclick=\"showPropertyDetail(\\'' + p.id + '\\',\\'' + h(p.name) + '\\')\">' +
              '<h4>' + h(p.name) + '</h4>' +
              '<p>' + h(p.address || '') + ', ' + h(p.city || '') + '</p>' +
              '<div class=\"meta\">' + (p.buildingCount || 0) + ' buildings · <span class=\"tag ' + (p.status === 'ACTIVE' ? 'tag-green' : p.status === 'UNDER_MAINTENANCE' ? 'tag-yellow' : 'tag-gray') + '\">' + (p.status || '—') + '</span></div>' +
              '</div>';`,
  `return '<div class=\"card\">' +
              '<div style=\"cursor:pointer\" onclick=\"showPropertyDetail(\\'' + p.id + '\\',\\'' + h(p.name) + '\\')\">' +
              '<h4>' + h(p.name) + '</h4>' +
              '<p>' + h(p.address || '') + ', ' + h(p.city || '') + '</p>' +
              '<div class=\"meta\">' + (p.buildingCount || 0) + ' buildings · <span class=\"tag ' + (p.status === 'ACTIVE' ? 'tag-green' : p.status === 'UNDER_MAINTENANCE' ? 'tag-yellow' : 'tag-gray') + '\">' + (p.status || '—') + '</span></div></div>' +
              (isStaff ? '<div style=\"margin-top:.5rem\"><button class=\"btn btn-secondary btn-xs\" onclick=\"editProperty(\\'' + p.id + '\\',\\'' + h(p.name.replace(/'/g,'\\\\\\'')) + '\\',\\'' + h((p.address||'').replace(/'/g,'\\\\\\'')) + '\\',\\'' + h((p.city||'').replace(/'/g,'\\\\\\'')) + '\\',\\'' + (p.status||'ACTIVE') + '\\')\">Edit</button> ' + (roleTypes.includes('ADMIN') ? '<button class=\"btn btn-danger btn-xs\" onclick=\"confirmAction(\\'Delete this property and all its units?\\',function(){deleteProperty(\\'' + p.id + '\\')})\">Delete</button>' : '') + '</div>' : '') +
              '</div>';`
);

// === 12. ADD PROPERTY EDIT/DELETE FUNCTIONS ===
console.log('\n=== 12. Property Edit/Delete Functions ===');
replace(
  `  /* ── Property Detail ────────────────────────────────────── */`,
  `  /* ── Property Edit/Delete ─────────────────────────────── */
  window.editProperty = function(id, name, address, city, status) {
    var html =
      '<div class=\"modal-overlay open\" id=\"editPropModal\">' +
      '<div class=\"modal\"><h2>Edit Property</h2>' +
      '<form id=\"editPropForm\">' +
      '<div class=\"field\"><label>Name</label><input type=\"text\" id=\"epName\" value=\"' + h(name) + '\" required></div>' +
      '<div class=\"field\"><label>Address</label><input type=\"text\" id=\"epAddr\" value=\"' + h(address) + '\"></div>' +
      '<div class=\"field\"><label>City</label><input type=\"text\" id=\"epCity\" value=\"' + h(city) + '\"></div>' +
      '<div class=\"field\"><label>Status</label><select id=\"epStatus\"><option value=\"ACTIVE\"' + (status==='ACTIVE'?' selected':'') + '>Active</option><option value=\"INACTIVE\"' + (status==='INACTIVE'?' selected':'') + '>Inactive</option><option value=\"UNDER_MAINTENANCE\"' + (status==='UNDER_MAINTENANCE'?' selected':'') + '>Under Maintenance</option></select></div>' +
      '<div class=\"btn-row\"><button type=\"submit\" class=\"btn btn-primary btn-sm\">Save</button>' +
      '<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"this.closest(\\'.modal-overlay\\').remove()\">Cancel</button></div>' +
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

  /* ── Property Detail ────────────────────────────────────── */`
);

fs.writeFileSync('src/app.service.ts', c, 'utf8');
console.log('\nTotal targeted changes: ' + changes);
console.log('DONE');
