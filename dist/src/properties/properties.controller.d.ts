import { PropertiesService } from './properties.service';
import { PassportService } from './passport/passport.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class PropertiesController {
    private readonly propertiesService;
    private readonly passportService;
    constructor(propertiesService: PropertiesService, passportService: PassportService);
    create(user: JwtPayload, dto: CreatePropertyDto): Promise<{
        id: any;
        name: any;
        type: any;
        status: any;
        description: any;
        notes: any;
        address: any;
        city: any;
        state: any;
        zipCode: any;
        country: any;
        totalUnits: any;
        yearBuilt: any;
        latitude: any;
        longitude: any;
        amenities: any;
        images: any;
        metadata: any;
        ownerId: any;
        managerId: any;
        createdBy: {
            id: any;
            name: string;
        } | null;
        updatedBy: {
            id: any;
            name: string;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(user: JwtPayload, status?: string, type?: string, search?: string, page?: number, limit?: number): Promise<{
        data: {
            buildingCount: number;
            id: any;
            name: any;
            type: any;
            status: any;
            description: any;
            notes: any;
            address: any;
            city: any;
            state: any;
            zipCode: any;
            country: any;
            totalUnits: any;
            yearBuilt: any;
            latitude: any;
            longitude: any;
            amenities: any;
            images: any;
            metadata: any;
            ownerId: any;
            managerId: any;
            createdBy: {
                id: any;
                name: string;
            } | null;
            updatedBy: {
                id: any;
                name: string;
            } | null;
            createdAt: any;
            updatedAt: any;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(user: JwtPayload, id: string): Promise<{
        buildingCount: number;
        manager: {
            id: string;
            phone: string | null;
            firstName: string;
            lastName: string;
        } | null;
        id: any;
        name: any;
        type: any;
        status: any;
        description: any;
        notes: any;
        address: any;
        city: any;
        state: any;
        zipCode: any;
        country: any;
        totalUnits: any;
        yearBuilt: any;
        latitude: any;
        longitude: any;
        amenities: any;
        images: any;
        metadata: any;
        ownerId: any;
        managerId: any;
        createdBy: {
            id: any;
            name: string;
        } | null;
        updatedBy: {
            id: any;
            name: string;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    getPassport(user: JwtPayload, id: string): Promise<{
        property: {
            id: string;
            name: string;
            address: string;
            totalUnits: number;
        };
        history: {
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            description: string;
            propertyId: string;
            eventType: string;
            eventDate: Date;
        }[];
    }>;
    update(user: JwtPayload, id: string, dto: UpdatePropertyDto): Promise<{
        id: any;
        name: any;
        type: any;
        status: any;
        description: any;
        notes: any;
        address: any;
        city: any;
        state: any;
        zipCode: any;
        country: any;
        totalUnits: any;
        yearBuilt: any;
        latitude: any;
        longitude: any;
        amenities: any;
        images: any;
        metadata: any;
        ownerId: any;
        managerId: any;
        createdBy: {
            id: any;
            name: string;
        } | null;
        updatedBy: {
            id: any;
            name: string;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        message: string;
    }>;
    assignManager(user: JwtPayload, id: string, dto: AssignManagerDto): Promise<{
        manager: {
            id: any;
            firstName: any;
            lastName: any;
            phone: any;
        };
        id: any;
        name: any;
        type: any;
        status: any;
        description: any;
        notes: any;
        address: any;
        city: any;
        state: any;
        zipCode: any;
        country: any;
        totalUnits: any;
        yearBuilt: any;
        latitude: any;
        longitude: any;
        amenities: any;
        images: any;
        metadata: any;
        ownerId: any;
        managerId: any;
        createdBy: {
            id: any;
            name: string;
        } | null;
        updatedBy: {
            id: any;
            name: string;
        } | null;
        createdAt: any;
        updatedAt: any;
    }>;
    createBuilding(user: JwtPayload, propertyId: string, dto: CreateBuildingDto): Promise<{
        id: any;
        propertyId: any;
        name: any;
        code: any;
        description: any;
        totalFloors: any;
        totalUnits: any;
        yearBuilt: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAllBuildings(user: JwtPayload, propertyId: string): Promise<{
        unitCount: number;
        id: any;
        propertyId: any;
        name: any;
        code: any;
        description: any;
        totalFloors: any;
        totalUnits: any;
        yearBuilt: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    findOneBuilding(user: JwtPayload, buildingId: string): Promise<{
        unitCount: number;
        id: any;
        propertyId: any;
        name: any;
        code: any;
        description: any;
        totalFloors: any;
        totalUnits: any;
        yearBuilt: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateBuilding(user: JwtPayload, buildingId: string, dto: UpdateBuildingDto): Promise<{
        id: any;
        propertyId: any;
        name: any;
        code: any;
        description: any;
        totalFloors: any;
        totalUnits: any;
        yearBuilt: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    removeBuilding(user: JwtPayload, buildingId: string): Promise<{
        message: string;
    }>;
    createUnit(user: JwtPayload, buildingId: string, dto: CreateUnitDto): Promise<{
        id: any;
        buildingId: any;
        name: any;
        description: any;
        status: any;
        floorNumber: any;
        bedrooms: any;
        bathrooms: any;
        squareFootage: any;
        rentAmount: any;
        depositAmount: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAllUnits(user: JwtPayload, buildingId: string, status?: string): Promise<{
        id: any;
        buildingId: any;
        name: any;
        description: any;
        status: any;
        floorNumber: any;
        bedrooms: any;
        bathrooms: any;
        squareFootage: any;
        rentAmount: any;
        depositAmount: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    findOneUnit(user: JwtPayload, unitId: string): Promise<{
        building: {
            id: string;
            name: string;
            propertyId: string;
        };
        id: any;
        buildingId: any;
        name: any;
        description: any;
        status: any;
        floorNumber: any;
        bedrooms: any;
        bathrooms: any;
        squareFootage: any;
        rentAmount: any;
        depositAmount: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateUnit(user: JwtPayload, unitId: string, dto: UpdateUnitDto): Promise<{
        id: any;
        buildingId: any;
        name: any;
        description: any;
        status: any;
        floorNumber: any;
        bedrooms: any;
        bathrooms: any;
        squareFootage: any;
        rentAmount: any;
        depositAmount: any;
        amenities: any;
        metadata: any;
        createdAt: any;
        updatedAt: any;
    }>;
    removeUnit(user: JwtPayload, unitId: string): Promise<{
        message: string;
    }>;
}
