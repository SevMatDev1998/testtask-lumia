import { AuthService } from "./auth.service";
import { VerifySessionDto } from "./dto/verify-session.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    verifySession(dto: VerifySessionDto): Promise<{
        userId: string;
        walletAddress: string;
        session: any;
    }>;
}
