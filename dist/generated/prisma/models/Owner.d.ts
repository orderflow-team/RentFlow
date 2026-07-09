import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OwnerModel = runtime.Types.Result.DefaultSelection<Prisma.$OwnerPayload>;
export type AggregateOwner = {
    _count: OwnerCountAggregateOutputType | null;
    _min: OwnerMinAggregateOutputType | null;
    _max: OwnerMaxAggregateOutputType | null;
};
export type OwnerMinAggregateOutputType = {
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
export type OwnerMaxAggregateOutputType = {
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
export type OwnerCountAggregateOutputType = {
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
export type OwnerMinAggregateInputType = {
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
export type OwnerMaxAggregateInputType = {
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
export type OwnerCountAggregateInputType = {
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
export type OwnerAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OwnerWhereInput;
    orderBy?: Prisma.OwnerOrderByWithRelationInput | Prisma.OwnerOrderByWithRelationInput[];
    cursor?: Prisma.OwnerWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OwnerCountAggregateInputType;
    _min?: OwnerMinAggregateInputType;
    _max?: OwnerMaxAggregateInputType;
};
export type GetOwnerAggregateType<T extends OwnerAggregateArgs> = {
    [P in keyof T & keyof AggregateOwner]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOwner[P]> : Prisma.GetScalarType<T[P], AggregateOwner[P]>;
};
export type OwnerGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OwnerWhereInput;
    orderBy?: Prisma.OwnerOrderByWithAggregationInput | Prisma.OwnerOrderByWithAggregationInput[];
    by: Prisma.OwnerScalarFieldEnum[] | Prisma.OwnerScalarFieldEnum;
    having?: Prisma.OwnerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OwnerCountAggregateInputType | true;
    _min?: OwnerMinAggregateInputType;
    _max?: OwnerMaxAggregateInputType;
};
export type OwnerGroupByOutputType = {
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
    _count: OwnerCountAggregateOutputType | null;
    _min: OwnerMinAggregateOutputType | null;
    _max: OwnerMaxAggregateOutputType | null;
};
export type GetOwnerGroupByPayload<T extends OwnerGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OwnerGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OwnerGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OwnerGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OwnerGroupByOutputType[P]>;
}>>;
export type OwnerWhereInput = {
    AND?: Prisma.OwnerWhereInput | Prisma.OwnerWhereInput[];
    OR?: Prisma.OwnerWhereInput[];
    NOT?: Prisma.OwnerWhereInput | Prisma.OwnerWhereInput[];
    id?: Prisma.StringFilter<"Owner"> | string;
    companyId?: Prisma.StringFilter<"Owner"> | string;
    userId?: Prisma.StringNullableFilter<"Owner"> | string | null;
    firstName?: Prisma.StringFilter<"Owner"> | string;
    lastName?: Prisma.StringFilter<"Owner"> | string;
    email?: Prisma.StringFilter<"Owner"> | string;
    phone?: Prisma.StringNullableFilter<"Owner"> | string | null;
    status?: Prisma.StringFilter<"Owner"> | string;
    createdAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Owner"> | Date | string | null;
    company?: Prisma.XOR<Prisma.CompanyScalarRelationFilter, Prisma.CompanyWhereInput>;
};
export type OwnerOrderByWithRelationInput = {
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
export type OwnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OwnerWhereInput | Prisma.OwnerWhereInput[];
    OR?: Prisma.OwnerWhereInput[];
    NOT?: Prisma.OwnerWhereInput | Prisma.OwnerWhereInput[];
    companyId?: Prisma.StringFilter<"Owner"> | string;
    userId?: Prisma.StringNullableFilter<"Owner"> | string | null;
    firstName?: Prisma.StringFilter<"Owner"> | string;
    lastName?: Prisma.StringFilter<"Owner"> | string;
    email?: Prisma.StringFilter<"Owner"> | string;
    phone?: Prisma.StringNullableFilter<"Owner"> | string | null;
    status?: Prisma.StringFilter<"Owner"> | string;
    createdAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Owner"> | Date | string | null;
    company?: Prisma.XOR<Prisma.CompanyScalarRelationFilter, Prisma.CompanyWhereInput>;
}, "id">;
export type OwnerOrderByWithAggregationInput = {
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
    _count?: Prisma.OwnerCountOrderByAggregateInput;
    _max?: Prisma.OwnerMaxOrderByAggregateInput;
    _min?: Prisma.OwnerMinOrderByAggregateInput;
};
export type OwnerScalarWhereWithAggregatesInput = {
    AND?: Prisma.OwnerScalarWhereWithAggregatesInput | Prisma.OwnerScalarWhereWithAggregatesInput[];
    OR?: Prisma.OwnerScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OwnerScalarWhereWithAggregatesInput | Prisma.OwnerScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    companyId?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    userId?: Prisma.StringNullableWithAggregatesFilter<"Owner"> | string | null;
    firstName?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    email?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Owner"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"Owner"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Owner"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Owner"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null;
};
export type OwnerCreateInput = {
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
    company: Prisma.CompanyCreateNestedOneWithoutOwnersInput;
};
export type OwnerUncheckedCreateInput = {
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
export type OwnerUpdateInput = {
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
    company?: Prisma.CompanyUpdateOneRequiredWithoutOwnersNestedInput;
};
export type OwnerUncheckedUpdateInput = {
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
export type OwnerCreateManyInput = {
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
export type OwnerUpdateManyMutationInput = {
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
export type OwnerUncheckedUpdateManyInput = {
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
export type OwnerListRelationFilter = {
    every?: Prisma.OwnerWhereInput;
    some?: Prisma.OwnerWhereInput;
    none?: Prisma.OwnerWhereInput;
};
export type OwnerOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OwnerCountOrderByAggregateInput = {
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
export type OwnerMaxOrderByAggregateInput = {
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
export type OwnerMinOrderByAggregateInput = {
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
export type OwnerCreateNestedManyWithoutCompanyInput = {
    create?: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput> | Prisma.OwnerCreateWithoutCompanyInput[] | Prisma.OwnerUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.OwnerCreateOrConnectWithoutCompanyInput | Prisma.OwnerCreateOrConnectWithoutCompanyInput[];
    createMany?: Prisma.OwnerCreateManyCompanyInputEnvelope;
    connect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
};
export type OwnerUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput> | Prisma.OwnerCreateWithoutCompanyInput[] | Prisma.OwnerUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.OwnerCreateOrConnectWithoutCompanyInput | Prisma.OwnerCreateOrConnectWithoutCompanyInput[];
    createMany?: Prisma.OwnerCreateManyCompanyInputEnvelope;
    connect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
};
export type OwnerUpdateManyWithoutCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput> | Prisma.OwnerCreateWithoutCompanyInput[] | Prisma.OwnerUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.OwnerCreateOrConnectWithoutCompanyInput | Prisma.OwnerCreateOrConnectWithoutCompanyInput[];
    upsert?: Prisma.OwnerUpsertWithWhereUniqueWithoutCompanyInput | Prisma.OwnerUpsertWithWhereUniqueWithoutCompanyInput[];
    createMany?: Prisma.OwnerCreateManyCompanyInputEnvelope;
    set?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    disconnect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    delete?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    connect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    update?: Prisma.OwnerUpdateWithWhereUniqueWithoutCompanyInput | Prisma.OwnerUpdateWithWhereUniqueWithoutCompanyInput[];
    updateMany?: Prisma.OwnerUpdateManyWithWhereWithoutCompanyInput | Prisma.OwnerUpdateManyWithWhereWithoutCompanyInput[];
    deleteMany?: Prisma.OwnerScalarWhereInput | Prisma.OwnerScalarWhereInput[];
};
export type OwnerUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput> | Prisma.OwnerCreateWithoutCompanyInput[] | Prisma.OwnerUncheckedCreateWithoutCompanyInput[];
    connectOrCreate?: Prisma.OwnerCreateOrConnectWithoutCompanyInput | Prisma.OwnerCreateOrConnectWithoutCompanyInput[];
    upsert?: Prisma.OwnerUpsertWithWhereUniqueWithoutCompanyInput | Prisma.OwnerUpsertWithWhereUniqueWithoutCompanyInput[];
    createMany?: Prisma.OwnerCreateManyCompanyInputEnvelope;
    set?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    disconnect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    delete?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    connect?: Prisma.OwnerWhereUniqueInput | Prisma.OwnerWhereUniqueInput[];
    update?: Prisma.OwnerUpdateWithWhereUniqueWithoutCompanyInput | Prisma.OwnerUpdateWithWhereUniqueWithoutCompanyInput[];
    updateMany?: Prisma.OwnerUpdateManyWithWhereWithoutCompanyInput | Prisma.OwnerUpdateManyWithWhereWithoutCompanyInput[];
    deleteMany?: Prisma.OwnerScalarWhereInput | Prisma.OwnerScalarWhereInput[];
};
export type OwnerCreateWithoutCompanyInput = {
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
export type OwnerUncheckedCreateWithoutCompanyInput = {
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
export type OwnerCreateOrConnectWithoutCompanyInput = {
    where: Prisma.OwnerWhereUniqueInput;
    create: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput>;
};
export type OwnerCreateManyCompanyInputEnvelope = {
    data: Prisma.OwnerCreateManyCompanyInput | Prisma.OwnerCreateManyCompanyInput[];
    skipDuplicates?: boolean;
};
export type OwnerUpsertWithWhereUniqueWithoutCompanyInput = {
    where: Prisma.OwnerWhereUniqueInput;
    update: Prisma.XOR<Prisma.OwnerUpdateWithoutCompanyInput, Prisma.OwnerUncheckedUpdateWithoutCompanyInput>;
    create: Prisma.XOR<Prisma.OwnerCreateWithoutCompanyInput, Prisma.OwnerUncheckedCreateWithoutCompanyInput>;
};
export type OwnerUpdateWithWhereUniqueWithoutCompanyInput = {
    where: Prisma.OwnerWhereUniqueInput;
    data: Prisma.XOR<Prisma.OwnerUpdateWithoutCompanyInput, Prisma.OwnerUncheckedUpdateWithoutCompanyInput>;
};
export type OwnerUpdateManyWithWhereWithoutCompanyInput = {
    where: Prisma.OwnerScalarWhereInput;
    data: Prisma.XOR<Prisma.OwnerUpdateManyMutationInput, Prisma.OwnerUncheckedUpdateManyWithoutCompanyInput>;
};
export type OwnerScalarWhereInput = {
    AND?: Prisma.OwnerScalarWhereInput | Prisma.OwnerScalarWhereInput[];
    OR?: Prisma.OwnerScalarWhereInput[];
    NOT?: Prisma.OwnerScalarWhereInput | Prisma.OwnerScalarWhereInput[];
    id?: Prisma.StringFilter<"Owner"> | string;
    companyId?: Prisma.StringFilter<"Owner"> | string;
    userId?: Prisma.StringNullableFilter<"Owner"> | string | null;
    firstName?: Prisma.StringFilter<"Owner"> | string;
    lastName?: Prisma.StringFilter<"Owner"> | string;
    email?: Prisma.StringFilter<"Owner"> | string;
    phone?: Prisma.StringNullableFilter<"Owner"> | string | null;
    status?: Prisma.StringFilter<"Owner"> | string;
    createdAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Owner"> | Date | string;
    deletedAt?: Prisma.DateTimeNullableFilter<"Owner"> | Date | string | null;
};
export type OwnerCreateManyCompanyInput = {
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
export type OwnerUpdateWithoutCompanyInput = {
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
export type OwnerUncheckedUpdateWithoutCompanyInput = {
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
export type OwnerUncheckedUpdateManyWithoutCompanyInput = {
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
export type OwnerSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
}, ExtArgs["result"]["owner"]>;
export type OwnerSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
}, ExtArgs["result"]["owner"]>;
export type OwnerSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
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
}, ExtArgs["result"]["owner"]>;
export type OwnerSelectScalar = {
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
export type OwnerOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "companyId" | "userId" | "firstName" | "lastName" | "email" | "phone" | "status" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["owner"]>;
export type OwnerInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type OwnerIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type OwnerIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    company?: boolean | Prisma.CompanyDefaultArgs<ExtArgs>;
};
export type $OwnerPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Owner";
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
    }, ExtArgs["result"]["owner"]>;
    composites: {};
};
export type OwnerGetPayload<S extends boolean | null | undefined | OwnerDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OwnerPayload, S>;
export type OwnerCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OwnerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OwnerCountAggregateInputType | true;
};
export interface OwnerDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Owner'];
        meta: {
            name: 'Owner';
        };
    };
    findUnique<T extends OwnerFindUniqueArgs>(args: Prisma.SelectSubset<T, OwnerFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OwnerFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OwnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OwnerFindFirstArgs>(args?: Prisma.SelectSubset<T, OwnerFindFirstArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OwnerFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OwnerFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OwnerFindManyArgs>(args?: Prisma.SelectSubset<T, OwnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OwnerCreateArgs>(args: Prisma.SelectSubset<T, OwnerCreateArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OwnerCreateManyArgs>(args?: Prisma.SelectSubset<T, OwnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OwnerCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OwnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OwnerDeleteArgs>(args: Prisma.SelectSubset<T, OwnerDeleteArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OwnerUpdateArgs>(args: Prisma.SelectSubset<T, OwnerUpdateArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OwnerDeleteManyArgs>(args?: Prisma.SelectSubset<T, OwnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OwnerUpdateManyArgs>(args: Prisma.SelectSubset<T, OwnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OwnerUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OwnerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OwnerUpsertArgs>(args: Prisma.SelectSubset<T, OwnerUpsertArgs<ExtArgs>>): Prisma.Prisma__OwnerClient<runtime.Types.Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OwnerCountArgs>(args?: Prisma.Subset<T, OwnerCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OwnerCountAggregateOutputType> : number>;
    aggregate<T extends OwnerAggregateArgs>(args: Prisma.Subset<T, OwnerAggregateArgs>): Prisma.PrismaPromise<GetOwnerAggregateType<T>>;
    groupBy<T extends OwnerGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OwnerGroupByArgs['orderBy'];
    } : {
        orderBy?: OwnerGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OwnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOwnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OwnerFieldRefs;
}
export interface Prisma__OwnerClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    company<T extends Prisma.CompanyDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CompanyDefaultArgs<ExtArgs>>): Prisma.Prisma__CompanyClient<runtime.Types.Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OwnerFieldRefs {
    readonly id: Prisma.FieldRef<"Owner", 'String'>;
    readonly companyId: Prisma.FieldRef<"Owner", 'String'>;
    readonly userId: Prisma.FieldRef<"Owner", 'String'>;
    readonly firstName: Prisma.FieldRef<"Owner", 'String'>;
    readonly lastName: Prisma.FieldRef<"Owner", 'String'>;
    readonly email: Prisma.FieldRef<"Owner", 'String'>;
    readonly phone: Prisma.FieldRef<"Owner", 'String'>;
    readonly status: Prisma.FieldRef<"Owner", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Owner", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Owner", 'DateTime'>;
    readonly deletedAt: Prisma.FieldRef<"Owner", 'DateTime'>;
}
export type OwnerFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    where: Prisma.OwnerWhereUniqueInput;
};
export type OwnerFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    where: Prisma.OwnerWhereUniqueInput;
};
export type OwnerFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OwnerFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OwnerFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type OwnerCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OwnerCreateInput, Prisma.OwnerUncheckedCreateInput>;
};
export type OwnerCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OwnerCreateManyInput | Prisma.OwnerCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OwnerCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    data: Prisma.OwnerCreateManyInput | Prisma.OwnerCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OwnerIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OwnerUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OwnerUpdateInput, Prisma.OwnerUncheckedUpdateInput>;
    where: Prisma.OwnerWhereUniqueInput;
};
export type OwnerUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OwnerUpdateManyMutationInput, Prisma.OwnerUncheckedUpdateManyInput>;
    where?: Prisma.OwnerWhereInput;
    limit?: number;
};
export type OwnerUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OwnerUpdateManyMutationInput, Prisma.OwnerUncheckedUpdateManyInput>;
    where?: Prisma.OwnerWhereInput;
    limit?: number;
    include?: Prisma.OwnerIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OwnerUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    where: Prisma.OwnerWhereUniqueInput;
    create: Prisma.XOR<Prisma.OwnerCreateInput, Prisma.OwnerUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OwnerUpdateInput, Prisma.OwnerUncheckedUpdateInput>;
};
export type OwnerDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
    where: Prisma.OwnerWhereUniqueInput;
};
export type OwnerDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OwnerWhereInput;
    limit?: number;
};
export type OwnerDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OwnerSelect<ExtArgs> | null;
    omit?: Prisma.OwnerOmit<ExtArgs> | null;
    include?: Prisma.OwnerInclude<ExtArgs> | null;
};
