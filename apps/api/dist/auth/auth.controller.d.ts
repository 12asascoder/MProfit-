import { AuthService } from './auth.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    initiatePanVerification(dto: PanVerificationDto): Promise<{
        referenceId: string;
        message: string;
        expiresIn: number;
        isExistingUser: boolean;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            kycStatus: import(".prisma/client").$Enums.KYCStatus;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
}
