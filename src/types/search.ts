import { TFile, SearchResult } from 'obsidian';

export interface EnhancedSearchResult {
    file: TFile;
    matches: SearchResult;
    score: number;
    type: 'file' | 'heading' | 'content';
    matchedText?: string;
    context?: string;
    excerpt?: string;
    lastModified: number;
    size: number;
    tags?: string[];
}

export interface SearchState {
    query: string;
    isSearching: boolean;
    hasResults: boolean;
    resultCount: number;
    searchTime: number;
    selectedIndex: number;
    category: SearchCategory;
}

export type SearchCategory = 'all' | 'files' | 'headings' | 'content' | 'recent';

export interface SearchFilters {
    category: SearchCategory;
    fileType?: string;
    dateRange?: {
        from: Date;
        to: Date;
    };
    tags?: string[];
}

export interface QuickAction {
    id: string;
    text: string;
    icon: string;
    shortcut: string;
    action: () => void;
    description: string;
}