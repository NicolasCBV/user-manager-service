import { Password } from './password';

describe('Password test', () => {
  it('should create password class', () => {
    const password = new Password('default password');

    expect(password).toBeInstanceOf(Password);
  });

  it('should throw one error: Length error', () => {
    expect(() => new Password('a'.repeat(5))).toThrow();
    expect(() => new Password('a'.repeat(257))).toThrow();
  });
});
