import { Module } from '@nestjs/common';
import { EmailController } from './presentation/email.controller';

@Module({
  controllers: [EmailController],
})
export class EmailModule {}
