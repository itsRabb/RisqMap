'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import en from '../i18n/en';

type Language = 'en';
type Translations = typeof en;

interface LanguageContextProps {
    lang: Language;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const lang: Language = 'en';

    const dictionaries = { en };

    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = dictionaries[lang];

        for (const key of keys) {
            if (current[key] === undefined) {
                return path;
            }
            current = current[key];
        }

        return current;
    };

    return (
        <LanguageContext.Provider value={{ lang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
