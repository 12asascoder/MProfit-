import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class PanVerificationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format. Expected: ABCDE1234F',
  })
  pan: string;

  @IsString()
  @IsNotEmpty()
  tenantSlug: string;
}
