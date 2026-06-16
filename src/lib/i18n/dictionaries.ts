import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: { [key: string]: () => Promise<Dictionary> } = {
    en: () => import("./dictionaries/en.json").then((m) => m.default),
    fr: () => import("./dictionaries/fr.json").then((m) => m.default as unknown as Dictionary),
    ja: () => import("./dictionaries/ja.json").then((m) => m.default as unknown as Dictionary),
};

export const getDictionary = async (locale: string) => {
    const loadDictionary = dictionaries[locale] ?? dictionaries.en;
    return loadDictionary();
};
