import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
  private client1: number = -1;
  private client2: number = -1;

  getClient1(): number {
    return this.client1;
  }

  getClient2(): number {
    return this.client2;
  }

  updateClient1(newValue: number): void {
    this.client1 = newValue;
  }

  updateClient2(newValue: number): void {
    this.client2 = newValue;
  }
}