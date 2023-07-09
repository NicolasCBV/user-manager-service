import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';

const lang = process.env.LANG as string;
let source: string | undefined;
export let forgotPasswordRecommendedTitle: string | undefined;

switch(lang) {
  case 'PT_br':
    source = readFileSync('/usr/app/templates/forgotPassword/forgotPassword.pt_br.html', 'utf-8');
    forgotPasswordRecommendedTitle = 'Verificação de duas etapas';
    break;

  case 'English':
    source = readFileSync('/usr/app/templates/forgotPassword/forgotPassword.eng.html', 'utf-8');
    forgotPasswordRecommendedTitle = 'Two factors step';
    break;

  default:
    throw new Error('The language was not defined!');
}

const template = handlebars.compile(source);

interface Props {
  name: string;
  link: string;
}

export function forgotPasswordTemplate(data: Props) {
  return template(data);
}
