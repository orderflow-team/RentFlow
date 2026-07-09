"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding RentFlow database (Indian Localized)...\n');
    console.log('🧹 Cleaning existing data...');
    await prisma.payment.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.lease.deleteMany({});
    await prisma.maintenanceRequest.deleteMany({});
    await prisma.vendor.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.unit.deleteMany({});
    await prisma.building.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.owner.deleteMany({});
    await prisma.tenant.deleteMany({});
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
    console.log('✅ Database cleaned.\n');
    const roles = [
        { type: 'ADMIN', name: 'Administrator', slug: 'admin', level: 100 },
        { type: 'MANAGER', name: 'Manager', slug: 'manager', level: 80 },
        { type: 'ACCOUNTANT', name: 'Accountant', slug: 'accountant', level: 60 },
        { type: 'OWNER', name: 'Property Owner', slug: 'owner', level: 40 },
        { type: 'TENANT', name: 'Tenant', slug: 'tenant', level: 20 },
    ];
    for (const role of roles) {
        await prisma.role.upsert({
            where: { type: role.type },
            update: { name: role.name, slug: role.slug, level: role.level },
            create: role,
        });
    }
    console.log('  ✅ Roles created');
    const company = await prisma.company.upsert({
        where: { slug: 'acme-properties' },
        update: {},
        create: {
            name: 'Aashiyana Realty Management Pvt. Ltd.',
            slug: 'acme-properties',
            email: 'info@acmeproperties.com',
            phone: '+91 98450 12345',
            address: 'Plot No. 12, 100 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034',
            status: 'ACTIVE',
            timezone: 'Asia/Kolkata',
            locale: 'en-IN',
        },
    });
    console.log('  ✅ Demo company: Aashiyana Realty Management Pvt. Ltd.');
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@acmeproperties.com' },
        update: {},
        create: {
            email: 'admin@acmeproperties.com',
            passwordHash,
            firstName: 'Priya',
            lastName: 'Sharma',
            phone: '+91 98100 20000',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    const managerUser = await prisma.user.upsert({
        where: { email: 'manager@acmeproperties.com' },
        update: {},
        create: {
            email: 'manager@acmeproperties.com',
            passwordHash,
            firstName: 'Amit',
            lastName: 'Verma',
            phone: '+91 98100 20001',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    const accountantUser = await prisma.user.upsert({
        where: { email: 'accountant@acmeproperties.com' },
        update: {},
        create: {
            email: 'accountant@acmeproperties.com',
            passwordHash,
            firstName: 'Jessica',
            lastName: 'DSouza',
            phone: '+91 98100 20002',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    const adminRole = await prisma.role.findUnique({ where: { type: 'ADMIN' } });
    const managerRole = await prisma.role.findUnique({ where: { type: 'MANAGER' } });
    const accountantRole = await prisma.role.findUnique({ where: { type: 'ACCOUNTANT' } });
    if (adminRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: adminUser.id, roleId: adminRole.id, companyId: company.id } },
            update: {},
            create: { userId: adminUser.id, roleId: adminRole.id, companyId: company.id },
        });
    }
    if (managerRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: managerUser.id, roleId: managerRole.id, companyId: company.id } },
            update: {},
            create: { userId: managerUser.id, roleId: managerRole.id, companyId: company.id },
        });
    }
    if (accountantRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: accountantUser.id, roleId: accountantRole.id, companyId: company.id } },
            update: {},
            create: { userId: accountantUser.id, roleId: accountantRole.id, companyId: company.id },
        });
    }
    console.log('  ✅ Demo users created (admin/manager/accountant@acmeproperties.com / password123)');
    const sunsetTowers = await prisma.property.upsert({
        where: { id: 'prop-sunset-towers' },
        update: {},
        create: {
            id: 'prop-sunset-towers',
            companyId: company.id,
            name: 'Skyline Heights',
            type: 'APARTMENT_COMPLEX',
            status: 'ACTIVE',
            description: 'Luxury apartment complex in Outer Ring Road, Bellandur with stunning cityscape views. Features a clubhouse, gymnasium, swimming pool, and 24/7 security.',
            address: '12, Outer Ring Road, Bellandur',
            city: 'Bengaluru',
            state: 'Karnataka',
            zipCode: '560103',
            totalUnits: 24,
            yearBuilt: 2020,
            amenities: JSON.stringify({ pool: true, gym: true, parking: 'basement', security: true, petFriendly: true, backupGen: true }),
            createdById: adminUser.id,
            latitude: 12.9279,
            longitude: 77.6811,
        },
    });
    const oakwoodEstates = await prisma.property.upsert({
        where: { id: 'prop-oakwood' },
        update: {},
        create: {
            id: 'prop-oakwood',
            companyId: company.id,
            name: 'Gulmohar Residency',
            type: 'MULTI_FAMILY',
            status: 'ACTIVE',
            description: 'Premium garden-style luxury apartments nestled in DLF Phase 3. Close to Cyber City, metro stations, and modern convenience stores.',
            address: 'DLF Phase 3',
            city: 'Gurugram',
            state: 'Haryana',
            zipCode: '122002',
            totalUnits: 16,
            yearBuilt: 2018,
            amenities: JSON.stringify({ pool: true, gym: false, parking: 'covered', petFriendly: true, clubhouse: true }),
            createdById: adminUser.id,
            latitude: 28.4900,
            longitude: 77.0900,
        },
    });
    const riversidePlaza = await prisma.property.upsert({
        where: { id: 'prop-riverside' },
        update: {},
        create: {
            id: 'prop-riverside',
            companyId: company.id,
            name: 'Ganga Arcade',
            type: 'MIXED_USE',
            status: 'ACTIVE',
            description: 'Mixed-use premium tower with high-street retail on the lower floors and premium office/residential spaces above.',
            address: 'A-54, MG Road, Sector 62',
            city: 'Noida',
            state: 'Uttar Pradesh',
            zipCode: '201301',
            totalUnits: 30,
            yearBuilt: 2022,
            amenities: JSON.stringify({ pool: true, gym: true, parking: 'multi-level', security: true, retail: true, powerBackup: true }),
            createdById: adminUser.id,
            latitude: 28.6200,
            longitude: 77.3600,
        },
    });
    console.log('  ✅ 3 demo properties created');
    await prisma.building.upsert({
        where: { companyId_code: { companyId: company.id, code: 'ST-A' } },
        update: {},
        create: {
            id: 'bldg-st-a',
            companyId: company.id,
            propertyId: sunsetTowers.id,
            name: 'Tower A',
            code: 'ST-A',
            description: 'North wing with 2BHK and 3BHK units, floors 1-8',
            totalFloors: 8,
            totalUnits: 12,
        },
    });
    await prisma.building.upsert({
        where: { companyId_code: { companyId: company.id, code: 'ST-B' } },
        update: {},
        create: {
            id: 'bldg-st-b',
            companyId: company.id,
            propertyId: sunsetTowers.id,
            name: 'Tower B',
            code: 'ST-B',
            description: 'South wing with 1BHK and 2BHK units, floors 1-8',
            totalFloors: 8,
            totalUnits: 12,
        },
    });
    await prisma.building.upsert({
        where: { companyId_code: { companyId: company.id, code: 'OE-1' } },
        update: {},
        create: {
            id: 'bldg-oe-1',
            companyId: company.id,
            propertyId: oakwoodEstates.id,
            name: 'Gulmohar Blocks',
            code: 'OE-1',
            description: 'Main residential block with 2BHK and 3BHK units',
            totalFloors: 3,
            totalUnits: 16,
        },
    });
    await prisma.building.upsert({
        where: { companyId_code: { companyId: company.id, code: 'RP-1' } },
        update: {},
        create: {
            id: 'bldg-rp-1',
            companyId: company.id,
            propertyId: riversidePlaza.id,
            name: 'Ganga Business Tower',
            code: 'RP-1',
            description: 'Mixed residential and commercial suites',
            totalFloors: 10,
            totalUnits: 30,
        },
    });
    console.log('  ✅ 4 demo buildings created');
    const towerA = await prisma.building.findUnique({ where: { id: 'bldg-st-a' } });
    const towerB = await prisma.building.findUnique({ where: { id: 'bldg-st-b' } });
    const tenantsData = [
        { firstName: 'Vikram', lastName: 'Malhotra', email: 'vikram.malhotra@gmail.com', phone: '+91 98200 10001' },
        { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@gmail.com', phone: '+91 98200 10002' },
        { firstName: 'Rajesh', lastName: 'Gupta', email: 'rajesh.gupta@gmail.com', phone: '+91 98200 10003' },
        { firstName: 'Ananya', lastName: 'Rao', email: 'ananya.rao@gmail.com', phone: '+91 98200 10004' },
        { firstName: 'Devendra', lastName: 'Patil', email: 'devendra.patil@gmail.com', phone: '+91 98200 10005' },
        { firstName: 'Sophia', lastName: 'Fernandes', email: 'sophia.fernandes@gmail.com', phone: '+91 98200 10006' },
        { firstName: 'Daniel', lastName: 'DSouza', email: 'daniel.dsouza@gmail.com', phone: '+91 98200 10007' },
        { firstName: 'Olivia', lastName: 'Tandon', email: 'olivia.tandon@gmail.com', phone: '+91 98200 10008' },
    ];
    const tenants = [];
    for (const t of tenantsData) {
        const tenant = await prisma.tenant.upsert({
            where: { companyId_email: { companyId: company.id, email: t.email } },
            update: {},
            create: {
                ...t,
                companyId: company.id,
                status: 'ACTIVE',
                emergencyContact: JSON.stringify({ name: 'Rahul Malhotra', phone: '+91 99999 12345', relation: 'Brother' })
            },
        });
        tenants.push(tenant);
    }
    console.log(`  ✅ ${tenants.length} demo tenants created`);
    const unitsData = [
        { buildingId: towerA.id, name: '101', floor: 1, beds: 2, baths: 2, sqft: 1200, rent: 25000, deposit: 75000, status: 'OCCUPIED', tenantIdx: 0 },
        { buildingId: towerA.id, name: '102', floor: 1, beds: 3, baths: 2, sqft: 1500, rent: 35000, deposit: 100000, status: 'OCCUPIED', tenantIdx: 1 },
        { buildingId: towerA.id, name: '201', floor: 2, beds: 3, baths: 3, sqft: 1800, rent: 45000, deposit: 135000, status: 'OCCUPIED', tenantIdx: 2 },
        { buildingId: towerA.id, name: '202', floor: 2, beds: 2, baths: 2, sqft: 1100, rent: 23000, deposit: 69000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerA.id, name: '301', floor: 3, beds: 2, baths: 2, sqft: 1250, rent: 26000, deposit: 78000, status: 'OCCUPIED', tenantIdx: 3 },
        { buildingId: towerA.id, name: '302', floor: 3, beds: 3, baths: 3, sqft: 1650, rent: 38000, deposit: 114000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerA.id, name: '401', floor: 4, beds: 3, baths: 2, sqft: 1450, rent: 32000, deposit: 96000, status: 'OCCUPIED', tenantIdx: 4 },
        { buildingId: towerA.id, name: '402', floor: 4, beds: 2, baths: 2, sqft: 1100, rent: 23000, deposit: 69000, status: 'MAINTENANCE', tenantIdx: -1 },
        { buildingId: towerA.id, name: '501', floor: 5, beds: 2, baths: 2, sqft: 1200, rent: 25000, deposit: 75000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerA.id, name: '502', floor: 5, beds: 3, baths: 3, sqft: 1750, rent: 40000, deposit: 120000, status: 'OCCUPIED', tenantIdx: 5 },
        { buildingId: towerA.id, name: '601', floor: 6, beds: 3, baths: 2, sqft: 1500, rent: 34000, deposit: 102000, status: 'MAINTENANCE', tenantIdx: -1 },
        { buildingId: towerA.id, name: '602', floor: 6, beds: 2, baths: 2, sqft: 1200, rent: 25000, deposit: 75000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '101', floor: 1, beds: 1, baths: 1, sqft: 650, rent: 15000, deposit: 45000, status: 'OCCUPIED', tenantIdx: 6 },
        { buildingId: towerB.id, name: '102', floor: 1, beds: 2, baths: 1, sqft: 950, rent: 22000, deposit: 66000, status: 'OCCUPIED', tenantIdx: 7 },
        { buildingId: towerB.id, name: '201', floor: 2, beds: 2, baths: 2, sqft: 1050, rent: 24000, deposit: 72000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '202', floor: 2, beds: 1, baths: 1, sqft: 600, rent: 14000, deposit: 42000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '301', floor: 3, beds: 2, baths: 2, sqft: 1100, rent: 25000, deposit: 75000, status: 'OCCUPIED', tenantIdx: 0 },
        { buildingId: towerB.id, name: '302', floor: 3, beds: 1, baths: 1, sqft: 680, rent: 15000, deposit: 45000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '401', floor: 4, beds: 2, baths: 1, sqft: 950, rent: 22000, deposit: 66000, status: 'OCCUPIED', tenantIdx: 1 },
        { buildingId: towerB.id, name: '402', floor: 4, beds: 1, baths: 1, sqft: 700, rent: 16000, deposit: 48000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '501', floor: 5, beds: 2, baths: 2, sqft: 1150, rent: 26000, deposit: 78000, status: 'OCCUPIED', tenantIdx: 2 },
        { buildingId: towerB.id, name: '502', floor: 5, beds: 1, baths: 1, sqft: 650, rent: 15000, deposit: 45000, status: 'VACANT', tenantIdx: -1 },
        { buildingId: towerB.id, name: '601', floor: 6, beds: 2, baths: 2, sqft: 1100, rent: 25000, deposit: 75000, status: 'OCCUPIED', tenantIdx: 3 },
        { buildingId: towerB.id, name: '602', floor: 6, beds: 1, baths: 1, sqft: 700, rent: 16000, deposit: 48000, status: 'VACANT', tenantIdx: -1 },
    ];
    const createdUnits = [];
    for (const u of unitsData) {
        const unit = await prisma.unit.upsert({
            where: { companyId_buildingId_name: { companyId: company.id, buildingId: u.buildingId, name: u.name } },
            update: {},
            create: {
                companyId: company.id, buildingId: u.buildingId, name: u.name, status: u.status,
                floorNumber: u.floor, bedrooms: u.beds, bathrooms: u.baths, squareFootage: u.sqft,
                rentAmount: u.rent, depositAmount: u.deposit,
            },
        });
        createdUnits.push(unit);
    }
    console.log(`  ✅ ${createdUnits.length} demo units created`);
    await prisma.building.update({ where: { id: towerA.id }, data: { totalUnits: 12 } });
    await prisma.building.update({ where: { id: towerB.id }, data: { totalUnits: 12 } });
    await prisma.building.update({ where: { id: 'bldg-oe-1' }, data: { totalUnits: 16 } });
    await prisma.building.update({ where: { id: 'bldg-rp-1' }, data: { totalUnits: 30 } });
    const leasesData = [
        { unitIdx: 0, tenantIdx: 0, rent: 25000, start: '2023-06-01', end: '2024-05-31', deposit: 75000, status: 'ACTIVE' },
        { unitIdx: 1, tenantIdx: 1, rent: 35000, start: '2023-07-01', end: '2024-06-30', deposit: 100000, status: 'ACTIVE' },
        { unitIdx: 2, tenantIdx: 2, rent: 45000, start: '2023-08-01', end: '2024-07-31', deposit: 135000, status: 'ACTIVE' },
        { unitIdx: 4, tenantIdx: 3, rent: 26000, start: '2023-09-01', end: '2024-08-31', deposit: 78000, status: 'ACTIVE' },
        { unitIdx: 6, tenantIdx: 4, rent: 32000, start: '2023-10-01', end: '2024-09-30', deposit: 96000, status: 'ACTIVE' },
        { unitIdx: 9, tenantIdx: 5, rent: 40000, start: '2024-01-01', end: '2024-12-31', deposit: 120000, status: 'ACTIVE' },
        { unitIdx: 12, tenantIdx: 6, rent: 15000, start: '2024-02-01', end: '2025-01-31', deposit: 45000, status: 'ACTIVE' },
        { unitIdx: 13, tenantIdx: 7, rent: 22000, start: '2024-03-01', end: '2025-02-28', deposit: 66000, status: 'ACTIVE' },
    ];
    for (const l of leasesData) {
        const unitId = createdUnits[l.unitIdx].id;
        const tenantId = tenants[l.tenantIdx].id;
        const existingLease = await prisma.lease.findFirst({
            where: { unitId, tenantId, companyId: company.id },
        });
        if (!existingLease) {
            await prisma.lease.create({
                data: {
                    companyId: company.id, unitId, tenantId,
                    startDate: new Date(l.start), endDate: new Date(l.end),
                    rentAmount: l.rent, depositAmount: l.deposit, securityDeposit: l.deposit,
                    status: l.status, paymentDay: 1, lateFeePercent: 5, lateFeeFlat: 500,
                    leaseTerms: JSON.stringify({ pets: false, smoking: false, subleasing: false, renewalOption: true, noticePeriod: 60 }),
                },
            });
        }
    }
    console.log(`  ✅ ${leasesData.length} demo leases created`);
    const allLeases = await prisma.lease.findMany({ where: { companyId: company.id } });
    for (let month = 0; month < 6; month++) {
        const periodStart = new Date(2024, month, 1);
        const periodEnd = new Date(2024, month + 1, 0);
        const dueDate = new Date(2024, month, 5);
        for (const lease of allLeases) {
            const invoiceNumber = `INV-${String(lease.unitId.slice(-4))}-${String(month + 1).padStart(2, '0')}-2024`;
            const existingInvoice = await prisma.invoice.findUnique({ where: { invoiceNumber } });
            if (existingInvoice)
                continue;
            const totalAmount = lease.rentAmount;
            const isPaid = month < 4;
            const paidAt = isPaid ? new Date(2024, month, Math.min(month + 1, 28)) : null;
            const invoice = await prisma.invoice.create({
                data: {
                    companyId: company.id, leaseId: lease.id, unitId: lease.unitId,
                    tenantId: lease.tenantId, invoiceNumber,
                    periodStart, periodEnd, dueDate,
                    rentAmount: lease.rentAmount, lateFee: 0, otherCharges: 0,
                    totalAmount, paidAmount: isPaid ? totalAmount : 0,
                    balanceDue: isPaid ? 0 : totalAmount,
                    status: isPaid ? 'PAID' : 'PENDING', paidAt,
                    category: 'RENT',
                },
            });
            if (isPaid) {
                await prisma.payment.create({
                    data: {
                        companyId: company.id, invoiceId: invoice.id,
                        amount: totalAmount, paymentDate: paidAt,
                        paymentMethod: 'ONLINE', reference: `TXN-${invoiceNumber}`,
                    },
                });
            }
        }
    }
    console.log('  ✅ Demo invoices & payments created');
    const malhotraTenant = await prisma.tenant.findFirst({ where: { email: 'vikram.malhotra@gmail.com', companyId: company.id } });
    if (malhotraTenant) {
        const activeLease = await prisma.lease.findFirst({ where: { tenantId: malhotraTenant.id, companyId: company.id, status: 'ACTIVE' } });
        if (activeLease) {
            const ut1 = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-UTIL-001' } });
            if (!ut1) {
                await prisma.invoice.create({
                    data: {
                        companyId: company.id, leaseId: activeLease.id, unitId: activeLease.unitId,
                        tenantId: malhotraTenant.id, invoiceNumber: 'INV-UTIL-001',
                        periodStart: new Date(2024, 4, 1), periodEnd: new Date(2024, 4, 31),
                        dueDate: new Date(2024, 5, 10), rentAmount: 0, lateFee: 0, otherCharges: 1850,
                        totalAmount: 1850, paidAmount: 1850, balanceDue: 0,
                        status: 'PAID', category: 'UTILITIES', paidAt: new Date(2024, 5, 5),
                        notes: 'Electricity bill for May 2024',
                    }
                });
            }
            const ut2 = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-UTIL-002' } });
            if (!ut2) {
                await prisma.invoice.create({
                    data: {
                        companyId: company.id, leaseId: activeLease.id, unitId: activeLease.unitId,
                        tenantId: malhotraTenant.id, invoiceNumber: 'INV-UTIL-002',
                        periodStart: new Date(2024, 5, 1), periodEnd: new Date(2024, 5, 30),
                        dueDate: new Date(2024, 6, 10), rentAmount: 0, lateFee: 0, otherCharges: 2200,
                        totalAmount: 2200, paidAmount: 0, balanceDue: 2200,
                        status: 'PENDING', category: 'UTILITIES',
                        notes: 'Water and Gas bill for June 2024',
                    }
                });
            }
            const tx1 = await prisma.invoice.findFirst({ where: { invoiceNumber: 'INV-TAX-001' } });
            if (!tx1) {
                await prisma.invoice.create({
                    data: {
                        companyId: company.id, leaseId: activeLease.id, unitId: activeLease.unitId,
                        tenantId: malhotraTenant.id, invoiceNumber: 'INV-TAX-001',
                        periodStart: new Date(2024, 0, 1), periodEnd: new Date(2024, 5, 30),
                        dueDate: new Date(2024, 6, 25), rentAmount: 0, lateFee: 0, otherCharges: 4500,
                        totalAmount: 4500, paidAmount: 0, balanceDue: 4500,
                        status: 'PENDING', category: 'CORPORATION_TAX',
                        notes: 'Half-yearly Corporation Municipal Tax',
                    }
                });
            }
        }
    }
    const expensesData = [
        { propertyId: sunsetTowers.id, category: 'UTILITIES', amount: 32000, date: '2024-01-15', vendor: 'BESCOM' },
        { propertyId: sunsetTowers.id, category: 'MAINTENANCE', amount: 15000, date: '2024-01-20', vendor: 'A1 Maintenance Services' },
        { propertyId: sunsetTowers.id, category: 'CLEANING', amount: 8000, date: '2024-02-01', vendor: 'CleanForce India' },
        { propertyId: oakwoodEstates.id, category: 'LANDSCAPING', amount: 6000, date: '2024-02-05', vendor: 'GreenScape India' },
        { propertyId: oakwoodEstates.id, category: 'INSURANCE', amount: 24000, date: '2024-01-10', vendor: 'LIC India' },
        { propertyId: riversidePlaza.id, category: 'SECURITY', amount: 18000, date: '2024-01-01', vendor: 'SecureGuard India' },
        { propertyId: riversidePlaza.id, category: 'MAINTENANCE', amount: 35000, date: '2024-02-15', vendor: 'Ganga Repairs' },
        { propertyId: sunsetTowers.id, category: 'REPAIRS', amount: 4500, date: '2024-03-10', vendor: 'FixIt Experts' },
    ];
    for (const e of expensesData) {
        const expense = await prisma.expense.findFirst({
            where: { companyId: company.id, propertyId: e.propertyId, amount: e.amount, expenseDate: new Date(e.date) },
        });
        if (!expense) {
            await prisma.expense.create({
                data: {
                    companyId: company.id, propertyId: e.propertyId,
                    category: e.category, amount: e.amount,
                    expenseDate: new Date(e.date), vendor: e.vendor,
                    description: `${e.category} services for ${e.date}`,
                },
            });
        }
    }
    console.log('  ✅ Demo expenses created');
    const maintenanceData = [
        { unitIdx: 7, tenantIdx: null, title: 'Leaking faucet in kitchen', priority: 'MEDIUM', status: 'IN_PROGRESS', category: 'MAINTENANCE' },
        { unitIdx: 10, tenantIdx: null, title: 'AC not cooling properly', priority: 'HIGH', status: 'SUBMITTED', category: 'MAINTENANCE' },
        { unitIdx: 0, tenantIdx: 0, title: 'Smoke detector battery replacement', priority: 'LOW', status: 'COMPLETED', category: 'MAINTENANCE' },
        { unitIdx: 2, tenantIdx: 2, title: 'Broken garbage disposal', priority: 'MEDIUM', status: 'COMPLETED', category: 'MAINTENANCE' },
        { unitIdx: 9, tenantIdx: 5, title: 'Water heater not working', priority: 'URGENT', status: 'IN_PROGRESS', category: 'MAINTENANCE' },
        { unitIdx: 0, tenantIdx: 0, title: 'Utility Bill Query: double charge for electric', priority: 'LOW', status: 'COMPLETED', category: 'QUERY' },
        { unitIdx: 0, tenantIdx: 0, title: 'Question regarding corporation tax calculation', priority: 'MEDIUM', status: 'SUBMITTED', category: 'QUERY' },
    ];
    for (const m of maintenanceData) {
        const unitId = createdUnits[m.unitIdx].id;
        const existing = await prisma.maintenanceRequest.findFirst({
            where: { companyId: company.id, unitId, title: m.title },
        });
        if (!existing) {
            await prisma.maintenanceRequest.create({
                data: {
                    companyId: company.id, unitId,
                    tenantId: m.tenantIdx !== null ? tenants[m.tenantIdx].id : null,
                    title: m.title, description: `Resident reported: ${m.title}`,
                    priority: m.priority, status: m.status,
                    category: m.category,
                    estimatedCost: m.status === 'COMPLETED' ? 1500 : 2000,
                    actualCost: m.status === 'COMPLETED' ? 1450 : undefined,
                    completedDate: m.status === 'COMPLETED' ? new Date() : undefined,
                },
            });
        }
    }
    console.log('  ✅ Demo maintenance requests created');
    const vendorsData = [
        { name: 'Premier Plumbing India', contact: 'Tom George', email: 'tom@premierplumbing.com', phone: '+91 98300 10001', specialty: 'PLUMBING' },
        { name: 'Sparc Electricals', contact: 'Anna Nair', email: 'anna@sparcelectrics.com', phone: '+91 98300 10002', specialty: 'ELECTRICAL' },
        { name: 'Cool Breeze HVAC Services', contact: 'Carlos Fernandes', email: 'carlos@coolbreeze.com', phone: '+91 98300 10003', specialty: 'HVAC' },
        { name: 'GreenScape Landscaping Co.', contact: 'Mike George', email: 'mike@greenscape.com', phone: '+91 98300 10004', specialty: 'LANDSCAPING' },
        { name: 'CleanPro Services India', contact: 'Lisa Nair', email: 'lisa@cleanpro.com', phone: '+91 98300 10005', specialty: 'CLEANING' },
        { name: 'BugBusters Pest Control', contact: 'Sam George', email: 'sam@bugbusters.com', phone: '+91 98300 10006', specialty: 'PEST_CONTROL' },
        { name: 'Apex General Contractors', contact: 'John George', email: 'john@apexgc.com', phone: '+91 98300 10007', specialty: 'GENERAL' },
    ];
    for (const v of vendorsData) {
        const existing = await prisma.vendor.findUnique({
            where: { companyId_name: { companyId: company.id, name: v.name } },
        });
        if (!existing) {
            await prisma.vendor.create({
                data: { companyId: company.id, name: v.name, contactPerson: v.contact, email: v.email, phone: v.phone, specialty: v.specialty, isApproved: true },
            });
        }
    }
    console.log('  ✅ Demo vendors created');
    const tenantUser = await prisma.user.upsert({
        where: { email: 'tenant@acmeproperties.com' },
        update: {},
        create: {
            email: 'tenant@acmeproperties.com',
            passwordHash,
            firstName: 'Vikram',
            lastName: 'Malhotra',
            phone: '+91 98200 10001',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    const tenantRole = await prisma.role.findUnique({ where: { type: 'TENANT' } });
    const ownerRole = await prisma.role.findUnique({ where: { type: 'OWNER' } });
    if (tenantRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: tenantUser.id, roleId: tenantRole.id, companyId: company.id } },
            update: {},
            create: { userId: tenantUser.id, roleId: tenantRole.id, companyId: company.id },
        });
    }
    await prisma.tenant.update({
        where: { companyId_email: { companyId: company.id, email: 'vikram.malhotra@gmail.com' } },
        data: { userId: tenantUser.id },
    });
    console.log('  ✅ Tenant user account created (tenant@acmeproperties.com / password123)');
    const ownerUser1 = await prisma.user.upsert({
        where: { email: 'owner1@acmeproperties.com' },
        update: {},
        create: {
            email: 'owner1@acmeproperties.com',
            passwordHash,
            firstName: 'Rakesh',
            lastName: 'Chandra',
            phone: '+91 98400 10001',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    const ownerUser2 = await prisma.user.upsert({
        where: { email: 'owner2@acmeproperties.com' },
        update: {},
        create: {
            email: 'owner2@acmeproperties.com',
            passwordHash,
            firstName: 'Pooja',
            lastName: 'Mehta',
            phone: '+91 98400 10002',
            status: 'ACTIVE',
            companyId: company.id,
        },
    });
    if (ownerRole) {
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: ownerUser1.id, roleId: ownerRole.id, companyId: company.id } },
            update: {},
            create: { userId: ownerUser1.id, roleId: ownerRole.id, companyId: company.id },
        });
        await prisma.userRole.upsert({
            where: { userId_roleId_companyId: { userId: ownerUser2.id, roleId: ownerRole.id, companyId: company.id } },
            update: {},
            create: { userId: ownerUser2.id, roleId: ownerRole.id, companyId: company.id },
        });
    }
    const ownersData = [
        { firstName: 'Rakesh', lastName: 'Chandra', email: 'rakesh.chandra@gmail.com', phone: '+91 98400 10001', status: 'ACTIVE', userId: ownerUser1.id },
        { firstName: 'Pooja', lastName: 'Mehta', email: 'pooja.mehta@gmail.com', phone: '+91 98400 10002', status: 'ACTIVE', userId: ownerUser2.id },
    ];
    const createdOwners = [];
    for (const o of ownersData) {
        const { userId, ...ownerData } = o;
        const owner = await prisma.owner.upsert({
            where: { companyId_email: { companyId: company.id, email: o.email } },
            update: { userId },
            create: { companyId: company.id, userId, ...ownerData },
        });
        createdOwners.push(owner);
    }
    console.log('  ✅ Demo owners created (owner1@acmeproperties.com / password123)');
    if (createdOwners.length >= 2) {
        await prisma.property.update({
            where: { id: sunsetTowers.id },
            data: { ownerId: createdOwners[0].id, managerId: managerUser.id },
        });
        await prisma.property.update({
            where: { id: oakwoodEstates.id },
            data: { ownerId: createdOwners[0].id, managerId: null },
        });
        await prisma.property.update({
            where: { id: riversidePlaza.id },
            data: { ownerId: createdOwners[1].id, managerId: managerUser.id },
        });
        console.log('  ✅ Owners and managers linked to their properties');
    }
    console.log('\n✅ Seeding complete!');
    console.log('📧 Login credentials:');
    console.log('   admin@acmeproperties.com / password123 (Admin)');
    console.log('   manager@acmeproperties.com / password123 (Manager)');
    console.log('   accountant@acmeproperties.com / password123 (Accountant)');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map