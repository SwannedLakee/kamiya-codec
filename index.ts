import {lookup} from './hiragana';

export const conjugations =
    ['Negative', 'Conjunctive', 'Dictionary', 'Conditional', 'Imperative', 'Volitional', 'Te', 'Ta', 'Tara', 'Tari'] as
    const;
export type Conjugation = typeof conjugations[number];

export const auxiliaries = [
  'Potential',
  'Masu',
  'Nai',
  'Tai',
  'Tagaru',
  'Hoshii',
  'Rashii',
  'SoudaHearsay',
  'SoudaConjecture',
  'SeruSaseru',
  'ShortenedCausative',
  'ReruRareu',
  'CausativePassive',
  'ShortenedCausativePassive',
  'Ageru', // Kamiya section 7.15
  'Sashiageru',
  'Yaru',
  'Morau', // Kamiya section 7.16
  'Itadaku',
  'Kureru', // Kamiya section 7.17
  'Kudasaru',
  'TeIruNoun', // 7.21
  'TeAruNoun', // 7.21
  'Miru',      // 7.22
  'Iku',       // 7.23
  'Kuru',      // 7.24
  'Oku',       // 7.25
  'Shimau',    // 7.26
] as const;
export type Auxiliary = typeof auxiliaries[number];

const specialCasesRaw: Array<[string, Conjugation, string]> = [
  ['ある', 'Negative', ''], // fully negative conjugation would be ''+nai
  ['ござる', 'Conjunctive', 'ござい'],
  ['いらっしゃる', 'Conjunctive', 'いらっしゃい'],
  ['いらっしゃる', 'Conditional', 'いらっしゃい'],
  ['いらっしゃる', 'Imperative', 'いらっしゃい'],
];
let specialCases: Map<string, Map<Conjugation, string>> = new Map([]);
for (const [verb, conj, result] of specialCasesRaw) {
  let outer = specialCases.get(verb);
  if (outer) {
    outer.set(conj, result);
  } else {
    specialCases.set(verb, new Map([[conj, result]]));
  }
}
const conjToIdx: Map<Conjugation, number> =
    new Map(conjugations.filter(x => x !== 'Imperative').map((x, i) => [x, i]) as Array<[Conjugation, number]>);

const tteRaw: Array<[string, string[]]> = [
  ['く', ['いて', 'いた', 'いたら', 'いたり']],
  ['ぐ', ['いで', 'いだ', 'いだら', 'いだり']],
  ['す', ['して', 'した', 'したら', 'したり']],
  ['ぬ', ['んで', 'んだ', 'んだら', 'んだり']],
  ['ぶ', ['んで', 'んだ', 'んだら', 'んだり']], // same as above
  ['む', ['んで', 'んだ', 'んだら', 'んだり']], // ditto
  ['つ', ['って', 'った', 'ったら', 'ったり']],
  ['る', ['って', 'った', 'ったら', 'ったり']], // same as above and below
  ['う', ['って', 'った', 'ったら', 'ったり']],
];
let tte: Map<string, string[]> = new Map([]);
for (const [tail, quad] of tteRaw) { tte.set(tail, quad); }

export function conjugateTypeI(verb: string, conj: Conjugation): string[] {
  {
    if (verb === 'する') {
      return conjugateSuru(verb, conj);
    } else if (verb === 'くる' || verb === '来る') {
      return conjugateKuru(verb, conj);
    } else if (verb.endsWith('くださる')) {
      if (conj === 'Dictionary') {
        return [verb];
      } else if (conj === 'Conjunctive') {
        return [verb.slice(0, -2) + 'さい'];
      } else {
        throw new Error('unknown conjugation for -kudasaru');
      }
    }
    const specialHit = specialCases.get(verb);
    if (specialHit && specialHit.has(conj)) { return [specialHit.get(conj) || '']; }
    // The above inner-most `get` is guaranteed to be not-undefined, so the empty string will never be returned, but
    // TypeScript 3.0.1 doesn't treat `Map.has` as a type guard 😣.
  }
  const head = verb.slice(0, -1);
  const tail = verb.slice(-1);
  const idx = conjToIdx.get(conj === 'Imperative' ? 'Conditional' : conj);
  if (typeof idx === 'undefined') { throw new Error('Conjugation not yet implemented'); }
  if (idx < 5) {
    if (tail === 'う') {
      if (idx === 0) { return [head + 'わ']; }
      return [head + lookup('あ', idx)];
    }
    return [head + lookup(tail, idx)];
  }
  const tidx = idx - 5;
  const tteHit = tte.get((verb === '行く' || verb === 'いく') ? 'つ' : tail);
  if (!tteHit) { throw new Error('Unknown verb ending. Is it in dictionary form?'); }
  return [head + tteHit[tidx]];
}

