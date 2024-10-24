/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type JsonSchema = Prayer | Reading | Synaxarium;
export type Occasion = "annual" | "great-lent";

export interface Prayer {
  title?: MultiLingualText;
  occasion?: Occasion;
  sections?: (InfoSection | VersesSection | ReadingSection | CompoundPrayerSection)[];
}
export interface MultiLingualText {
  english: string;
  arabic?: string;
  coptic?: string;
  coptic_english?: string;
  coptic_arabic?: string;
}
export interface InfoSection {
  occasion?: Occasion;
  type: "info";
  text: MultiLingualText;
}
export interface VersesSection {
  occasion?: Occasion;
  type: "verses";
  speaker?: "people" | "priest" | "deacon" | "reader" | "";
  inaudible?: boolean;
  verses: MultiLingualText[];
}
export interface ReadingSection {
  occasion?: Occasion;
  type: "reading";
  readingType:
    | "matins-psalm"
    | "matins-gospel"
    | "vespers-psalm"
    | "vespers-gospel"
    | "pauline-epistle"
    | "catholic-epistle"
    | "acts-of-the-apostles"
    | "synaxarium"
    | "liturgy-psalm"
    | "liturgy-gospel";
}
export interface CompoundPrayerSection {
  occasion?: Occasion;
  type: "compound-prayer";
  path: string;
}
export interface Reading {
  title: MultiLingualText;
  text: MultiLingualText;
}
export interface Synaxarium {
  title: MultiLingualText;
  commemorations: {
    title: MultiLingualText;
    text: MultiLingualText;
  }[];
}

export const SAINTS = [
    // Apostles
    'St. Mark',
    // Intercessors",
    'Archangel Gabriel',
    'Archangel Michael',
    'Archangel Raphael',
    'Archangel Suriel',
    'St. John the Baptist',
    'St. Mary',
    'The 24 Presbyters (Priests)',
    'The 4 Incorporeal Creatures',
    'The Heavenly',
    // Martyrs",
    'Any Martyr (All)',
    'St. Abanoub',
    'St. Demiana',
    'St. George',
    'St. Marina (The Martyr)',
    'St. Mina',
    'St. Philopater Mercurius',
    'St. Stephen',
    'Sts. Sergios & Bachus',
    // Saints",
    'Pope Kyrillos VI',
    'St. Abraam',
    'St. Antony the Great',
    'St. Athanasius the Apostolic',
    'St. Bishoy',
    'St. Karas the Anchorite',
    'St. Moses the Black',
    'St. Paul The 1st Hermet',
    'St. Reweis (Teji)',
    'St. Shenouda the Archimandrite',
    'St. Thomas the Hermit',
    'Sts. Maximos & Dometius',
] as const
export type Saint = (typeof SAINTS)[number]
