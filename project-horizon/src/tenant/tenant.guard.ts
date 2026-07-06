import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.tenantId) {
      throw new ForbiddenException('Tenant not found');
    }
    // Attach tenant filter to request for automatic query scoping
    request.tenantId = user.tenantId;
    return true;
  }
}
