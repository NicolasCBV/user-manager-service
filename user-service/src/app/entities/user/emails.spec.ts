import { Email } from './email';

describe('Email test', () => {
  it('should create email class', () => {
    const email = new Email('default email');

    expect(email).toBeInstanceOf(Email);
  });

  it('should throw one error: Length error', () => {
    expect(() => new Email('12345')).toThrow();
    expect(() => new Email('a'.repeat(257))).toThrow();
  });
});
