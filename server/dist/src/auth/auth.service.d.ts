import { PrismaService } from "../prisma/prisma.service";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    verifySessionToken(sessionToken: string): Promise<{
        userId: string;
        walletAddress: string;
        session: any;
    }>;
}
