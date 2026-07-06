import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  }

  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', database: 'connected' };
    } catch {
      return { status: 'not ready', database: 'disconnected' };
    }
  }

  @Get('live')
  live() {
    return { status: 'alive' };
  }
}
