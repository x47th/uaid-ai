import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyController } from './company.controller';
import { ContactController } from './contact.controller';
import { DealController } from './deal.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController, ContactController, DealController],
})
export class CrmModule {}
