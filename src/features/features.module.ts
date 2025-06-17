import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, AuthModule],
})
export class FeaturesModule {}