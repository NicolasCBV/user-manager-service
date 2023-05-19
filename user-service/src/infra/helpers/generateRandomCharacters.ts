export function generateRandomCharacters(limit = 7): string {
  const code: string[] = [];

  for (let i = 0; i < limit; i++) {
    const number = Math.floor(Math.random() * 36);
    const letter = number.toString(36);
    code.push(letter);
  }

  const otp = code.join(',').replaceAll(',', '').toLocaleUpperCase();

  return otp;
}