export function conjugateTypeII(verb: string, conj: Conjugation): string[] {
  if (verb === 'する') {
    return conjugateSuru(verb, conj);
  } else if (verb === 'くる' || verb === '来る') {
    return conjugateKuru(verb, conj);
  }
  const head = verb.slice(0, -1);
  switch (conj) {
  case 'Negative': return [head];
  case 'Conjunctive': return [head];
  case 'Dictionary': return [verb];
  case 'Conditional': return [head + 'れ'];
  case 'Imperative': return [head + 'ろ', head + 'よ'];
  case 'Volitional': return [head + 'よう'];
  case 'Te': return [head + 'て'];
  case 'Ta': return [head + 'た'];
  case 'Tara': return [head + 'たら'];
  case 'Tari': return [head + 'たり'];
  default: throw new Error('Unhandled conjugation');
  }
}

function conjugateKuru(verb: string, conj: Conjugation): string[] {
  let ret = '';
  switch (conj) {
  case 'Negative': ret = 'こ'; break;
  case 'Conjunctive': ret = 'き'; break;
  case 'Dictionary': ret = 'くる'; break;
  case 'Conditional': ret = 'くれ'; break;
  case 'Imperative': ret = 'こい'; break;
  case 'Volitional': ret = 'こよう'; break;
  case 'Te': ret = 'きて'; break;
  case 'Ta': ret = 'きた'; break;
  case 'Tara': ret = 'きたら'; break;
  case 'Tari': ret = 'きたり'; break;
  default: throw new Error('Unhandled conjugation');
  }
  const head = verb.slice(0, -1);
  if (head === 'く') {
    return [ret];
  } else if (head === '来') {
    return ['来' + ret.slice(1)];
  }
  throw new Error('Expected input to be 来る or くる');
}

function conjugateSuru(verb: string, conj: Conjugation): string[] {
  switch (conj) {
  case 'Negative': return ['し'];
  case 'Conjunctive': return ['し'];
  case 'Dictionary': return ['する'];
  case 'Conditional': return ['すれ'];
  case 'Imperative': return ['しろ', 'せよ'];
  case 'Volitional': return ['しよう'];
  case 'Te': return ['して'];
  case 'Ta': return ['した'];
  case 'Tara': return ['したら'];
  case 'Tari': return ['したり'];
  default: throw new Error('Unhandled conjugation');
  }
}

function conjugateStrict(verb: string, conj: Conjugation, typeII: boolean = false): string[] {
  return ((verb.slice(-1) === 'る' && typeII) ? conjugateTypeII : conjugateTypeI)(verb, conj);
}

export function conjugate(verb: string, conj: Conjugation, typeII = false): string[] {
  const ret = conjugateStrict(verb, conj, typeII);

  if (conj === 'Negative') {
    ret.push(ret[0] + 'ない');
  } else if (conj === 'Conjunctive') {
    ret.push(ret[0] + 'ます');
  } else if (conj === 'Conditional') {
    ret.push(ret[0] + 'ば');
  } else if (conj === 'Volitional') {
    ret.push(ret[0] + 'う');
  }

  return ret;
}

