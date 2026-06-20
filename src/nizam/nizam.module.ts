import { Module } from '@nestjs/common';
import { ShezanModule } from './shezan/shezan.module';

@Module({
  imports: [ShezanModule]
})
export class NizamModule {}
