'use client';

import React from 'react';
import { useLanguage } from '@/src/context/LanguageContext';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';

export default function LanguageSwitcher() {
    const { lang } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem className="bg-accent font-medium cursor-default">
                    English (US)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
