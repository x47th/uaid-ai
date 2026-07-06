import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: { email: string; password: string; name: string; tenantName: string }) {
    return this.auth.register(dto.email, dto.password, dto.name, dto.tenantName);
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.auth.login(dto.email, dto.password);
  }
}