export function conjugateAuxiliaries(initialVerb: string, auxs: Auxiliary[], finalConj: Conjugation,
                                     initialTypeII: boolean = false): string[] {

  if (auxs.length === 0) { return conjugate(initialVerb, finalConj, initialTypeII); }

  let verbs: string[] = [initialVerb];
  let typeII = initialTypeII;
  for (const [auxIdx, aux] of auxs.entries()) {
    const conj: Conjugation = auxIdx === auxs.length - 1 ? finalConj : 'Dictionary';
    const prevAux: Auxiliary|undefined = auxs[auxIdx - 1];

    if (auxIdx !== auxs.length - 1 &&
        (aux === 'Masu' || aux === 'Nai' || aux === 'Tai' || aux == 'Hoshii' || aux === 'Rashii' ||
         aux === 'SoudaConjecture' || aux === 'SoudaHearsay' || aux === 'TeIruNoun' || aux === 'TeAruNoun')) {
      throw new Error('must be final auxiliary');
    }

    if (prevAux === 'Kuru') {
      // While `conjugate` looks for with Kudasaru with `endsWith`, it looks for Kuru with exact-compare (because
      // potentially lots of things could end in kuru)
      const heads = verbs.map(s => s.slice(0, -2));
      const tails = conjugateAuxiliary('くる', aux, conj);
      verbs = heads.flatMap(prefix => tails.map(t => prefix + t));
    } else {
      verbs = verbs.flatMap(verb => conjugateAuxiliary(verb, aux, conj, typeII));
    }
    typeII = aux === 'Potential' || aux === 'SeruSaseru' || aux === 'ReruRareu' || aux === 'CausativePassive' ||
             aux === 'ShortenedCausativePassive' || aux === 'Ageru' || aux === 'Sashiageru' || aux === 'Kureru' ||
             aux === 'Miru';
  }
  return verbs;
}

