export interface Letter {
  letter: string;
  name: string;
  transliteration: string;
  pronunciation: string;
  numericalValue?: number;
  notes?: string;
}

export const HEBREW_ALPHABET: Letter[] = [
  {
    letter: 'א',
    name: 'Aleph',
    transliteration: 'ʾ',
    pronunciation: 'Silent or glottal stop',
    numericalValue: 1,
    notes: 'First letter of the Hebrew alphabet. Often silent or represents a glottal stop.'
  },
  {
    letter: 'ב',
    name: 'Bet',
    transliteration: 'b/v',
    pronunciation: 'b as in boy, v as in very',
    numericalValue: 2,
    notes: 'With dagesh (dot): "b". Without dagesh: "v".'
  },
  {
    letter: 'ג',
    name: 'Gimel',
    transliteration: 'g',
    pronunciation: 'g as in go',
    numericalValue: 3,
    notes: 'Always hard "g" sound.'
  },
  {
    letter: 'ד',
    name: 'Dalet',
    transliteration: 'd',
    pronunciation: 'd as in door',
    numericalValue: 4,
    notes: 'Standard "d" sound.'
  },
  {
    letter: 'ה',
    name: 'He',
    transliteration: 'h',
    pronunciation: 'h as in house',
    numericalValue: 5,
    notes: 'Soft "h" sound. Often silent at end of words.'
  },
  {
    letter: 'ו',
    name: 'Vav',
    transliteration: 'v/o/u',
    pronunciation: 'v as in very',
    numericalValue: 6,
    notes: 'Consonant "v" or vowel "o"/"u" with vowel points.'
  },
  {
    letter: 'ז',
    name: 'Zayin',
    transliteration: 'z',
    pronunciation: 'z as in zoo',
    numericalValue: 7,
    notes: 'Standard "z" sound.'
  },
  {
    letter: 'ח',
    name: 'Chet',
    transliteration: 'ḥ',
    pronunciation: 'Strong guttural h (like clearing throat)',
    numericalValue: 8,
    notes: 'Guttural "h" sound, different from ה.'
  },
  {
    letter: 'ט',
    name: 'Tet',
    transliteration: 'ṭ',
    pronunciation: 't as in top',
    numericalValue: 9,
    notes: 'Emphatic "t" sound.'
  },
  {
    letter: 'י',
    name: 'Yod',
    transliteration: 'y',
    pronunciation: 'y as in yes',
    numericalValue: 10,
    notes: 'Consonant "y" or part of vowel combinations.'
  },
  {
    letter: 'כ',
    name: 'Kaf',
    transliteration: 'k/kh',
    pronunciation: 'k as in king, kh as in Bach',
    numericalValue: 20,
    notes: 'With dagesh: "k". Without: "kh" (guttural). Final form: ך'
  },
  {
    letter: 'ל',
    name: 'Lamed',
    transliteration: 'l',
    pronunciation: 'l as in love',
    numericalValue: 30,
    notes: 'Standard "l" sound.'
  },
  {
    letter: 'מ',
    name: 'Mem',
    transliteration: 'm',
    pronunciation: 'm as in mother',
    numericalValue: 40,
    notes: 'Standard "m" sound. Final form: ם'
  },
  {
    letter: 'נ',
    name: 'Nun',
    transliteration: 'n',
    pronunciation: 'n as in no',
    numericalValue: 50,
    notes: 'Standard "n" sound. Final form: ן'
  },
  {
    letter: 'ס',
    name: 'Samekh',
    transliteration: 's',
    pronunciation: 's as in sun',
    numericalValue: 60,
    notes: 'Standard "s" sound.'
  },
  {
    letter: 'ע',
    name: 'Ayin',
    transliteration: 'ʿ',
    pronunciation: 'Deep guttural (like gargling)',
    numericalValue: 70,
    notes: 'Guttural sound, often silent in modern Hebrew.'
  },
  {
    letter: 'פ',
    name: 'Pe',
    transliteration: 'p/f',
    pronunciation: 'p as in pat, f as in fine',
    numericalValue: 80,
    notes: 'With dagesh: "p". Without: "f". Final form: ף'
  },
  {
    letter: 'צ',
    name: 'Tsadi',
    transliteration: 'ts',
    pronunciation: 'ts as in cats',
    numericalValue: 90,
    notes: 'Combined "ts" sound. Final form: ץ'
  },
  {
    letter: 'ק',
    name: 'Qof',
    transliteration: 'q',
    pronunciation: 'k as in king (back of throat)',
    numericalValue: 100,
    notes: 'Deep "k" sound from back of throat.'
  },
  {
    letter: 'ר',
    name: 'Resh',
    transliteration: 'r',
    pronunciation: 'r as in roll (guttural)',
    numericalValue: 200,
    notes: 'Guttural "r" sound.'
  },
  {
    letter: 'ש',
    name: 'Shin/Sin',
    transliteration: 'sh/s',
    pronunciation: 'sh as in she, s as in sun',
    numericalValue: 300,
    notes: 'With right dot (ׁ): "sh". With left dot (ׂ): "s".'
  },
  {
    letter: 'ת',
    name: 'Tav',
    transliteration: 't',
    pronunciation: 't as in top',
    numericalValue: 400,
    notes: 'Standard "t" sound.'
  }
];

