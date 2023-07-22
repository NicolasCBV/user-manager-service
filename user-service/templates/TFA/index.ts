import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';
import * as dotenv from 'dotenv';

dotenv.config();

const lang = process.env.LANG as string;
let source: string | undefined;
export let TFARecommendedTitle: string | undefined;

switch(lang) {
  case 'PT_br':
    source = readFileSync('/usr/app/templates/TFA/TFA.pt_br.html', 'utf-8');
    TFARecommendedTitle = 'Verificação de duas etapas';
    break;

  case 'English':
    source = readFileSync('/usr/app/templates/TFA/TFA.eng.html', 'utf-8');
    TFARecommendedTitle = 'Two factors step';
    break;

  default:
    throw new Error('The language was not defined!');
}

const template = handlebars.compile(source);

interface Props {
  name: string;
  code: string;
}

export function TFATemplate(data: Props) {
  return template(data);
}
