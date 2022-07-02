"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
const split = (s) => s.split('');
const vec = [
    split('あいうえお'),
    split('かきくけこ'),
    split('がぎぐげご'),
    split('さしすせそ'),
    split('ざじずぜぞ'),
    split('たちつてと'),
    split('だぢづでど'),
    split('なにぬねの'),
    split('はひふへほ'),
    split('ばびぶべぼ'),
    split('ぱぴぷぺぽ'),
    split('まみむめも'),
    ['や', '', 'ゆ', '', 'よ'],
    split('らりるれろ'),
    ['わ', '', '', '', 'を'],
    ['ん', '', '', '', ''],
];
let charToVecIndex = new Map([]);
vec.forEach((row, rowidx) => {
    row.forEach(char => {
        if (char.length > 0) {
            charToVecIndex.set(char, rowidx);
        }
    });
});
function lookup(character, vowel) {
    if (vowel < 0 || vowel > 4) {
        throw new Error('vowel must be between 0 and 4');
    }
    const idx = charToVecIndex.get(character);
    if (typeof idx === 'undefined') {
        throw new Error('unknown character');
    }
    const ret = vec[idx][vowel];
    if (ret.length === 0) {
        throw new Error('vowel for kana does not exist');
    }
    return ret;
}
exports.lookup = lookup;
