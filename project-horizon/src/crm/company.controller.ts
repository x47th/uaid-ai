import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('companies')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class CompanyController {
  constructor(private prisma: PrismaService, private ai: AIService) {}

  @Get()
  async findAll(@Req() req: any, @Query('skip') skip?: string, @Query('take') take?: string, @Query('search') search?: string) {
    const where: any = { tenantId: req.tenantId };
    if (search) where.name = { contains: search };
    return this.prisma.company.findMany({
      where, include: { contacts: true, deals: true },
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : 20,
    });
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.prisma.company.findFirst({ where: { id, tenantId: req.tenantId }, include: { contacts: true, deals: true } });
  }

  @Post()
  async create(@Req() req: any, @Body() dto: { name: string; domain?: string; industry?: string; size?: string }) {
    return this.prisma.company.create({ data: { ...dto, tenantId: req.tenantId } });
  }

  @Post(':id/enrich')
  async enrich(@Req() req: any, @Param('id') id: string) {
    const company = await this.prisma.company.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    const enriched = await this.ai.enrichCompany(company.name, company.domain || undefined);
    return this.prisma.company.update({
      where: { id },
      data: { industry: enriched.industry, size: enriched.size, enrichedBy: 'deepseek', enrichedAt: new Date() },
    });
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    await this.prisma.company.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.prisma.company.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.company.delete({ where: { id } });
  }
}
