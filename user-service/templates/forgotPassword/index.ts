import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const lang = process.env.LANG as string;
let source: string | undefined;
export let forgotPasswordRecommendedTitle: string | undefined;

const project_dir = __dirname.split(/\/user-service(?!.*\/user-service)/)[0];

switch (lang) {
  case 'PT_br':
    source = readFileSync(
      join(project_dir + '/user-service/templates/forgotPassword/forgotPassword.pt_br.html'),
      'utf-8',
    );
    forgotPasswordRecommendedTitle = 'Verificação de duas etapas';
    break;

  case 'English':
    source = readFileSync(
      join(project_dir + '/user-service/templates/forgotPassword/forgotPassword.pt_br.html'),
      'utf-8',
    );
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
