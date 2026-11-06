import ts from 'typescript';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import uz from '../src/i18n/uz';
import ru from '../src/i18n/ru';
import en from '../src/i18n/en';
import { dictionaryDifferences, flatten } from '../src/i18n/core';

const problems = dictionaryDifferences({ uz, ru, en });
const defined = flatten(uz);
function scan(directory: string) {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) { scan(path); continue; }
    if (!/\.tsx?$/.test(path) || path.includes('/i18n/')) continue;
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ['t','translate'].includes(node.expression.getText(source))) {
        const key = node.arguments[0];
        if (key && ts.isStringLiteral(key) && !(key.text in defined)) problems.push(`${path}: ${key.text}`);
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
}
scan('src');
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`i18n OK: ${Object.keys(defined).length} matching keys in uz, ru and en; all literal references defined.`);