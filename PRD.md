# RentFlow — Product Requirements Document (Updated)

> Status: Draft, updated with new user requirements (2026-07-06). This PRD integrates the existing system capabilities with the newly requested modules, highlighting implementation gaps and scope.

---

## 1. Product Summary

RentFlow is a multi-tenant SaaS property management platform. It enables:
- **Property Owners and Managers** to manage Properties → Buildings → Units, track occupancy, list upcoming vacancies, lease tenants, invoice/collect rent, and maintain a permanent "Property Passport" history.
- **Tenants** to search properties, join waiting lists ("Available Soon"), manage documents, track responsibilities, build a rental résumé, and maintain a reputation via a blind rating/trust score system.
- **Future Society Administrators** to manage NOCs, society approvals, maintenance records, and community information (planned future module).

---

## 2. Target Users / Roles

| Role | Level | Intended Use / Capabilities |
|---|---|---|
| **ADMIN** (Staff) | 100 | Company owner/super-admin — full system access. |
| **MANAGER** (Staff) | 80 | Day-to-day property/lease/maintenance operations. Manage multiple properties and tenants, monitor occupancy, and track property performance. |
| **ACCOUNTANT** (Staff) | 60 | Financial data: invoices, payments, expenses, reports. |
| **OWNER** | 40 | Property Owner: Manage owned properties/tenants, track occupancy/responsibilities, maintain property history, review tenant applications (interest queue), rate tenants. |
| **TENANT** | 20 | Renter: Search properties, maintain rental history, build reputation, manage documents, track responsibilities, apply for properties. |
| **SOCIETY_ADMIN** | 30 | Future Society Administrator: Manage NOCs, society approvals, maintenance records, and community info. |

---

## 3. Major Modules & Features

### 3.1. Property Management
- **Add Property / Details**: Create properties with details, photos, documents, and notes.
- **Property Status**:
  - `Occupied`
  - `Vacant`
  - `Available Soon` (New: requires expected availability date and waiting list)
  - `Under Maintenance`

### 3.2. Property Passport
- A permanent history attached to the property forever.
- Tracks:
  - Ownership history
  - Tenant history
  - Repair history
  - Maintenance records
  - Agreement records
  - Move-in and Move-out records

### 3.3. Rental Lifecycle Management
- **Move-In Checklist**:
  - [ ] Agreement signed
  - [ ] Deposit received
  - [ ] KYC completed
  - [ ] Property photos uploaded
  - [ ] Key handover completed
- **During Stay**:
  - Responsibilities tracking
  - Reminders
  - Communication records
- **Move-Out Checklist**:
  - [ ] Property inspection
  - [ ] Key return
  - [ ] Deposit settlement
  - [ ] Exit documentation

### 3.4. Responsibilities System
Tracks responsibilities instead of direct billing integrations.
- **Owner Responsibilities**: Maintenance, property tax, major repairs.
- **Tenant Responsibilities**: Rent, utility payments, minor upkeep.
- **Each Responsibility contains**: Due date, status (`Pending`, `Completed`, `Overdue`), reminder trigger, and completion tracking.

### 3.5. Rental Discovery
- **Property Search Filters**: Location, budget, property type, furnished status, occupancy type.
- **Owner Preferences**: Family, married couple, live-in couple, students, working professionals, pet friendly, vegetarian preference, smoking preference.

### 3.6. Available Soon Marketplace
- For occupied properties, owners can make future availability visible (e.g. "Expected Availability: September 2027").
- Potential tenants can join a waiting list before the vacancy occurs.

### 3.7. Interest Queue
- Potential tenants express interest in vacant or "Available Soon" units.
- Owners review applicants' profiles, trust scores, rental history, and compatibility scores (no bidding/auction system).

### 3.8. Rental History
- Every completed stay becomes part of a tenant's permanent rental résumé, showing the property, duration, and ratings.

### 3.9. Reputation & Trust Score System
- **Rating Categories**:
  - **Tenant**: Rent discipline, property care, communication, society conduct, move-out experience.
  - **Owner**: Communication, maintenance support, deposit fairness, transparency.
  - **Property**: Condition, water availability, noise levels, parking, internet quality.
  - **Community**: Safety, family friendliness, pet friendliness, festival culture, neighbourhood support, peacefulness.
- **Rating Eligibility**: Only allowed if a verified lease agreement exists AND the stay is completed.
- **Blind Rating System**: Both owner and tenant submit ratings without seeing the other's feedback. Ratings are revealed only when both submit OR the rating window expires (prevents retaliation).
- **Trust Score System**: Aggregated from completed stays, verified agreements, reputation ratings, account verification, and rental history quality.
  - **Public Display**: Trust Score, Verified Stays count, and Average Rating.
- **Privacy Model**: Users choose Public vs. Private reputation. If set to private, others cannot view their reputation, and they cannot view the detailed reputation of others.

---

## 4. Current Implementation Gaps

Comparing the requested feature set to the existing codebase reveals the following gaps:

1. **Schema Enhancements**: The current database schema is missing tables for `PropertyPassport`, `PropertyApplication`/`InterestQueue`, `Responsibility`, `Rating`, `TrustScore`, and columns for owner preferences / availability dates.
2. **Tenant/Owner Portals**: Existing controllers are primarily staff-facing. Portals matching the specific permissions of tenants and owners need dedicated endpoints.
3. **Checklists & Lifecycle**: No current tracking of move-in/move-out checklists or during-stay communication logs.
4. **Blind Rating Logic**: Needs a background worker or release trigger to automatically publish ratings when the window expires or both submit.
5. **Compatibility & Trust Score Calculation**: Logic to compute trust scores and match tenant profiles with owner preferences (compatibility score) needs to be created.
