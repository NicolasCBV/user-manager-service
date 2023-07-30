import { OnApplicationShutdown, OnModuleDestroy } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TypeORMService extends DataSource implements OnModuleDestroy, OnApplicationShutdown {
  async onModuleDestroy() {
    if(this.isInitialized) this.destroy();
  }

  async onApplicationShutdown() {
    if(this.isInitialized) this.destroy();
  }
}
