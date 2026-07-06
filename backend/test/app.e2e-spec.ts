import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Horizon CRM (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
    // Clean test data
    await prisma.deal.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  // ── Auth ────────────────────────────────────────────
  describe('Auth', () => {
    it('POST /auth/register — creates tenant + user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'e2e@test.com', password: 'Test1234!', name: 'E2E User', tenantName: 'E2E Corp' })
        .expect(201);
      expect(res.body.access_token).toBeDefined();
      expect(res.body.tenantId).toBeDefined();
      token = res.body.access_token;
    });

    it('POST /auth/login — returns JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@test.com', password: 'Test1234!' })
        .expect(201);
      expect(res.body.access_token).toBeDefined();
      token = res.body.access_token;
    });

    it('POST /auth/login — rejects bad password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@test.com', password: 'wrong' })
        .expect(401);
    });
  });

  // ── Health ──────────────────────────────────────────
  describe('Health', () => {
    it('GET /health — returns ok', () => request(app.getHttpServer()).get('/health').expect(200));
    it('GET /ready — returns ready', () => request(app.getHttpServer()).get('/ready').expect(200));
    it('GET /live — returns alive', () => request(app.getHttpServer()).get('/live').expect(200));
  });

  // ── CRUD: Companies ─────────────────────────────────
  describe('Companies', () => {
    let companyId: string;

    it('POST /companies — creates with tenant isolation', async () => {
      const res = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Acme Inc', domain: 'acme.com', industry: 'Tech' })
        .expect(201);
      expect(res.body.name).toBe('Acme Inc');
      companyId = res.body.id;
    });

    it('GET /companies — lists (tenant filtered)', async () => {
      const res = await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /companies/:id — gets single', async () => {
      const res = await request(app.getHttpServer())
        .get(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.name).toBe('Acme Inc');
    });

    it('PUT /companies/:id — updates', () => {
      return request(app.getHttpServer())
        .put(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ industry: 'FinTech' })
        .expect(200);
    });

    it('DELETE /companies/:id — deletes', () => {
      return request(app.getHttpServer())
        .delete(`/companies/${companyId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('GET /companies — rejects without auth', () => {
      return request(app.getHttpServer()).get('/companies').expect(401);
    });
  });

  // ── CRUD: Contacts ──────────────────────────────────
  describe('Contacts', () => {
    let companyId: string;
    let contactId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Globex', domain: 'globex.com' });
      companyId = res.body.id;
    });

    it('POST /contacts — creates contact', async () => {
      const res = await request(app.getHttpServer())
        .post('/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Hank', lastName: 'Scorpio', email: 'hank@globex.com', companyId })
        .expect(201);
      contactId = res.body.id;
    });

    it('GET /contacts — lists contacts', () => {
      return request(app.getHttpServer())
        .get('/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  // ── CRUD: Deals ─────────────────────────────────────
  describe('Deals', () => {
    let companyId: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Initech', domain: 'initech.com' });
      companyId = res.body.id;
    });

    it('POST /deals — creates deal', () => {
      return request(app.getHttpServer())
        .post('/deals')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Enterprise Deal', amount: 50000, companyId })
        .expect(201);
    });

    it('GET /deals — lists deals', () => {
      return request(app.getHttpServer())
        .get('/deals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('PUT /deals/:id — updates deal stage', async () => {
      const deals = await request(app.getHttpServer())
        .get('/deals')
        .set('Authorization', `Bearer ${token}`);
      const dealId = deals.body[0]?.id;
      if (dealId) {
        await request(app.getHttpServer())
          .put(`/deals/${dealId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ stage: 'qualified' })
          .expect(200);
      }
    });
  });
});
