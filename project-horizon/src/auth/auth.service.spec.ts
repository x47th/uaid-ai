import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: () => 'test-token' },
        },
        {
          provide: PrismaService,
          useValue: {
            tenant: { create: async (d: any) => ({ id: 't1', name: d.data.name }) },
            user: {
              create: async (d: any) => ({ id: 'u1', ...d.data, password: 'hashed' }),
              findUnique: async () => ({ id: 'u1', email: 'test@test.com', password: '$2b$10$hashedhash', tenantId: 't1' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await service.register('new@test.com', 'pass', 'Test', 'Corp');
    expect(result.access_token).toBe('test-token');
    expect(result.tenantId).toBe('t1');
  });
});
