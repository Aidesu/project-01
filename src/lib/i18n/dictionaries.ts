const dictionaries: { [key: string]: () => Promise<any> } = {
    en: () => import("./dictionaries/en.json").then((m) => m.default),
    fr: () => import("./dictionaries/fr.json").then((m) => m.default),
    ja: () => import("./dictionaries/ja.json").then((m) => m.default),
};

export const getDictionary = async (locale: string) => {
    const loadDictionary = dictionaries[locale] ?? dictionaries.en;
    return loadDictionary();
};
