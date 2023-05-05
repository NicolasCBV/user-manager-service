import { Module } from '@nestjs/common';
import { ImageContract } from './contracts/imageContract';
import { FirebaseAPI } from './firebase';

@Module({
  providers: [
    {
      provide: ImageContract,
      useClass: FirebaseAPI,
    },
  ],
  exports: [ImageContract],
})
export class ApiModule {}
