import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CompanyModel = runtime.Types.Result.DefaultSelection<Prisma.$CompanyPayload>;
export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null;
    _min: CompanyMinAggregateOutputType | null;
    _max: CompanyMaxAggregateOutputType | null;
};
export type CompanyMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
    status: $Enums.CompanyStatus | null;
    timezone: string | null;
    locale: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type CompanyMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
    status: $Enums.CompanyStatus | null;
    timezone: string | null;
    locale: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type CompanyCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    email: number;
    phone: number;
    address: number;
    logo: number;
    status: number;
    timezone: number;
    locale: number;
    metadata: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type CompanyMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    email?: true;
    phone?: true;
    address?: true;
    logo?: true;
    status?: true;
    timezone?: true;
    locale?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type CompanyMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    email?: true;
    phone?: true;
    address?: true;
    logo?: true;
    status?: true;
    timezone?: true;
    locale?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type CompanyCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    email?: true;
    phone?: true;
    address?: true;
    logo?: true;
    status?: true;
    timezone?: true;
    locale?: true;
    metadata?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type CompanyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[];
    cursor?: Prisma.CompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CompanyCountAggregateInputType;
    _min?: CompanyMinAggregateInputType;
    _max?: CompanyMaxAggregateInputType;
};
export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
    [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCompany[P]> : Prisma.GetScalarType<T[P], AggregateCompany[P]>;
};
export type CompanyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithAggregationInput | Prisma.CompanyOrderByWithAggregationInput[];
    by: Prisma.CompanyScalarFieldEnum[] | Prisma.CompanyScalarFieldEnum;
    having?: Prisma.CompanyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CompanyCountAggregateInputType | true;
    _min?: CompanyMinAggregateInputType;
    _max?: CompanyMaxAggregateInputType;
};
export type CompanyGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
    status: $Enums.CompanyStatus;
    timezone: string;
    locale: string;
    metadata: runtime.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: CompanyCountAggregateOutputType | null;
    _min: CompanyMinAggregateOutputType | null;
    _max: CompanyMaxAggregateOutputType | null;
};
export type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CompanyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CompanyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CompanyGroupByOutputType[P]>;
}>>;
export type CompanyWhereInput = {
    AND?: Prisma.CompanyWhereInput | Prisma.CompanyWhereInput[];
    OR?: Prisma.CompanyWhereInput[];
    NOT?: Prisma.CompanyWhereInput | Prisma.CompanyWhereInput[];
    id?: Prisma.StringFilter<"Company"> | string;
    name?: Prisma.StringFilter<"Company"> | string;
    slug?: Prisma.StringFilter<"Company"> | string;
    email?: Prisma.StringNullableFilter<"Company"> | string | null;
    phone?: Prisma.StringNullableFilter<"Company"> | string | null;
    address?: Prisma.StringNullableFilter<"Company"> | string | null;
    logo?: Prisma.StringNullableFilter<"Company"> | string | null;
    status?: Prisma.EnumCompanyStatusFilter<"Company"> | $Enums.CompanyStatus;
    timezone?: Prisma.StringFilter<"Company"> | string;
    locale?: Prisma.StringFilter<"Company"> | string;
    metadata?: Prisma.JsonNullableFilter<"Company">;
    createdAt?: Prisma.DateTimeFilter<"Company"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Company"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Company"> | Date | string | null;
    users?: Prisma.UserListRelationFilter;
    tenants?: Prisma.TenantListRelationFilter;
    owners?: Prisma.OwnerListRelationFilter;
    properties?: Prisma.PropertyListRelationFilter;
};
export type CompanyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    logo?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    tenants?: Prisma.TenantOrderByRelationAggregateInput;
    owners?: Prisma.OwnerOrderByRelationAggregateInput;
    properties?: Prisma.PropertyOrderByRelationAggregateInput;
};
export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.CompanyWhereInput | Prisma.CompanyWhereInput[];
    OR?: Prisma.CompanyWhereInput[];
    NOT?: Prisma.CompanyWhereInput | Prisma.CompanyWhereInput[];
    name?: Prisma.StringFilter<"Company"> | string;
    email?: Prisma.StringNullableFilter<"Company"> | string | null;
    phone?: Prisma.StringNullableFilter<"Company"> | string | null;
    address?: Prisma.StringNullableFilter<"Company"> | string | null;
    logo?: Prisma.StringNullableFilter<"Company"> | string | null;
    status?: Prisma.EnumCompanyStatusFilter<"Company"> | $Enums.CompanyStatus;
    timezone?: Prisma.StringFilter<"Company"> | string;
    locale?: Prisma.StringFilter<"Company"> | string;
    metadata?: Prisma.JsonNullableFilter<"Company">;
    createdAt?: Prisma.DateTimeFilter<"Company"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Company"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Company"> | Date | string | null;
    users?: Prisma.UserListRelationFilter;
    tenants?: Prisma.TenantListRelationFilter;
    owners?: Prisma.OwnerListRelationFilter;
    properties?: Prisma.PropertyListRelationFilter;
}, "id" | "slug">;
export type CompanyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    logo?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    metadata?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.CompanyCountOrderByAggregateInput;
    _max?: Prisma.CompanyMaxOrderByAggregateInput;
    _min?: Prisma.CompanyMinOrderByAggregateInput;
};
export type CompanyScalarWhereWithAggregatesInput = {
    AND?: Prisma.CompanyScalarWhereWithAggregatesInput | Prisma.CompanyScalarWhereWithAggregatesInput[];
    OR?: Prisma.CompanyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CompanyScalarWhereWithAggregatesInput | Prisma.CompanyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Company"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Company"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Company"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"Company"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Company"> | string | null;
    address?: Prisma.StringNullableWithAggregatesFilter<"Company"> | string | null;
    logo?: Prisma.StringNullableWithAggregatesFilter<"Company"> | string | null;
    status?: Prisma.EnumCompanyStatusWithAggregatesFilter<"Company"> | $Enums.CompanyStatus;
    timezone?: Prisma.StringWithAggregatesFilter<"Company"> | string;
    locale?: Prisma.StringWithAggregatesFilter<"Company"> | string;
    metadata?: Prisma.JsonNullableWithAggregatesFilter<"Company">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Company"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Company"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Company"> | Date | string | null;
};
export type CompanyCreateInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyCreateNestedManyWithoutCompanyInput;
};
export type CompanyUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantUncheckedCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerUncheckedCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyUncheckedCreateNestedManyWithoutCompanyInput;
};
export type CompanyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUpdateManyWithoutCompanyNestedInput;
};
export type CompanyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUncheckedUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUncheckedUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUncheckedUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUncheckedUpdateManyWithoutCompanyNestedInput;
};
export type CompanyCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type CompanyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CompanyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type CompanyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    metadata?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CompanyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CompanyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    logo?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    timezone?: Prisma.SortOrder;
    locale?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type CompanyScalarRelationFilter = {
    is?: Prisma.CompanyWhereInput;
    isNot?: Prisma.CompanyWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumCompanyStatusFieldUpdateOperationsInput = {
    set?: $Enums.CompanyStatus;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type CompanyCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutUsersInput, Prisma.CompanyUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutUsersInput;
    connect?: Prisma.CompanyWhereUniqueInput;
};
export type CompanyUpdateOneRequiredWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutUsersInput, Prisma.CompanyUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.CompanyUpsertWithoutUsersInput;
    connect?: Prisma.CompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CompanyUpdateToOneWithWhereWithoutUsersInput, Prisma.CompanyUpdateWithoutUsersInput>, Prisma.CompanyUncheckedUpdateWithoutUsersInput>;
};
export type CompanyCreateNestedOneWithoutTenantsInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutTenantsInput, Prisma.CompanyUncheckedCreateWithoutTenantsInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutTenantsInput;
    connect?: Prisma.CompanyWhereUniqueInput;
};
export type CompanyUpdateOneRequiredWithoutTenantsNestedInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutTenantsInput, Prisma.CompanyUncheckedCreateWithoutTenantsInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutTenantsInput;
    upsert?: Prisma.CompanyUpsertWithoutTenantsInput;
    connect?: Prisma.CompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CompanyUpdateToOneWithWhereWithoutTenantsInput, Prisma.CompanyUpdateWithoutTenantsInput>, Prisma.CompanyUncheckedUpdateWithoutTenantsInput>;
};
export type CompanyCreateNestedOneWithoutOwnersInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutOwnersInput, Prisma.CompanyUncheckedCreateWithoutOwnersInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutOwnersInput;
    connect?: Prisma.CompanyWhereUniqueInput;
};
export type CompanyUpdateOneRequiredWithoutOwnersNestedInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutOwnersInput, Prisma.CompanyUncheckedCreateWithoutOwnersInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutOwnersInput;
    upsert?: Prisma.CompanyUpsertWithoutOwnersInput;
    connect?: Prisma.CompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CompanyUpdateToOneWithWhereWithoutOwnersInput, Prisma.CompanyUpdateWithoutOwnersInput>, Prisma.CompanyUncheckedUpdateWithoutOwnersInput>;
};
export type CompanyCreateNestedOneWithoutPropertiesInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutPropertiesInput, Prisma.CompanyUncheckedCreateWithoutPropertiesInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutPropertiesInput;
    connect?: Prisma.CompanyWhereUniqueInput;
};
export type CompanyUpdateOneRequiredWithoutPropertiesNestedInput = {
    create?: Prisma.XOR<Prisma.CompanyCreateWithoutPropertiesInput, Prisma.CompanyUncheckedCreateWithoutPropertiesInput>;
    connectOrCreate?: Prisma.CompanyCreateOrConnectWithoutPropertiesInput;
    upsert?: Prisma.CompanyUpsertWithoutPropertiesInput;
    connect?: Prisma.CompanyWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CompanyUpdateToOneWithWhereWithoutPropertiesInput, Prisma.CompanyUpdateWithoutPropertiesInput>, Prisma.CompanyUncheckedUpdateWithoutPropertiesInput>;
};
export type CompanyCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tenants?: Prisma.TenantCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyCreateNestedManyWithoutCompanyInput;
};
export type CompanyUncheckedCreateWithoutUsersInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    tenants?: Prisma.TenantUncheckedCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerUncheckedCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyUncheckedCreateNestedManyWithoutCompanyInput;
};
export type CompanyCreateOrConnectWithoutUsersInput = {
    where: Prisma.CompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutUsersInput, Prisma.CompanyUncheckedCreateWithoutUsersInput>;
};
export type CompanyUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.CompanyUpdateWithoutUsersInput, Prisma.CompanyUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutUsersInput, Prisma.CompanyUncheckedCreateWithoutUsersInput>;
    where?: Prisma.CompanyWhereInput;
};
export type CompanyUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.CompanyWhereInput;
    data: Prisma.XOR<Prisma.CompanyUpdateWithoutUsersInput, Prisma.CompanyUncheckedUpdateWithoutUsersInput>;
};
export type CompanyUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tenants?: Prisma.TenantUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUpdateManyWithoutCompanyNestedInput;
};
export type CompanyUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    tenants?: Prisma.TenantUncheckedUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUncheckedUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUncheckedUpdateManyWithoutCompanyNestedInput;
};
export type CompanyCreateWithoutTenantsInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyCreateNestedManyWithoutCompanyInput;
};
export type CompanyUncheckedCreateWithoutTenantsInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerUncheckedCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyUncheckedCreateNestedManyWithoutCompanyInput;
};
export type CompanyCreateOrConnectWithoutTenantsInput = {
    where: Prisma.CompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutTenantsInput, Prisma.CompanyUncheckedCreateWithoutTenantsInput>;
};
export type CompanyUpsertWithoutTenantsInput = {
    update: Prisma.XOR<Prisma.CompanyUpdateWithoutTenantsInput, Prisma.CompanyUncheckedUpdateWithoutTenantsInput>;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutTenantsInput, Prisma.CompanyUncheckedCreateWithoutTenantsInput>;
    where?: Prisma.CompanyWhereInput;
};
export type CompanyUpdateToOneWithWhereWithoutTenantsInput = {
    where?: Prisma.CompanyWhereInput;
    data: Prisma.XOR<Prisma.CompanyUpdateWithoutTenantsInput, Prisma.CompanyUncheckedUpdateWithoutTenantsInput>;
};
export type CompanyUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUpdateManyWithoutCompanyNestedInput;
};
export type CompanyUncheckedUpdateWithoutTenantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUncheckedUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUncheckedUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUncheckedUpdateManyWithoutCompanyNestedInput;
};
export type CompanyCreateWithoutOwnersInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyCreateNestedManyWithoutCompanyInput;
};
export type CompanyUncheckedCreateWithoutOwnersInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantUncheckedCreateNestedManyWithoutCompanyInput;
    properties?: Prisma.PropertyUncheckedCreateNestedManyWithoutCompanyInput;
};
export type CompanyCreateOrConnectWithoutOwnersInput = {
    where: Prisma.CompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutOwnersInput, Prisma.CompanyUncheckedCreateWithoutOwnersInput>;
};
export type CompanyUpsertWithoutOwnersInput = {
    update: Prisma.XOR<Prisma.CompanyUpdateWithoutOwnersInput, Prisma.CompanyUncheckedUpdateWithoutOwnersInput>;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutOwnersInput, Prisma.CompanyUncheckedCreateWithoutOwnersInput>;
    where?: Prisma.CompanyWhereInput;
};
export type CompanyUpdateToOneWithWhereWithoutOwnersInput = {
    where?: Prisma.CompanyWhereInput;
    data: Prisma.XOR<Prisma.CompanyUpdateWithoutOwnersInput, Prisma.CompanyUncheckedUpdateWithoutOwnersInput>;
};
export type CompanyUpdateWithoutOwnersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUpdateManyWithoutCompanyNestedInput;
};
export type CompanyUncheckedUpdateWithoutOwnersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUncheckedUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUncheckedUpdateManyWithoutCompanyNestedInput;
    properties?: Prisma.PropertyUncheckedUpdateManyWithoutCompanyNestedInput;
};
export type CompanyCreateWithoutPropertiesInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerCreateNestedManyWithoutCompanyInput;
};
export type CompanyUncheckedCreateWithoutPropertiesInput = {
    id?: string;
    name: string;
    slug: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    logo?: string | null;
    status?: $Enums.CompanyStatus;
    timezone?: string;
    locale?: string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutCompanyInput;
    tenants?: Prisma.TenantUncheckedCreateNestedManyWithoutCompanyInput;
    owners?: Prisma.OwnerUncheckedCreateNestedManyWithoutCompanyInput;
};
export type CompanyCreateOrConnectWithoutPropertiesInput = {
    where: Prisma.CompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutPropertiesInput, Prisma.CompanyUncheckedCreateWithoutPropertiesInput>;
};
export type CompanyUpsertWithoutPropertiesInput = {
    update: Prisma.XOR<Prisma.CompanyUpdateWithoutPropertiesInput, Prisma.CompanyUncheckedUpdateWithoutPropertiesInput>;
    create: Prisma.XOR<Prisma.CompanyCreateWithoutPropertiesInput, Prisma.CompanyUncheckedCreateWithoutPropertiesInput>;
    where?: Prisma.CompanyWhereInput;
};
export type CompanyUpdateToOneWithWhereWithoutPropertiesInput = {
    where?: Prisma.CompanyWhereInput;
    data: Prisma.XOR<Prisma.CompanyUpdateWithoutPropertiesInput, Prisma.CompanyUncheckedUpdateWithoutPropertiesInput>;
};
export type CompanyUpdateWithoutPropertiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUpdateManyWithoutCompanyNestedInput;
};
export type CompanyUncheckedUpdateWithoutPropertiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    logo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.EnumCompanyStatusFieldUpdateOperationsInput | $Enums.CompanyStatus;
    timezone?: Prisma.StringFieldUpdateOperationsInput | string;
    locale?: Prisma.StringFieldUpdateOperationsInput | string;
    metadata?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    users?: Prisma.UserUncheckedUpdateManyWithoutCompanyNestedInput;
    tenants?: Prisma.TenantUncheckedUpdateManyWithoutCompanyNestedInput;
    owners?: Prisma.OwnerUncheckedUpdateManyWithoutCompanyNestedInput;
};
export type CompanyCountOutputType = {
    users: number;
    tenants: number;
    owners: number;
    properties: number;
};
export type CompanyCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | CompanyCountOutputTypeCountUsersArgs;
    tenants?: boolean | CompanyCountOutputTypeCountTenantsArgs;
    owners?: boolean | CompanyCountOutputTypeCountOwnersArgs;
    properties?: boolean | CompanyCountOutputTypeCountPropertiesArgs;
};
export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanyCountOutputTypeSelect<ExtArgs> | null;
};
export type CompanyCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type CompanyCountOutputTypeCountTenantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
};
export type CompanyCountOutputTypeCountOwnersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OwnerWhereInput;
};
export type CompanyCountOutputTypeCountPropertiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PropertyWhereInput;
};
export type CompanySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    logo?: boolean;
    status?: boolean;
    timezone?: boolean;
    locale?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    users?: boolean | Prisma.Company$usersArgs<ExtArgs>;
    tenants?: boolean | Prisma.Company$tenantsArgs<ExtArgs>;
    owners?: boolean | Prisma.Company$ownersArgs<ExtArgs>;
    properties?: boolean | Prisma.Company$propertiesArgs<ExtArgs>;
    _count?: boolean | Prisma.CompanyCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["company"]>;
