import { Global, Module } from '@nestjs/common';
import { PrismaService } from './Prisma.Service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
