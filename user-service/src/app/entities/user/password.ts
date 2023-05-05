import { LengthError } from '../DefaultErrors';

export class Password {
  private password: string;

  private CheckData() {
    return this.password.length >= 6 && this.password.length <= 256;
  }

  constructor(password: string) {
    this.password = password;

    const result = this.CheckData();

    if (!result) LengthError('password');
  }

  get value(): string {
    return this.password;
  }
}