export type CompanySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    logo?: boolean;
    status?: boolean;
    timezone?: boolean;
    locale?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
}, ExtArgs["result"]["company"]>;
export type CompanySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    logo?: boolean;
    status?: boolean;
    timezone?: boolean;
    locale?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
}, ExtArgs["result"]["company"]>;
export type CompanySelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
    logo?: boolean;
    status?: boolean;
    timezone?: boolean;
    locale?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type CompanyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "slug" | "email" | "phone" | "address" | "logo" | "status" | "timezone" | "locale" | "metadata" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["company"]>;
export type CompanyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Company$usersArgs<ExtArgs>;
    tenants?: boolean | Prisma.Company$tenantsArgs<ExtArgs>;
    owners?: boolean | Prisma.Company$ownersArgs<ExtArgs>;
    properties?: boolean | Prisma.Company$propertiesArgs<ExtArgs>;
    _count?: boolean | Prisma.CompanyCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CompanyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $CompanyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Company";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        tenants: Prisma.$TenantPayload<ExtArgs>[];
        owners: Prisma.$OwnerPayload<ExtArgs>[];
        properties: Prisma.$PropertyPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        slug: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
        status: $Enums.CompanyStatus;
        timezone: string;
        locale: string;
        metadata: runtime.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["company"]>;
    composites: {};
};
export type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CompanyPayload, S>;
export type CompanyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CompanyCountAggregateInputType | true;
};
export interface CompanyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Company'];
        meta: {
            name: 'Company';
        };
    };
    findUnique<T extends CompanyFindUniqueArgs>(args: Prisma.SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CompanyFindFirstArgs>(args?: Prisma.SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CompanyFindManyArgs>(args?: Prisma.SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CompanyCreateArgs>(args: Prisma.SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CompanyCreateManyArgs>(args?: Prisma.SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CompanyDeleteArgs>(args: Prisma.SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CompanyUpdateArgs>(args: Prisma.SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CompanyDeleteManyArgs>(args?: Prisma.SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CompanyUpdateManyArgs>(args: Prisma.SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CompanyUpsertArgs>(args: Prisma.SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CompanyCountArgs>(args?: Prisma.Subset<T, CompanyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CompanyCountAggregateOutputType> : number>;
    aggregate<T extends CompanyAggregateArgs>(args: Prisma.Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>;
    groupBy<T extends CompanyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CompanyGroupByArgs['orderBy'];
    } : {
        orderBy?: CompanyGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CompanyFieldRefs;
}
export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Company$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Company$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    tenants<T extends Prisma.Company$tenantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Company$tenantsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    owners<T extends Prisma.Company$ownersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Company$ownersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    properties<T extends Prisma.Company$propertiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Company$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CompanyFieldRefs {
    readonly id: Prisma.FieldRef<"Company", 'String'>;
    readonly name: Prisma.FieldRef<"Company", 'String'>;
    readonly slug: Prisma.FieldRef<"Company", 'String'>;
    readonly email: Prisma.FieldRef<"Company", 'String'>;
    readonly phone: Prisma.FieldRef<"Company", 'String'>;
    readonly address: Prisma.FieldRef<"Company", 'String'>;
    readonly logo: Prisma.FieldRef<"Company", 'String'>;
    readonly status: Prisma.FieldRef<"Company", 'CompanyStatus'>;
    readonly timezone: Prisma.FieldRef<"Company", 'String'>;
    readonly locale: Prisma.FieldRef<"Company", 'String'>;
    readonly metadata: Prisma.FieldRef<"Company", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"Company", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Company", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Company", 'DateTime'>;
}
export type CompanyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where: Prisma.CompanyWhereUniqueInput;
};
export type CompanyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where: Prisma.CompanyWhereUniqueInput;
};
export type CompanyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[];
    cursor?: Prisma.CompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanyScalarFieldEnum | Prisma.CompanyScalarFieldEnum[];
};
export type CompanyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[];
    cursor?: Prisma.CompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanyScalarFieldEnum | Prisma.CompanyScalarFieldEnum[];
};
export type CompanyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput | Prisma.CompanyOrderByWithRelationInput[];
    cursor?: Prisma.CompanyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanyScalarFieldEnum | Prisma.CompanyScalarFieldEnum[];
};
export type CompanyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanyCreateInput, Prisma.CompanyUncheckedCreateInput>;
};
export type CompanyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CompanyCreateManyInput | Prisma.CompanyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CompanyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    data: Prisma.CompanyCreateManyInput | Prisma.CompanyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CompanyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanyUpdateInput, Prisma.CompanyUncheckedUpdateInput>;
    where: Prisma.CompanyWhereUniqueInput;
};
export type CompanyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CompanyUpdateManyMutationInput, Prisma.CompanyUncheckedUpdateManyInput>;
    where?: Prisma.CompanyWhereInput;
    limit?: number;
};
export type CompanyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanyUpdateManyMutationInput, Prisma.CompanyUncheckedUpdateManyInput>;
    where?: Prisma.CompanyWhereInput;
    limit?: number;
};
export type CompanyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where: Prisma.CompanyWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanyCreateInput, Prisma.CompanyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CompanyUpdateInput, Prisma.CompanyUncheckedUpdateInput>;
};
export type CompanyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
    where: Prisma.CompanyWhereUniqueInput;
};
export type CompanyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanyWhereInput;
    limit?: number;
};
export type Company$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Company$tenantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TenantScalarFieldEnum | Prisma.TenantScalarFieldEnum[];
};
export type Company$ownersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    where?: Prisma.OwnerWhereInput;
    orderBy?: Prisma.OwnerOrderByWithRelationInput | Prisma.OwnerOrderByWithRelationInput[];
    cursor?: Prisma.OwnerWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OwnerScalarFieldEnum | Prisma.OwnerScalarFieldEnum[];
};
export type Company$propertiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PropertySelect<ExtArgs> | null;
    omit?: Prisma.PropertyOmit<ExtArgs> | null;
    include?: Prisma.PropertyInclude<ExtArgs> | null;
    where?: Prisma.PropertyWhereInput;
    orderBy?: Prisma.PropertyOrderByWithRelationInput | Prisma.PropertyOrderByWithRelationInput[];
    cursor?: Prisma.PropertyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PropertyScalarFieldEnum | Prisma.PropertyScalarFieldEnum[];
};
export type CompanyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySelect<ExtArgs> | null;
    omit?: Prisma.CompanyOmit<ExtArgs> | null;
    include?: Prisma.CompanyInclude<ExtArgs> | null;
};
