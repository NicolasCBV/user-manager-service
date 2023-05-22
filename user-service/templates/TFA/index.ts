import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';

const source = readFileSync('/usr/app/templates/TFA/TFA.html', 'utf-8');

const template = handlebars.compile(source);

interface Props {
  name: string;
  code: string;
}

export function TFATemplate(data: Props) {
  return template(data);
}
