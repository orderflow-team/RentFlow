import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type UserRoleModel = runtime.Types.Result.DefaultSelection<Prisma.$UserRolePayload>;
export type AggregateUserRole = {
    _count: UserRoleCountAggregateOutputType | null;
    _min: UserRoleMinAggregateOutputType | null;
    _max: UserRoleMaxAggregateOutputType | null;
};
export type UserRoleMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    roleId: string | null;
    companyId: string | null;
    createdAt: Date | null;
};
export type UserRoleMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    roleId: string | null;
    companyId: string | null;
    createdAt: Date | null;
};
export type UserRoleCountAggregateOutputType = {
    id: number;
    userId: number;
    roleId: number;
    companyId: number;
    createdAt: number;
    _all: number;
};
export type UserRoleMinAggregateInputType = {
    id?: true;
    userId?: true;
    roleId?: true;
    companyId?: true;
    createdAt?: true;
};
export type UserRoleMaxAggregateInputType = {
    id?: true;
    userId?: true;
    roleId?: true;
    companyId?: true;
    createdAt?: true;
};
export type UserRoleCountAggregateInputType = {
    id?: true;
    userId?: true;
    roleId?: true;
    companyId?: true;
    createdAt?: true;
    _all?: true;
};
export type UserRoleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithRelationInput | Prisma.UserRoleOrderByWithRelationInput[];
    cursor?: Prisma.UserRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserRoleCountAggregateInputType;
    _min?: UserRoleMinAggregateInputType;
    _max?: UserRoleMaxAggregateInputType;
};
export type GetUserRoleAggregateType<T extends UserRoleAggregateArgs> = {
    [P in keyof T & keyof AggregateUserRole]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserRole[P]> : Prisma.GetScalarType<T[P], AggregateUserRole[P]>;
};
export type UserRoleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithAggregationInput | Prisma.UserRoleOrderByWithAggregationInput[];
    by: Prisma.UserRoleScalarFieldEnum[] | Prisma.UserRoleScalarFieldEnum;
    having?: Prisma.UserRoleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserRoleCountAggregateInputType | true;
    _min?: UserRoleMinAggregateInputType;
    _max?: UserRoleMaxAggregateInputType;
};
export type UserRoleGroupByOutputType = {
    id: string;
    userId: string;
    roleId: string;
    companyId: string;
    createdAt: Date;
    _count: UserRoleCountAggregateOutputType | null;
    _min: UserRoleMinAggregateOutputType | null;
    _max: UserRoleMaxAggregateOutputType | null;
};
export type GetUserRoleGroupByPayload<T extends UserRoleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserRoleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserRoleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserRoleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserRoleGroupByOutputType[P]>;
}>>;
export type UserRoleWhereInput = {
    AND?: Prisma.UserRoleWhereInput | Prisma.UserRoleWhereInput[];
    OR?: Prisma.UserRoleWhereInput[];
    NOT?: Prisma.UserRoleWhereInput | Prisma.UserRoleWhereInput[];
    id?: Prisma.StringFilter<"UserRole"> | string;
    userId?: Prisma.StringFilter<"UserRole"> | string;
    roleId?: Prisma.StringFilter<"UserRole"> | string;
    companyId?: Prisma.StringFilter<"UserRole"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserRole"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
};
export type UserRoleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    role?: Prisma.RoleOrderByWithRelationInput;
};
export type UserRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_roleId_companyId?: Prisma.UserRoleUserIdRoleIdCompanyIdCompoundUniqueInput;
    AND?: Prisma.UserRoleWhereInput | Prisma.UserRoleWhereInput[];
    OR?: Prisma.UserRoleWhereInput[];
    NOT?: Prisma.UserRoleWhereInput | Prisma.UserRoleWhereInput[];
    userId?: Prisma.StringFilter<"UserRole"> | string;
    roleId?: Prisma.StringFilter<"UserRole"> | string;
    companyId?: Prisma.StringFilter<"UserRole"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserRole"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
}, "id" | "userId_roleId_companyId">;
export type UserRoleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserRoleCountOrderByAggregateInput;
    _max?: Prisma.UserRoleMaxOrderByAggregateInput;
    _min?: Prisma.UserRoleMinOrderByAggregateInput;
};
export type UserRoleScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserRoleScalarWhereWithAggregatesInput | Prisma.UserRoleScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserRoleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserRoleScalarWhereWithAggregatesInput | Prisma.UserRoleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserRole"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"UserRole"> | string;
    roleId?: Prisma.StringWithAggregatesFilter<"UserRole"> | string;
    companyId?: Prisma.StringWithAggregatesFilter<"UserRole"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserRole"> | Date | string;
};
export type UserRoleCreateInput = {
    id?: string;
    companyId: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRolesInput;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
};
export type UserRoleUncheckedCreateInput = {
    id?: string;
    userId: string;
    roleId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRolesNestedInput;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
};
export type UserRoleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleCreateManyInput = {
    id?: string;
    userId: string;
    roleId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleListRelationFilter = {
    every?: Prisma.UserRoleWhereInput;
    some?: Prisma.UserRoleWhereInput;
    none?: Prisma.UserRoleWhereInput;
};
export type UserRoleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserRoleUserIdRoleIdCompanyIdCompoundUniqueInput = {
    userId: string;
    roleId: string;
    companyId: string;
};
export type UserRoleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserRoleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserRoleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    companyId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserRoleCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput> | Prisma.UserRoleCreateWithoutRoleInput[] | Prisma.UserRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutRoleInput | Prisma.UserRoleCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.UserRoleCreateManyRoleInputEnvelope;
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
};
export type UserRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput> | Prisma.UserRoleCreateWithoutRoleInput[] | Prisma.UserRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutRoleInput | Prisma.UserRoleCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.UserRoleCreateManyRoleInputEnvelope;
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
};
export type UserRoleUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput> | Prisma.UserRoleCreateWithoutRoleInput[] | Prisma.UserRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutRoleInput | Prisma.UserRoleCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput | Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.UserRoleCreateManyRoleInputEnvelope;
    set?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    disconnect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    delete?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    update?: Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput | Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput | Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
};
export type UserRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput> | Prisma.UserRoleCreateWithoutRoleInput[] | Prisma.UserRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutRoleInput | Prisma.UserRoleCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput | Prisma.UserRoleUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.UserRoleCreateManyRoleInputEnvelope;
    set?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    disconnect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    delete?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    update?: Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput | Prisma.UserRoleUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput | Prisma.UserRoleUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
};
export type UserRoleCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput> | Prisma.UserRoleCreateWithoutUserInput[] | Prisma.UserRoleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutUserInput | Prisma.UserRoleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserRoleCreateManyUserInputEnvelope;
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
};
export type UserRoleUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput> | Prisma.UserRoleCreateWithoutUserInput[] | Prisma.UserRoleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutUserInput | Prisma.UserRoleCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserRoleCreateManyUserInputEnvelope;
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
};
export type UserRoleUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput> | Prisma.UserRoleCreateWithoutUserInput[] | Prisma.UserRoleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutUserInput | Prisma.UserRoleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput | Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserRoleCreateManyUserInputEnvelope;
    set?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    disconnect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    delete?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    update?: Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput | Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserRoleUpdateManyWithWhereWithoutUserInput | Prisma.UserRoleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
};
export type UserRoleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput> | Prisma.UserRoleCreateWithoutUserInput[] | Prisma.UserRoleUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRoleCreateOrConnectWithoutUserInput | Prisma.UserRoleCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput | Prisma.UserRoleUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserRoleCreateManyUserInputEnvelope;
    set?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    disconnect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    delete?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    connect?: Prisma.UserRoleWhereUniqueInput | Prisma.UserRoleWhereUniqueInput[];
    update?: Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput | Prisma.UserRoleUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserRoleUpdateManyWithWhereWithoutUserInput | Prisma.UserRoleUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
};
export type UserRoleCreateWithoutRoleInput = {
    id?: string;
    companyId: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutRolesInput;
};
export type UserRoleUncheckedCreateWithoutRoleInput = {
    id?: string;
    userId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleCreateOrConnectWithoutRoleInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput>;
};
export type UserRoleCreateManyRoleInputEnvelope = {
    data: Prisma.UserRoleCreateManyRoleInput | Prisma.UserRoleCreateManyRoleInput[];
    skipDuplicates?: boolean;
};
export type UserRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserRoleUpdateWithoutRoleInput, Prisma.UserRoleUncheckedUpdateWithoutRoleInput>;
    create: Prisma.XOR<Prisma.UserRoleCreateWithoutRoleInput, Prisma.UserRoleUncheckedCreateWithoutRoleInput>;
};
export type UserRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserRoleUpdateWithoutRoleInput, Prisma.UserRoleUncheckedUpdateWithoutRoleInput>;
};
export type UserRoleUpdateManyWithWhereWithoutRoleInput = {
    where: Prisma.UserRoleScalarWhereInput;
    data: Prisma.XOR<Prisma.UserRoleUpdateManyMutationInput, Prisma.UserRoleUncheckedUpdateManyWithoutRoleInput>;
};
export type UserRoleScalarWhereInput = {
    AND?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
    OR?: Prisma.UserRoleScalarWhereInput[];
    NOT?: Prisma.UserRoleScalarWhereInput | Prisma.UserRoleScalarWhereInput[];
    id?: Prisma.StringFilter<"UserRole"> | string;
    userId?: Prisma.StringFilter<"UserRole"> | string;
    roleId?: Prisma.StringFilter<"UserRole"> | string;
    companyId?: Prisma.StringFilter<"UserRole"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserRole"> | Date | string;
};
export type UserRoleCreateWithoutUserInput = {
    id?: string;
    companyId: string;
    createdAt?: Date | string;
    role: Prisma.RoleCreateNestedOneWithoutUsersInput;
};
export type UserRoleUncheckedCreateWithoutUserInput = {
    id?: string;
    roleId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleCreateOrConnectWithoutUserInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput>;
};
export type UserRoleCreateManyUserInputEnvelope = {
    data: Prisma.UserRoleCreateManyUserInput | Prisma.UserRoleCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserRoleUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserRoleUpdateWithoutUserInput, Prisma.UserRoleUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserRoleCreateWithoutUserInput, Prisma.UserRoleUncheckedCreateWithoutUserInput>;
};
export type UserRoleUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserRoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserRoleUpdateWithoutUserInput, Prisma.UserRoleUncheckedUpdateWithoutUserInput>;
};
export type UserRoleUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserRoleScalarWhereInput;
    data: Prisma.XOR<Prisma.UserRoleUpdateManyMutationInput, Prisma.UserRoleUncheckedUpdateManyWithoutUserInput>;
};
export type UserRoleCreateManyRoleInput = {
    id?: string;
    userId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutRolesNestedInput;
};
export type UserRoleUncheckedUpdateWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleUncheckedUpdateManyWithoutRoleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleCreateManyUserInput = {
    id?: string;
    roleId: string;
    companyId: string;
    createdAt?: Date | string;
};
export type UserRoleUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    role?: Prisma.RoleUpdateOneRequiredWithoutUsersNestedInput;
};
export type UserRoleUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    roleId?: Prisma.StringFieldUpdateOperationsInput | string;
    companyId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserRoleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    roleId?: boolean;
    companyId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRole"]>;
