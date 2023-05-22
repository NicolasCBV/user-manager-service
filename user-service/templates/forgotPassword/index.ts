import { readFileSync } from 'node:fs';
import Handlebars from 'handlebars';

const source = readFileSync(
  '/usr/app/templates/forgotPassword/forgotPassword.html',
  'utf-8',
);

const template = Handlebars.compile(source);

interface Props {
  name: string;
  link: string;
}

export function forgotPasswordTemplate(data: Props) {
  return template(data);
}
