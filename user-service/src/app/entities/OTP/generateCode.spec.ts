function generateCode(): string {
  const code: string[] = [];

  for (let i = 0; i < 7; i++) {
    const number = Math.floor(Math.random() * 36);
    const letter = number.toString(36);
    code.push(letter);
  }

  const otp = code.join(',').replaceAll(',', '').toLocaleUpperCase();

  return otp;
}

describe('Generate code test', () => {
  it('should create a code', () => {
    expect(generateCode()).toHaveLength(7);
  });
});