export type UserRoleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    roleId?: boolean;
    companyId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRole"]>;
export type UserRoleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    roleId?: boolean;
    companyId?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRole"]>;
export type UserRoleSelectScalar = {
    id?: boolean;
    userId?: boolean;
    roleId?: boolean;
    companyId?: boolean;
    createdAt?: boolean;
};
export type UserRoleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "roleId" | "companyId" | "createdAt", ExtArgs["result"]["userRole"]>;
export type UserRoleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type UserRoleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type UserRoleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type $UserRolePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserRole";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        role: Prisma.$RolePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        roleId: string;
        companyId: string;
        createdAt: Date;
    }, ExtArgs["result"]["userRole"]>;
    composites: {};
};
export type UserRoleGetPayload<S extends boolean | null | undefined | UserRoleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserRolePayload, S>;
export type UserRoleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserRoleCountAggregateInputType | true;
};
export interface UserRoleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserRole'];
        meta: {
            name: 'UserRole';
        };
    };
    findUnique<T extends UserRoleFindUniqueArgs>(args: Prisma.SelectSubset<T, UserRoleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserRoleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserRoleFindFirstArgs>(args?: Prisma.SelectSubset<T, UserRoleFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserRoleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserRoleFindManyArgs>(args?: Prisma.SelectSubset<T, UserRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserRoleCreateArgs>(args: Prisma.SelectSubset<T, UserRoleCreateArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserRoleCreateManyArgs>(args?: Prisma.SelectSubset<T, UserRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserRoleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserRoleDeleteArgs>(args: Prisma.SelectSubset<T, UserRoleDeleteArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserRoleUpdateArgs>(args: Prisma.SelectSubset<T, UserRoleUpdateArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserRoleDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserRoleUpdateManyArgs>(args: Prisma.SelectSubset<T, UserRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserRoleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserRoleUpsertArgs>(args: Prisma.SelectSubset<T, UserRoleUpsertArgs<ExtArgs>>): Prisma.Prisma__UserRoleClient<runtime.Types.Result.GetResult<Prisma.$UserRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserRoleCountArgs>(args?: Prisma.Subset<T, UserRoleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserRoleCountAggregateOutputType> : number>;
    aggregate<T extends UserRoleAggregateArgs>(args: Prisma.Subset<T, UserRoleAggregateArgs>): Prisma.PrismaPromise<GetUserRoleAggregateType<T>>;
    groupBy<T extends UserRoleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserRoleGroupByArgs['orderBy'];
    } : {
        orderBy?: UserRoleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserRoleFieldRefs;
}
export interface Prisma__UserRoleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    role<T extends Prisma.RoleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoleDefaultArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserRoleFieldRefs {
    readonly id: Prisma.FieldRef<"UserRole", 'String'>;
    readonly userId: Prisma.FieldRef<"UserRole", 'String'>;
    readonly roleId: Prisma.FieldRef<"UserRole", 'String'>;
    readonly companyId: Prisma.FieldRef<"UserRole", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserRole", 'DateTime'>;
}
export type UserRoleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where: Prisma.UserRoleWhereUniqueInput;
};
export type UserRoleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where: Prisma.UserRoleWhereUniqueInput;
};
export type UserRoleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithRelationInput | Prisma.UserRoleOrderByWithRelationInput[];
    cursor?: Prisma.UserRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserRoleScalarFieldEnum | Prisma.UserRoleScalarFieldEnum[];
};
export type UserRoleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithRelationInput | Prisma.UserRoleOrderByWithRelationInput[];
    cursor?: Prisma.UserRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserRoleScalarFieldEnum | Prisma.UserRoleScalarFieldEnum[];
};
export type UserRoleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where?: Prisma.UserRoleWhereInput;
    orderBy?: Prisma.UserRoleOrderByWithRelationInput | Prisma.UserRoleOrderByWithRelationInput[];
    cursor?: Prisma.UserRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserRoleScalarFieldEnum | Prisma.UserRoleScalarFieldEnum[];
};
export type UserRoleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserRoleCreateInput, Prisma.UserRoleUncheckedCreateInput>;
};
export type UserRoleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserRoleCreateManyInput | Prisma.UserRoleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserRoleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    data: Prisma.UserRoleCreateManyInput | Prisma.UserRoleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserRoleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserRoleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserRoleUpdateInput, Prisma.UserRoleUncheckedUpdateInput>;
    where: Prisma.UserRoleWhereUniqueInput;
};
export type UserRoleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserRoleUpdateManyMutationInput, Prisma.UserRoleUncheckedUpdateManyInput>;
    where?: Prisma.UserRoleWhereInput;
    limit?: number;
};
export type UserRoleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserRoleUpdateManyMutationInput, Prisma.UserRoleUncheckedUpdateManyInput>;
    where?: Prisma.UserRoleWhereInput;
    limit?: number;
    include?: Prisma.UserRoleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserRoleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where: Prisma.UserRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserRoleCreateInput, Prisma.UserRoleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserRoleUpdateInput, Prisma.UserRoleUncheckedUpdateInput>;
};
export type UserRoleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
    where: Prisma.UserRoleWhereUniqueInput;
};
export type UserRoleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserRoleWhereInput;
    limit?: number;
};
export type UserRoleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserRoleSelect<ExtArgs> | null;
    omit?: Prisma.UserRoleOmit<ExtArgs> | null;
    include?: Prisma.UserRoleInclude<ExtArgs> | null;
};
