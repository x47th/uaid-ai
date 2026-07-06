import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantGuard } from '../tenant/tenant.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('contacts')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class ContactController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Req() req: any) {
    return this.prisma.contact.findMany({ where: { tenantId: req.tenantId }, include: { company: true } });
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.prisma.contact.findFirst({ where: { id, tenantId: req.tenantId }, include: { company: true } });
  }

  @Post()
  async create(@Req() req: any, @Body() dto: { firstName: string; lastName: string; email?: string; phone?: string; title?: string; companyId: string }) {
    return this.prisma.contact.create({ data: { ...dto, tenantId: req.tenantId } });
  }

  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: any) {
    await this.prisma.contact.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.prisma.contact.findFirstOrThrow({ where: { id, tenantId: req.tenantId } });
    return this.prisma.contact.delete({ where: { id } });
  }
}
