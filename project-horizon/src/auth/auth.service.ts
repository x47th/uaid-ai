import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string, tenantName: string) {
    const hash = await bcrypt.hash(password, 10);
    const tenant = await this.prisma.tenant.create({ data: { name: tenantName } });
    const user = await this.prisma.user.create({
      data: { email, password: hash, name, tenantId: tenant.id },
    });
    return this.token(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.token(user);
  }

  private token(user: any) {
    const payload = { sub: user.id, email: user.email, tenantId: user.tenantId };
    return { access_token: this.jwt.sign(payload), tenantId: user.tenantId };
  }
}
