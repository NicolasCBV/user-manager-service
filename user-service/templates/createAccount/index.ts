import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';

const source = readFileSync(
  '/usr/app/templates/createAccount/createAccount.html',
  'utf-8',
);

const template = handlebars.compile(source);

interface Props {
  name: string;
  code: string;
}

export function createUserTemplate(data: Props) {
  return template(data);
}
