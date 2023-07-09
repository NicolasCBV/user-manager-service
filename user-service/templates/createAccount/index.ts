import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';

const lang = process.env.LANG as string;
let source: string | undefined;
export let createAccountRecommendedTitle: string | undefined;

switch(lang) {
  case 'PT_br':
    source = readFileSync('/usr/app/templates/createAccount/createAccount.pt_br.html', 'utf-8');
    createAccountRecommendedTitle = 'Verificação de duas etapas';
    break;

  case 'English':
    source = readFileSync('/usr/app/templates/createAccount/createAccount.eng.html', 'utf-8');
    createAccountRecommendedTitle = 'Two factors step';
    break;

  default:
    throw new Error('The language was not defined!');
}

const template = handlebars.compile(source);

interface Props {
  name: string;
  code: string;
}

export function createUserTemplate(data: Props) {
  return template(data);
}
