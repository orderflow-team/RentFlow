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

export interface LeaseLifecycle {
  moveInAgreementSigned: boolean;
  moveInDepositReceived: boolean;
  moveInKycCompleted: boolean;
  moveInPhotosUploaded: boolean;
  moveInKeyHandover: boolean;
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
  status: string;
  dueDate: string;
  tenant?: string;
  unit?: string;
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
}

export interface TenantDocument {
  id: string;
  title: string;
  category: string;
  url: string | null;
  uploadedAt: string;
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
