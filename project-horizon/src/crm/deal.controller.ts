import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('deals')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class DealController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.prisma.deal.findMany({ where: { tenantId: req.tenantId }, include: { company: true, contact: true } });
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.prisma.deal.findFirst({ where: { id, tenantId: req.tenantId }, include: { company: true, contact: true } });
  }

  @Post()
  async create(@Req() req: any, @Body() dto: { name: string; amount?: number; stage?: string; companyId: string; contactId?: string }) {
    return this.prisma.deal.create({ data: { ...dto, tenantId: req.tenantId } });
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    await this.prisma.deal.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.deal.update({ where: { id }, data: dto });
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.prisma.deal.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.deal.delete({ where: { id } });
  }
}
