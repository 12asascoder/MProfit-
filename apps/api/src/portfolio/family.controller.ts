import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { FamilyGroupService } from './family.service';

@Controller('family')
export class FamilyGroupController {
  constructor(private readonly familyService: FamilyGroupService) {}

  @Post()
  async create(@Req() req: any, @Body('name') name: string) {
    return this.familyService.create(req.user.userId, req.user.tenantId, name);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Req() req: any,
    @Body('userId') memberUserId: string,
    @Body('relationship') relationship: string
  ) {
    return this.familyService.addMember(id, req.user.userId, memberUserId, relationship);
  }

  @Get(':id/portfolios')
  async getFamilyPortfolios(@Param('id') id: string, @Req() req: any) {
    return this.familyService.getFamilyPortfolios(id, req.user.userId);
  }
}
