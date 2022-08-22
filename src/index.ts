import { readFileSync } from 'fs';
import { join } from 'path';
import { read } from '~/markdown/read';

const root = process.cwd();
const path = join(root, 'markdown/chapters/meandeck/basics.md');
const buffer = readFileSync(path, 'utf-8');
read(buffer);
