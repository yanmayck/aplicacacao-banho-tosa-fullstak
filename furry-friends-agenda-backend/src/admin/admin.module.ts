import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompanyUsersController } from './company-users.controller';
import { CompanySettingsController } from './company-settings.controller';

@Module({
  controllers: [
    CompaniesController,
    CompanyUsersController,
    CompanySettingsController,
  ],
})
export class AdminModule {}