export const GREEK_ALPHABET: Letter[] = [
  {
    letter: 'Α α',
    name: 'Alpha',
    transliteration: 'a',
    pronunciation: 'a as in father',
    numericalValue: 1,
    notes: 'First letter. Uppercase: Α, Lowercase: α'
  },
  {
    letter: 'Β β',
    name: 'Beta',
    transliteration: 'b',
    pronunciation: 'b as in boy',
    numericalValue: 2,
    notes: 'Uppercase: Β, Lowercase: β'
  },
  {
    letter: 'Γ γ',
    name: 'Gamma',
    transliteration: 'g',
    pronunciation: 'g as in go',
    numericalValue: 3,
    notes: 'Uppercase: Γ, Lowercase: γ. Before γ, κ, ξ, χ: nasal "ng".'
  },
  {
    letter: 'Δ δ',
    name: 'Delta',
    transliteration: 'd',
    pronunciation: 'd as in door',
    numericalValue: 4,
    notes: 'Uppercase: Δ, Lowercase: δ'
  },
  {
    letter: 'Ε ε',
    name: 'Epsilon',
    transliteration: 'e',
    pronunciation: 'e as in bet (short)',
    numericalValue: 5,
    notes: 'Short "e" sound. Uppercase: Ε, Lowercase: ε'
  },
  {
    letter: 'Ζ ζ',
    name: 'Zeta',
    transliteration: 'z',
    pronunciation: 'z as in zoo or dz',
    numericalValue: 7,
    notes: 'Uppercase: Ζ, Lowercase: ζ'
  },
  {
    letter: 'Η η',
    name: 'Eta',
    transliteration: 'ē',
    pronunciation: 'e as in they (long)',
    numericalValue: 8,
    notes: 'Long "e" sound. Uppercase: Η, Lowercase: η'
  },
  {
    letter: 'Θ θ',
    name: 'Theta',
    transliteration: 'th',
    pronunciation: 'th as in think',
    numericalValue: 9,
    notes: 'Uppercase: Θ, Lowercase: θ'
  },
  {
    letter: 'Ι ι',
    name: 'Iota',
    transliteration: 'i',
    pronunciation: 'i as in machine',
    numericalValue: 10,
    notes: 'Uppercase: Ι, Lowercase: ι'
  },
  {
    letter: 'Κ κ',
    name: 'Kappa',
    transliteration: 'k',
    pronunciation: 'k as in king',
    numericalValue: 20,
    notes: 'Uppercase: Κ, Lowercase: κ'
  },
  {
    letter: 'Λ λ',
    name: 'Lambda',
    transliteration: 'l',
    pronunciation: 'l as in love',
    numericalValue: 30,
    notes: 'Uppercase: Λ, Lowercase: λ'
  },
  {
    letter: 'Μ μ',
    name: 'Mu',
    transliteration: 'm',
    pronunciation: 'm as in mother',
    numericalValue: 40,
    notes: 'Uppercase: Μ, Lowercase: μ'
  },
  {
    letter: 'Ν ν',
    name: 'Nu',
    transliteration: 'n',
    pronunciation: 'n as in no',
    numericalValue: 50,
    notes: 'Uppercase: Ν, Lowercase: ν'
  },
  {
    letter: 'Ξ ξ',
    name: 'Xi',
    transliteration: 'x',
    pronunciation: 'x as in box',
    numericalValue: 60,
    notes: 'Uppercase: Ξ, Lowercase: ξ'
  },
  {
    letter: 'Ο ο',
    name: 'Omicron',
    transliteration: 'o',
    pronunciation: 'o as in pot (short)',
    numericalValue: 70,
    notes: 'Short "o" sound. Uppercase: Ο, Lowercase: ο'
  },
  {
    letter: 'Π π',
    name: 'Pi',
    transliteration: 'p',
    pronunciation: 'p as in pat',
    numericalValue: 80,
    notes: 'Uppercase: Π, Lowercase: π'
  },
  {
    letter: 'Ρ ρ',
    name: 'Rho',
    transliteration: 'r',
    pronunciation: 'r as in roll (trilled)',
    numericalValue: 100,
    notes: 'Trilled "r". Uppercase: Ρ, Lowercase: ρ'
  },
  {
    letter: 'Σ σ/ς',
    name: 'Sigma',
    transliteration: 's',
    pronunciation: 's as in sun',
    numericalValue: 200,
    notes: 'Uppercase: Σ. Lowercase: σ (middle), ς (final position)'
  },
  {
    letter: 'Τ τ',
    name: 'Tau',
    transliteration: 't',
    pronunciation: 't as in top',
    numericalValue: 300,
    notes: 'Uppercase: Τ, Lowercase: τ'
  },
  {
    letter: 'Υ υ',
    name: 'Upsilon',
    transliteration: 'u/y',
    pronunciation: 'u as in French "tu"',
    numericalValue: 400,
    notes: 'Uppercase: Υ, Lowercase: υ'
  },
  {
    letter: 'Φ φ',
    name: 'Phi',
    transliteration: 'ph',
    pronunciation: 'ph as in phone',
    numericalValue: 500,
    notes: 'Uppercase: Φ, Lowercase: φ'
  },
  {
    letter: 'Χ χ',
    name: 'Chi',
    transliteration: 'ch',
    pronunciation: 'ch as in Bach (guttural)',
    numericalValue: 600,
    notes: 'Uppercase: Χ, Lowercase: χ'
  },
  {
    letter: 'Ψ ψ',
    name: 'Psi',
    transliteration: 'ps',
    pronunciation: 'ps as in lips',
    numericalValue: 700,
    notes: 'Uppercase: Ψ, Lowercase: ψ'
  },
  {
    letter: 'Ω ω',
    name: 'Omega',
    transliteration: 'ō',
    pronunciation: 'o as in note (long)',
    numericalValue: 800,
    notes: 'Long "o" sound. Last letter. Uppercase: Ω, Lowercase: ω'
  }
];
