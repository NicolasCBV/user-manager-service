import { LengthError } from '../DefaultErrors';

export class Name {
  private name: string;

  private CheckData() {
    return this.name.length >= 2 && this.name.length <= 64;
  }

  constructor(name: string) {
    this.name = name;

    const result = this.CheckData();

    if (!result) LengthError('name');
  }

  get value(): string {
    return this.name;
  }
}
