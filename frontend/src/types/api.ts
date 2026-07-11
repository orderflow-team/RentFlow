export interface Company {
  id: string;
  name: string;
  slug: string;
  status?: string;
}

export interface RoleRef {
  id: string;
  type: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AuthResponse {
  company: Company;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  status: string;
  isOwner: boolean;
  lastLoginAt: string | null;
  company: Company;
  roles: RoleRef[];
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface MoveInPhoto {
  url: string;
  uploadedAt: string;
}

export interface LeaseLifecycle {
  moveInAgreementSigned: boolean;
  moveInDepositReceived: boolean;
  moveInKycCompleted: boolean;
  moveInPhotosUploaded: boolean;
  moveInKeyHandover: boolean;
  moveInKeyHandoverAt?: string | null;
  moveInPhotos?: MoveInPhoto[] | null;
  moveOutInspection: boolean;
  moveOutKeyReturn: boolean;
  moveOutDepositSettlement: boolean;
  moveOutExitDoc: boolean;
}

export interface Lease {
  id: string;
  unitId: string;
  unit?: { id: string; name: string; building?: { name: string; property?: { name: string; address: string } } };
  tenantId: string;
  tenant?: { id: string; firstName: string; lastName: string };
  startDate: string;
  endDate: string | null;
  rentAmount: number;
  depositAmount: number;
  securityDeposit: number;
  status: string;
  leaseLifecycle?: LeaseLifecycle | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  category: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue?: number;
  status: string;
  dueDate: string;
  periodStart?: string;
  periodEnd?: string;
  tenant?: string;
  unit?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string | null;
  expenseDate?: string | null;
  vendor?: string | null;
  notes?: string | null;
  property?: { name: string } | null;
  createdAt?: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  tenant?: { firstName: string; lastName: string };
  unit?: { name: string };
  vendor?: { id: string; name: string } | null;
  assignedTo?: string | null;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  isApproved?: boolean;
  notes?: string | null;
}

export interface TenantRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  status: string;
  documents?: TenantDocument[] | null;
  createdAt: string;
}

export interface StaffLease {
  id: string;
  rentAmount: number;
  depositAmount: number;
  startDate: string;
  endDate: string | null;
  status: string;
  paymentDay?: number;
  tenant?: { id: string; firstName: string; lastName: string };
  unit?: { id: string; name: string; building?: { name: string } };
}

export interface Building {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  totalFloors?: number | null;
  totalUnits?: number;
  unitCount?: number;
  yearBuilt?: number | null;
}

export interface Unit {
  id: string;
  buildingId: string;
  name: string;
  description?: string | null;
  status: string;
  floorNumber?: number | null;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number | null;
  listingType: string;
  rentAmount?: number | null;
  depositAmount?: number | null;
  salePrice?: number | null;
  images?: PropertyImage[] | null;
}

export interface OwnerFinancials {
  finances: {
    netIncome?: number;
    totalCollected?: number;
    totalExpenses?: number;
    totalOutstanding?: number;
    totalRent?: number;
  };
  properties: string[];
  totalProperties: number;
  units: { occupied?: number; total?: number; vacant?: number };
}

export interface OwnerProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  status: string;
  images?: PropertyImage[] | null;
  buildings?: {
    id: string;
    name: string;
    units?: { id: string; name: string; rentAmount?: number | null; status: string }[];
  }[];
}

export interface TenantDocument {
  id: string;
  title: string;
  category: string;
  url: string | null;
  uploadedAt: string;
}

export interface PropertyImage {
  url: string;
  caption?: string;
}

export interface DiscoveryProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  status: string;
  images?: PropertyImage[];
  expectedAvailability?: string | null;
  furnishedStatus?: string | null;
  occupancyType?: string | null;
  rentRange?: { min: number; max: number } | null;
  saleRange?: { min: number; max: number } | null;
  manager?: { name: string; phone: string | null; email?: string | null } | null;
  preferences?: Record<string, boolean | null>;
  unitsCount: number;
}

export interface DiscoveryUnit {
  id: string;
  name: string;
  building: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number | null;
  listingType: string;
  rentAmount?: number | null;
  salePrice?: number | null;
  status: string;
  description?: string | null;
  images?: PropertyImage[];
}

export interface DiscoveryPropertyDetail extends Omit<DiscoveryProperty, 'unitsCount'> {
  description?: string | null;
  yearBuilt?: number | null;
  amenities?: Record<string, unknown> | null;
  totalUnits: number;
  availableUnitsCount: number;
  availableUnits: DiscoveryUnit[];
}

export interface Property {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalUnits: number;
  buildingCount?: number;
  images?: PropertyImage[] | null;
  ownerId?: string | null;
  managerId?: string | null;
  manager?: { id: string; firstName: string; lastName: string; phone: string | null } | null;
  createdAt: string;
}

export interface DashboardSummary {
  occupancy: {
    totalUnits?: number;
    occupiedUnits?: number;
    vacantUnits?: number;
    maintenanceUnits?: number;
    occupancyRate?: number;
    [key: string]: unknown;
  };
  financial: {
    totalCollected?: number;
    [key: string]: unknown;
  };
  maintenance: Record<string, unknown>;
}
