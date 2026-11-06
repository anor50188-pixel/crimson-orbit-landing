import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';
import uz from './uz';
import ru from './ru';
import en from './en';
import { dictionaryDifferences, interpolate, pluralCategory } from './core';

describe('three-language contract', () => {
  it('requires identical Uzbek, Russian and English key sets', () => deepStrictEqual(dictionaryDifferences({ uz, ru, en }), []));
  it('detects a missing translated key', () => deepStrictEqual(dictionaryDifferences({ uz: { name: 'Nom' }, ru: {}, en: { name: 'Name' } }), ['ru: name']));
  it('substitutes the requested name variable', () => strictEqual(interpolate('Hello, {name}', { name: 'Anor' }), 'Hello, Anor'));
  it('supports Russian one/few/many/other grammar', () => deepStrictEqual([1,3,5,1.5].map(n => pluralCategory('ru', n)), ['one','few','many','other']));
  it('supports Uzbek one and other grammar', () => deepStrictEqual([1,3].map(n => pluralCategory('uz', n)), ['one','other']));
  it('supports English one and other grammar', () => deepStrictEqual([1,3].map(n => pluralCategory('en', n)), ['one','other']));
});