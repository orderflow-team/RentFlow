export declare class CreateBuildingDto {
    name: string;
    code?: string;
    description?: string;
    totalFloors?: number;
    totalUnits?: number;
    yearBuilt?: number;
    amenities?: Record<string, any>;
    metadata?: Record<string, any>;
}
