import { LengthError } from '../DefaultErrors';

export class Email {
  private email: string;

  private CheckData() {
    return this.email.length >= 6 && this.email.length <= 256;
  }

  constructor(email: string) {
    this.email = email;

    const result = this.CheckData();

    if (!result) LengthError('email');
  }

  get value(): string {
    return this.email;
  }
}