function conjugateAuxiliary(verb: string, aux: Auxiliary, conj: Conjugation, typeII: boolean = false): string[] {
  if (aux === 'Potential') {
    const newverb = conjugateTypeI(verb, 'Conditional')[0] + 'る';
    return conjugateTypeII(newverb, conj);
  } else if (aux === 'Masu') {
    const base = conjugate(verb, 'Conjunctive', typeII)[0];
    switch (conj) {
    case 'Negative': return [base + 'ません', base + 'ませんでした'];
    // case 'Conjunctive':
    case 'Dictionary': return [base + 'ます'];
    case 'Conditional': return [base + 'ますれば'];
    case 'Imperative': return [base + 'ませ', base + 'まし']; // latter only for nasaru and ossharu
    case 'Volitional': return [base + 'ましょう'];
    case 'Te': return [base + 'まして'];
    case 'Ta': return [base + 'ました'];
    case 'Tara': return [base + 'ましたら'];
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'Nai') {
    const base = conjugate(verb, 'Negative', typeII)[0];
    switch (conj) {
    case 'Negative': return [base + 'なくはない'];
    case 'Conjunctive': return [base + 'なく'];
    case 'Dictionary': return [base + 'ない'];
    case 'Conditional': return [base + 'なければ'];
    // case 'Imperative':
    // case 'Volitional':
    case 'Te': return [base + 'なくて'];
    case 'Ta': return [base + 'なかった'];
    case 'Tara': return [base + 'なかったら'];
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'Tai') {
    const base = conjugate(verb, 'Conjunctive', typeII)[0];
    switch (conj) {
    case 'Negative': return [base + 'たくない'];
    case 'Conjunctive': return [base + 'たく'];
    case 'Dictionary': return [base + 'たい'];
    case 'Conditional': return [base + 'たければ'];
    // case 'Imperative':
    // case 'Volitional':
    case 'Te': return [base + 'たくて'];
    case 'Ta': return [base + 'たかった'];
    case 'Tara': return [base + 'たかったら'];
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'Tagaru') {
    switch (conj) {
    case 'Conditional':
    case 'Imperative':
    case 'Volitional':
    case 'Tari': throw new Error('Unhandled conjugation');
    }
    const bases = conjugate(verb, 'Conjunctive', typeII);
    const tagaruConj = conjugate('たがる', conj, false);
    return tagaruConj.map(suffix => bases[0] + suffix);
  } else if (aux === 'Hoshii') {
    const base = conjugate(verb, 'Te', typeII)[0];
    switch (conj) {
    case 'Negative': return [base + 'ほしくない'];
    case 'Conjunctive': return [base + 'ほしく'];
    case 'Dictionary': return [base + 'ほしい'];
    case 'Conditional': return [base + 'ほしければ'];
    // case 'Imperative':
    // case 'Volitional':
    case 'Te': return [base + 'ほしくて'];
    case 'Ta': return [base + 'ほしかった'];
    case 'Tara': return [base + 'ほしかったら'];
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'Rashii') {
    const base1 = conjugate(verb, 'Ta', typeII)[0];
    const base2 = verb;
    const append = (suffix: string) => [base1, base2].map(prefix => prefix + suffix);
    switch (conj) {
    case 'Negative': const neg = conjugateAuxiliary(verb, 'Nai', 'Dictionary')[0]; return [neg + 'らしい'];
    case 'Conjunctive': return append('らしく');
    case 'Dictionary': return append('らしい');
    // case 'Conditional':
    // case 'Imperative':
    // case 'Volitional':
    case 'Te': return append('らしくて');
    // case 'Ta':
    // case 'Tara':
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'SoudaHearsay') {
    const base1 = conjugate(verb, 'Ta', typeII)[0];
    const base2 = verb; // dictionary form
    const append = (suffix: string) => [base1, base2].map(prefix => prefix + suffix);
    switch (conj) {
    // case 'Negative':
    // case 'Conjunctive':
    case 'Dictionary': return append('そうだ');
    // case 'Conditional':
    // case 'Imperative':
    // case 'Volitional':
    // case 'Te':
    // case 'Ta':
    // case 'Tara':
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'SoudaConjecture') {
    const base = conjugate(verb, 'Conjunctive', typeII)[0];
    const append = (suffix: string) => [base + suffix];
    switch (conj) {
    // case 'Negative':
    // case 'Conjunctive':
    case 'Dictionary': return append('そうだ');
    case 'Conditional': return append('そうなら');
    // case 'Imperative':
    // case 'Volitional':
    // case 'Te':
    case 'Ta': return append('そうだった');
    // case 'Tara':
    // case 'Tari':
    default: throw new Error('Unhandled conjugation');
    }
  } else if (aux === 'SeruSaseru' || aux === 'ShortenedCausative') {
    if (conj === 'Tara' || conj === 'Tari') { throw new Error('Unhandled conjugation'); }
    let newverb;
    if (verb === '来る' || verb === 'くる') {
      newverb = (verb[0] === '来' ? '来' : 'こ') + 'させる';
    } else if (verb === 'する') {
      newverb = 'させる';
    } else if (typeII) {
      newverb = conjugateTypeII(verb, 'Negative')[0] + 'させる';
    } else { // type I
      newverb = conjugateTypeI(verb, 'Negative')[0] + 'せる';
    }
    if (aux === 'ShortenedCausative') {
      newverb = newverb.slice(0, -2) + 'す';
      return conjugate(newverb, conj, false);
    }
    return conjugate(newverb, conj, true);
  } else if (aux === 'ReruRareu') {
    if (conj === 'Conditional' || conj === 'Imperative' || conj === 'Volitional' || conj === 'Tara' ||
        conj === 'Tari') {
      throw new Error('Unhandled conjugation');
    }
    let newverb;
    if (verb === '来る' || verb === 'くる') {
      newverb = (verb[0] === '来' ? '来' : 'こ') + 'られる';
    } else if (verb === 'する') {
      newverb = 'される';
    } else if (typeII) {
      newverb = conjugateTypeII(verb, 'Negative')[0] + 'られる';
    } else { // type I
      newverb = conjugateTypeI(verb, 'Negative')[0] + 'れる';
    }
    return conjugate(newverb, conj, true);
  } else if (aux === 'CausativePassive') {
    const newverb = conjugateAuxiliary(verb, 'SeruSaseru', 'Negative', typeII)[0] + 'られる';
    return conjugate(newverb, conj, true);
  } else if (aux === 'ShortenedCausativePassive') {
    const newverb = conjugateAuxiliary(verb, 'ShortenedCausative', 'Negative', typeII)[0] + 'れる';
    return conjugate(newverb, conj, true);
  } else if (aux === 'Ageru' || aux === 'Sashiageru' || aux === 'Yaru' || aux === 'Morau' || aux === 'Itadaku' ||
             aux === 'Kureru' || aux === 'Kudasaru' || aux === 'TeIruNoun' || aux === 'TeAruNoun' || aux === 'Miru' ||
             aux === 'Iku' || aux === 'Kuru' || aux === 'Oku' || aux === 'Shimau') {
    const vte = conjugate(verb, 'Te', typeII)[0];
    const endings: string[] = aux === 'Ageru'        ? ['あげる']
                              : aux === 'Sashiageru' ? ['差し上げる', 'さしあげる']
                              : aux === 'Yaru'       ? ['やる']
                              : aux === 'Morau'      ? ['もらう']
                              : aux === 'Itadaku'    ? ['いただく']
                              : aux === 'Kureru'     ? ['くれる']
                              : aux === 'Kudasaru'   ? ['くださる']
                              : aux === 'TeIruNoun'  ? ['いる']
                              : aux === 'TeAruNoun'  ? ['ある']
                              : aux === 'Miru'       ? ['みる']
                              : aux === 'Iku'        ? ['いく']
                              : aux === 'Kuru'       ? ['くる']
                              : aux === 'Oku'        ? ['おく']
                              : aux === 'Shimau'     ? ['しまう']
                                                     : [aux];
    if (!endings[0]) { throw new Error('missing ternary'); }
    const endingTypeII: boolean =
        aux === 'Ageru' || aux === 'Sashiageru' || aux === 'Kureru' || aux === 'TeIruNoun' || aux === 'Miru';
    const newVerbs = endings.map(ending => vte + ending);
    return newVerbs.flatMap(v => conjugate(v, conj, endingTypeII));
  }
  isNever(aux);
  throw new Error('Unhandled auxiliary')
}
function isNever(x: never) { return x; }

export interface Deconjugated {
  auxiliaries: Auxiliary[];
  conjugation: Conjugation;
  result: string[];
}
export function verbDeconjugate(conjugated: string, dictionaryForm: string, typeII = false,
                                maxAuxDepth = Infinity): Deconjugated[] {
  const hits: Deconjugated[] = [];

  for (const conj of conjugations) {
    try {
      const result = conjugate(dictionaryForm, conj, typeII);
      if (result.includes(conjugated)) { hits.push({conjugation: conj, auxiliaries: [], result}) }
    } catch {}
  }

  if (maxAuxDepth <= 0) { return hits; }

  for (const aux of auxiliaries) {
    for (const conj of conjugations) {
      try {
        const result = conjugateAuxiliary(dictionaryForm, aux, conj, typeII);
        if (result.includes(conjugated)) { hits.push({conjugation: conj, auxiliaries: [aux], result}) }
      } catch {}
    }
  }

  if (maxAuxDepth <= 1) { return hits; }

  const penultimates: Auxiliary[] =
      ['Ageru', 'Sashiageru', 'Yaru', 'Morau', 'Itadaku', 'Kureru', 'Kudasaru', 'Miru', 'Iku', 'Kuru', 'Oku', 'Shimau'];
  const depth2Finals: Auxiliary[] = ['Masu'];
  for (const penultimate of penultimates) {
    for (const final of depth2Finals) {
      for (const conj of conjugations) {
        const auxs = [penultimate, final];
        try {
          const result = conjugateAuxiliaries(dictionaryForm, auxs, conj, typeII);
          if (result.includes(conjugated)) { hits.push({conjugation: conj, auxiliaries: auxs, result}); }
        } catch {}
      }
    }
  }

  if (maxAuxDepth <= 2) { return hits; }

  const antepenultimates: Auxiliary[] = ['SeruSaseru', 'ReruRareu'];
  const depth3Finals: Auxiliary[] = ['Masu'];
  for (const ante of antepenultimates) {
    for (const penultimate of penultimates) {
      for (const final of depth3Finals) {
        for (const conj of conjugations) {
          const auxs = [ante, penultimate, final];
          try {
            const result = conjugateAuxiliaries(dictionaryForm, auxs, conj, typeII);
            if (result.includes(conjugated)) { hits.push({conjugation: conj, auxiliaries: auxs, result}); }
          } catch {}
        }
      }
    }
  }

  return hits;
}

export {
  adjConjugations,
  AdjConjugation,
  adjConjugate,
  adjDeconjugate,
  AdjDeconjugated,
} from './adjective';
