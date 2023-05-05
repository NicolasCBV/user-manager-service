import { Description } from './description';

describe('Description test', () => {
  it('should create description class', () => {
    const description = new Description('default description');

    expect(description).toBeInstanceOf(Description);
  });

  it('should throw one error: Length error', () => {
    expect(() => new Description('a')).toThrow();
    expect(() => new Description('a'.repeat(257))).toThrow();
  });
});
