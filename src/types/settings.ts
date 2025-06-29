import type { CustomIconSettings } from '../services/IconService';

export interface CommandCenterSettings {
    // General settings
    customTitle: string;
    customMessage: string;
    openOnStartup: boolean;
    
    // Visual settings
    backgroundImage: string;
    backgroundColor: string;
    backgroundOverlay: boolean;
    backgroundOverlayOpacity: number;
    titleFontSize: string;
    
    // Banner settings
    showBanner: boolean;
    bannerText: string;
    bannerImage: string;
    bannerHeight: string;
    bannerOpacity: number;
    
    // Advanced banner settings
    bannerTextPosition: 'center' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    bannerTextSize: string;
    bannerTextColor: string;
    bannerTextShadow: boolean;
    bannerOverlayColor: string;
    bannerOverlayOpacity: number;
    bannerImageFit: 'cover' | 'contain' | 'fill' | 'scale-down';
    bannerImagePosition: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    bannerBlur: number;
    
    // Widget toggles (for future phases)
    showSearch: boolean;
    showBookmarks: boolean;
    showRecentFiles: boolean;
    showTodos: boolean;
    showQuotes: boolean;
    showStats: boolean;
    
    // Layout settings
    layoutPreset: 'default' | 'minimal' | 'dashboard' | 'productivity';
    widgetColumns: number;
    
    // Content limits
    maxRecentFiles: number;
    maxBookmarks: number;
    maxTodos: number;
    
    // Column/Section names
    searchSectionTitle: string;
    quickActionsSectionTitle: string;
    bookmarksSectionTitle: string;
    recentFilesSectionTitle: string;
    todosSectionTitle: string;
    
    // Theme settings
    useObsidianAccent: boolean;
    customAccentColor: string;
    
    // Todo settings
    defaultTodoFile: string;
    todoParseMode: 'vault' | 'single-file';
    todoSourceFile: string;
    autoCleanupCompleted: boolean;
    cleanupDelayDays: number;
    
    // Date format settings
    dateFormat: string;
    timeFormat: string;
    
    // Date/time styling settings
    showDateTime: boolean;
    dateTimePosition: 'center' | 'left' | 'right' | 'below-title' | 'above-title';
    dateTimeLayout: 'horizontal' | 'vertical' | 'stacked';
    dateFontSize: string;
    timeFontSize: string;
    dateColor: string;
    timeColor: string;
    dateTimeBackground: string;
    dateTimeBackgroundOpacity: number;
    dateTimeShadow: boolean;
    dateTimeBorder: boolean;
    
    // Pinned Notes settings
    showPinnedNotes: boolean;
    pinnedNotesViewMode: 'list' | 'gallery';
    pinnedContainers: Array<{
        id: string;
        title: string;
        notes: string[];
        collapsed: boolean;
    }>;
    maxPinnedContainers: number;
    
    // Widget backgrounds
    widgetBackgrounds: {
        search: {
            enabled: boolean;
            image: string;
            color: string;
            opacity: number;
        };
        quickActions: {
            enabled: boolean;
            image: string;
            color: string;
            opacity: number;
        };
        bookmarks: {
            enabled: boolean;
            image: string;
            color: string;
            opacity: number;
        };
        recentFiles: {
            enabled: boolean;
            image: string;
            color: string;
            opacity: number;
        };
        todos: {
            enabled: boolean;
            image: string;
            color: string;
            opacity: number;
        };
    };
    
    // Custom icons
    customIcons: CustomIconSettings;
}

export const DEFAULT_SETTINGS: CommandCenterSettings = {
    // General settings
    customTitle: 'Command Center',
    customMessage: '',
    openOnStartup: true,
    
    // Visual settings
    backgroundImage: '',
    backgroundColor: '',
    backgroundOverlay: true,
    backgroundOverlayOpacity: 0.4,
    titleFontSize: '3em',
    
    // Banner settings
    showBanner: false,
    bannerText: '',
    bannerImage: '',
    bannerHeight: '200px',
    bannerOpacity: 0.8,
    
    // Advanced banner settings
    bannerTextPosition: 'center',
    bannerTextSize: 'var(--font-ui-larger)',
    bannerTextColor: 'white',
    bannerTextShadow: true,
    bannerOverlayColor: '#000000',
    bannerOverlayOpacity: 0.3,
    bannerImageFit: 'cover',
    bannerImagePosition: 'center',
    bannerBlur: 0,
    
    // Widget toggles
    showSearch: true,
    showBookmarks: true,
    showRecentFiles: true,
    showTodos: true,
    showQuotes: true,
    showStats: true,
    
    // Layout settings
    layoutPreset: 'default',
    widgetColumns: 3,
    
    // Content limits
    maxRecentFiles: 10,
    maxBookmarks: 10,
    maxTodos: 10,
    
    // Column/Section names
    searchSectionTitle: 'Universal Search',
    quickActionsSectionTitle: 'Quick Actions',
    bookmarksSectionTitle: 'Bookmarks',
    recentFilesSectionTitle: 'Recent Files',
    todosSectionTitle: 'Tasks',
    
    // Theme settings
    useObsidianAccent: true,
    customAccentColor: '#7c3aed',
    
    // Todo settings
    defaultTodoFile: 'Tasks.md',
    todoParseMode: 'vault',
    todoSourceFile: 'Tasks.md',
    autoCleanupCompleted: false,
    cleanupDelayDays: 7,
    
    // Date format settings
    dateFormat: 'EEEE, MMMM d, yyyy',
    timeFormat: 'h:mm a',
    
    // Date/time styling settings
    showDateTime: true,
    dateTimePosition: 'center',
    dateTimeLayout: 'horizontal',
    dateFontSize: 'var(--font-ui-large)',
    timeFontSize: 'var(--font-ui-large)',
    dateColor: 'var(--text-muted)',
    timeColor: 'var(--text-muted)',
    dateTimeBackground: 'transparent',
    dateTimeBackgroundOpacity: 0.1,
    dateTimeShadow: false,
    dateTimeBorder: false,
    
    // Pinned Notes settings
    showPinnedNotes: false,
    pinnedNotesViewMode: 'list',
    pinnedContainers: [],
    maxPinnedContainers: 3,
    
    // Widget backgrounds
    widgetBackgrounds: {
        search: {
            enabled: false,
            image: '',
            color: '',
            opacity: 0.9
        },
        quickActions: {
            enabled: false,
            image: '',
            color: '',
            opacity: 0.9
        },
        bookmarks: {
            enabled: false,
            image: '',
            color: '',
            opacity: 0.9
        },
        recentFiles: {
            enabled: false,
            image: '',
            color: '',
            opacity: 0.9
        },
        todos: {
            enabled: false,
            image: '',
            color: '',
            opacity: 0.9
        }
    },
    
    // Custom icons
    customIcons: {
        useCustomIcons: false,
        actionButtons: {},
        fileTypes: {},
        todoStates: {
            incomplete: '☐',
            completed: '✓'
        },
        bookmarks: '⭐',
        recentFiles: '📄',
        pinnedNotes: '📌',
        searchResults: '🔍'
    }
};