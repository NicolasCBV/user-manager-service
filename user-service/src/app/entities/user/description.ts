import { LengthError } from '../DefaultErrors';

export class Description {
  private description: string;

  private CheckData() {
    return this.description.length >= 2 && this.description.length <= 256;
  }

  constructor(description: string) {
    this.description = description;

    const result = this.CheckData();

    if (!result) LengthError('description');
  }

  get value(): string {
    return this.description;
  }
}
