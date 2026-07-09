import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/enums/role.enum';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
