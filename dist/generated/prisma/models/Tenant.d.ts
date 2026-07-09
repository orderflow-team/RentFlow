import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TenantModel = runtime.Types.Result.DefaultSelection<Prisma.$TenantPayload>;
export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type TenantMinAggregateOutputType = {
    id: string | null;
    companyId: string | null;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TenantMaxAggregateOutputType = {
    id: string | null;
    companyId: string | null;
    userId: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type TenantCountAggregateOutputType = {
    id: number;
    companyId: number;
    userId: number;
    firstName: number;
    lastName: number;
    email: number;
    phone: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
};
export type TenantMinAggregateInputType = {
    id?: true;
    companyId?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    phone?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TenantMaxAggregateInputType = {
    id?: true;
    companyId?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    phone?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
};
export type TenantCountAggregateInputType = {
    id?: true;
    companyId?: true;
    userId?: true;
    firstName?: true;
    lastName?: true;
    email?: true;
    phone?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
};
export type TenantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithRelationInput | Prisma.TenantOrderByWithRelationInput[];
    cursor?: Prisma.TenantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TenantCountAggregateInputType;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTenant[P]> : Prisma.GetScalarType<T[P], AggregateTenant[P]>;
};
export type TenantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    orderBy?: Prisma.TenantOrderByWithAggregationInput | Prisma.TenantOrderByWithAggregationInput[];
    by: Prisma.TenantScalarFieldEnum[] | Prisma.TenantScalarFieldEnum;
    having?: Prisma.TenantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TenantCountAggregateInputType | true;
    _min?: TenantMinAggregateInputType;
    _max?: TenantMaxAggregateInputType;
};
export type TenantGroupByOutputType = {
    id: string;
    companyId: string;
    userId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: TenantCountAggregateOutputType | null;
    _min: TenantMinAggregateOutputType | null;
    _max: TenantMaxAggregateOutputType | null;
};
export type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TenantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TenantGroupByOutputType[P]>;
}>>;
export type TenantWhereInput = {
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    id?: Prisma.StringFilter<"Tenant"> | string;
    companyId?: Prisma.StringFilter<"Tenant"> | string;
    userId?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    firstName?: Prisma.StringFilter<"Tenant"> | string;
    lastName?: Prisma.StringFilter<"Tenant"> | string;
    email?: Prisma.StringFilter<"Tenant"> | string;
    phone?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    status?: Prisma.StringFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tenant"> | Date | string | null;
    company?: Prisma.XOR<Prisma.CompanyScalarRelationFilter, Prisma.CompanyWhereInput>;
};
export type TenantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    company?: Prisma.CompanyOrderByWithRelationInput;
};
export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    OR?: Prisma.TenantWhereInput[];
    NOT?: Prisma.TenantWhereInput | Prisma.TenantWhereInput[];
    companyId?: Prisma.StringFilter<"Tenant"> | string;
    userId?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    firstName?: Prisma.StringFilter<"Tenant"> | string;
    lastName?: Prisma.StringFilter<"Tenant"> | string;
    email?: Prisma.StringFilter<"Tenant"> | string;
    phone?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    status?: Prisma.StringFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tenant"> | Date | string | null;
    company?: Prisma.XOR<Prisma.CompanyScalarRelationFilter, Prisma.CompanyWhereInput>;
}, "id">;
export type TenantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    userId?: Prisma.SortOrderInput | Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TenantCountOrderByAggregateInput;
    _max?: Prisma.TenantMaxOrderByAggregateInput;
    _min?: Prisma.TenantMinOrderByAggregateInput;
};
export type TenantScalarWhereWithAggregatesInput = {
    AND?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    OR?: Prisma.TenantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TenantScalarWhereWithAggregatesInput | Prisma.TenantScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    companyId?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"Tenant"> | string | null;
    firstName?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Tenant"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Tenant"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null;
};
export type TenantCreateInput = {
    id?: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    company: Prisma.CompanyCreateNestedOneWithoutTenantsInput;
};
export type TenantUncheckedCreateInput = {
    id?: string;
    companyId: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TenantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    company?: Prisma.CompanyUpdateOneRequiredWithoutTenantsNestedInput;
};
export type TenantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantCreateManyInput = {
    id?: string;
    companyId: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TenantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantListRelationFilter = {
    every?: Prisma.TenantWhereInput;
    some?: Prisma.TenantWhereInput;
    none?: Prisma.TenantWhereInput;
};
export type TenantOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TenantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TenantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TenantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    deletedAt?: Prisma.SortOrder;
};
export type TenantCreateNestedManyWithoutCompanyInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput> | Prisma.TenantCreateWithoutCompanyInput[] | Prisma.TenantUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCompanyInput | Prisma.TenantCreateOrConnectWithoutCompanyInput[];
    createMany?: Prisma.TenantCreateManyCompanyInputEnvelope;
    connect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
};
export type TenantUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput> | Prisma.TenantCreateWithoutCompanyInput[] | Prisma.TenantUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCompanyInput | Prisma.TenantCreateOrConnectWithoutCompanyInput[];
    createMany?: Prisma.TenantCreateManyCompanyInputEnvelope;
    connect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
};
export type TenantUpdateManyWithoutCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput> | Prisma.TenantCreateWithoutCompanyInput[] | Prisma.TenantUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCompanyInput | Prisma.TenantCreateOrConnectWithoutCompanyInput[];
    upsert?: Prisma.TenantUpsertWithWhereUniqueWithoutCompanyInput | Prisma.TenantUpsertWithWhereUniqueWithoutCompanyInput[];
    createMany?: Prisma.TenantCreateManyCompanyInputEnvelope;
    set?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    disconnect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    delete?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    connect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    update?: Prisma.TenantUpdateWithWhereUniqueWithoutCompanyInput | Prisma.TenantUpdateWithWhereUniqueWithoutCompanyInput[];
    updateMany?: Prisma.TenantUpdateManyWithWhereWithoutCompanyInput | Prisma.TenantUpdateManyWithWhereWithoutCompanyInput[];
    deleteMany?: Prisma.TenantScalarWhereInput | Prisma.TenantScalarWhereInput[];
};
export type TenantUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput> | Prisma.TenantCreateWithoutCompanyInput[] | Prisma.TenantUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.TenantCreateOrConnectWithoutCompanyInput | Prisma.TenantCreateOrConnectWithoutCompanyInput[];
    upsert?: Prisma.TenantUpsertWithWhereUniqueWithoutCompanyInput | Prisma.TenantUpsertWithWhereUniqueWithoutCompanyInput[];
    createMany?: Prisma.TenantCreateManyCompanyInputEnvelope;
    set?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    disconnect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    delete?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    connect?: Prisma.TenantWhereUniqueInput | Prisma.TenantWhereUniqueInput[];
    update?: Prisma.TenantUpdateWithWhereUniqueWithoutCompanyInput | Prisma.TenantUpdateWithWhereUniqueWithoutCompanyInput[];
    updateMany?: Prisma.TenantUpdateManyWithWhereWithoutCompanyInput | Prisma.TenantUpdateManyWithWhereWithoutCompanyInput[];
    deleteMany?: Prisma.TenantScalarWhereInput | Prisma.TenantScalarWhereInput[];
};
export type TenantCreateWithoutCompanyInput = {
    id?: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TenantUncheckedCreateWithoutCompanyInput = {
    id?: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TenantCreateOrConnectWithoutCompanyInput = {
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput>;
};
export type TenantCreateManyCompanyInputEnvelope = {
    data: Prisma.TenantCreateManyCompanyInput | Prisma.TenantCreateManyCompanyInput[];
    skipDuplicates?: boolean;
};
export type TenantUpsertWithWhereUniqueWithoutCompanyInput = {
    where: Prisma.TenantWhereUniqueInput;
    update: Prisma.XOR<Prisma.TenantUpdateWithoutCompanyInput, Prisma.TenantUncheckedUpdateWithoutCompanyInput>;
    create: Prisma.XOR<Prisma.TenantCreateWithoutCompanyInput, Prisma.TenantUncheckedCreateWithoutCompanyInput>;
};
export type TenantUpdateWithWhereUniqueWithoutCompanyInput = {
    where: Prisma.TenantWhereUniqueInput;
    data: Prisma.XOR<Prisma.TenantUpdateWithoutCompanyInput, Prisma.TenantUncheckedUpdateWithoutCompanyInput>;
};
export type TenantUpdateManyWithWhereWithoutCompanyInput = {
    where: Prisma.TenantScalarWhereInput;
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyWithoutCompanyInput>;
};
export type TenantScalarWhereInput = {
    AND?: Prisma.TenantScalarWhereInput | Prisma.TenantScalarWhereInput[];
    OR?: Prisma.TenantScalarWhereInput[];
    NOT?: Prisma.TenantScalarWhereInput | Prisma.TenantScalarWhereInput[];
    id?: Prisma.StringFilter<"Tenant"> | string;
    companyId?: Prisma.StringFilter<"Tenant"> | string;
    userId?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    firstName?: Prisma.StringFilter<"Tenant"> | string;
    lastName?: Prisma.StringFilter<"Tenant"> | string;
    email?: Prisma.StringFilter<"Tenant"> | string;
    phone?: Prisma.StringNullableFilter<"Tenant"> | string | null;
    status?: Prisma.StringFilter<"Tenant"> | string;
    createdAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Tenant"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Tenant"> | Date | string | null;
};
export type TenantCreateManyCompanyInput = {
    id?: string;
    userId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
};
export type TenantUpdateWithoutCompanyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantUncheckedUpdateWithoutCompanyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantUncheckedUpdateManyWithoutCompanyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type TenantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    companyId?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    phone?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    companyId?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    phone?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    companyId?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    phone?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["tenant"]>;
export type TenantSelectScalar = {
    id?: boolean;
    companyId?: boolean;
    userId?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    phone?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
};
export type TenantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "companyId" | "userId" | "firstName" | "lastName" | "email" | "phone" | "status" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["tenant"]>;
export type TenantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type TenantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type TenantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type $TenantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Tenant";
    objects: {
        company: Prisma.$CompanyPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        companyId: string;
        userId: string | null;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, ExtArgs["result"]["tenant"]>;
    composites: {};
};
export type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TenantPayload, S>;
export type TenantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TenantCountAggregateInputType | true;
};
export interface TenantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Tenant'];
        meta: {
            name: 'Tenant';
        };
    };
    findUnique<T extends TenantFindUniqueArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TenantFindFirstArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TenantFindManyArgs>(args?: Prisma.SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TenantCreateArgs>(args: Prisma.SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TenantCreateManyArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TenantDeleteArgs>(args: Prisma.SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TenantUpdateArgs>(args: Prisma.SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TenantDeleteManyArgs>(args?: Prisma.SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TenantUpdateManyArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TenantUpsertArgs>(args: Prisma.SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma.Prisma__TenantClient<runtime.Types.Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TenantCountArgs>(args?: Prisma.Subset<T, TenantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TenantCountAggregateOutputType> : number>;
    aggregate<T extends TenantAggregateArgs>(args: Prisma.Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>;
    groupBy<T extends TenantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TenantGroupByArgs['orderBy'];
    } : {
        orderBy?: TenantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TenantFieldRefs;
}
export interface Prisma__TenantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    company<T extends Prisma.CompanyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CompanyDefaultArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TenantFieldRefs {
    readonly id: Prisma.FieldRef<"Tenant", 'String'>;
    readonly companyId: Prisma.FieldRef<"Tenant", 'String'>;
    readonly userId: Prisma.FieldRef<"Tenant", 'String'>;
    readonly firstName: Prisma.FieldRef<"Tenant", 'String'>;
    readonly lastName: Prisma.FieldRef<"Tenant", 'String'>;
    readonly email: Prisma.FieldRef<"Tenant", 'String'>;
    readonly phone: Prisma.FieldRef<"Tenant", 'String'>;
    readonly status: Prisma.FieldRef<"Tenant", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Tenant", 'DateTime'>;
}
export type TenantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TenantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
};
export type TenantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TenantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.TenantCreateManyInput | Prisma.TenantCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TenantIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TenantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TenantUpdateManyMutationInput, Prisma.TenantUncheckedUpdateManyInput>;
    where?: Prisma.TenantWhereInput;
    limit?: number;
    include?: Prisma.TenantIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TenantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
    create: Prisma.XOR<Prisma.TenantCreateInput, Prisma.TenantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TenantUpdateInput, Prisma.TenantUncheckedUpdateInput>;
};
export type TenantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
    where: Prisma.TenantWhereUniqueInput;
};
export type TenantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TenantWhereInput;
    limit?: number;
};
export type TenantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TenantSelect<ExtArgs> | null;
    omit?: Prisma.TenantOmit<ExtArgs> | null;
    include?: Prisma.TenantInclude<ExtArgs> | null;
};
