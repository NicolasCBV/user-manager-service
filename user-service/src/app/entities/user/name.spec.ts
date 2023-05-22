import { Name } from './name';

describe('Name test', () => {
  it('should create name class', () => {
    const name = new Name('default name');

    expect(name).toBeInstanceOf(Name);
  });

  it('should throw one error: Length error', () => {
    expect(() => new Name('a')).toThrow();
    expect(() => new Name('a'.repeat(65))).toThrow();
  });
});
