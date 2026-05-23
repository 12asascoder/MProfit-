import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TenantService } from '../tenant/tenant.service';
import { PanVerificationDto } from './dto/pan-verification.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private tenantService;
    private readonly logger;
    private otpStore;
    constructor(prisma: PrismaService, jwtService: JwtService, tenantService: TenantService);
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
