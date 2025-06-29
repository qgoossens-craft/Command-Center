import type { CommandCenterPlugin } from '../main';
import { IconDatabase } from './IconDatabase';

export interface CustomIconSettings {
    useCustomIcons: boolean;
    actionButtons: { [actionName: string]: string };
    fileTypes: { [extension: string]: string };
    todoStates: {
        incomplete: string;
        completed: string;
    };
    bookmarks: string;
    recentFiles: string;
    pinnedNotes: string;
    searchResults: string;
}

export interface IconDefinition {
    type: 'emoji' | 'lucide' | 'unicode';
    value: string;
    label: string;
}

export class IconService {
    private plugin: CommandCenterPlugin;
    
    // Default icon mappings
    private static readonly DEFAULT_ICONS: { [key: string]: string } = {
        // Action buttons (matching actual buttons in CommandCenterLayout)
        'action-new-note': '📝',
        'action-random-note': '🎲',
        'action-toggle-theme': '🌓',
        'action-canvas': '🎨',
        'action-excalidraw': '✏️',
        'action-web-viewer': '🌐',
        'action-today-note': '📅',
        'action-yesterday-note': '📆',
        'action-graph-view': '🕸️',
        'action-vault-stats': '📊',
        'action-settings': '⚙️',
        
        // File types
        'file-md': '📄',
        'file-pdf': '📄',
        'file-image': '🖼️',
        'file-folder': '📁',
        'file-default': '📄',
        
        // Todo states
        'todo-incomplete': '☐',
        'todo-completed': '✓',
        'todo-cancelled': '✗',
        
        // Other widgets
        'bookmark': '⭐',
        'recent-file': '📄',
        'pinned-note': '📌',
        'search-result': '🔍'
    };
    
    // Use the expanded icon database with search functionality
    public static readonly ICON_OPTIONS = IconDatabase.ALL_ICONS;
    
        // Common emojis
        { type: 'emoji', value: '📄', label: 'Document' },
        { type: 'emoji', value: '📝', label: 'Memo' },
        { type: 'emoji', value: '📁', label: 'Folder' },
        { type: 'emoji', value: '⭐', label: 'Star' },
        { type: 'emoji', value: '📌', label: 'Pin' },
        { type: 'emoji', value: '🔍', label: 'Search' },
        { type: 'emoji', value: '⚙️', label: 'Settings' },
        { type: 'emoji', value: '🌓', label: 'Theme' },
        { type: 'emoji', value: '📅', label: 'Calendar' },
        { type: 'emoji', value: '🎲', label: 'Random' },
        { type: 'emoji', value: '🌐', label: 'Network' },
        { type: 'emoji', value: '🏷️', label: 'Tag' },
        { type: 'emoji', value: '⌘', label: 'Command' },
        { type: 'emoji', value: '🖼️', label: 'Image' },
        
        // Checkboxes and status
        { type: 'unicode', value: '☐', label: 'Empty Checkbox' },
        { type: 'unicode', value: '☑', label: 'Checked Box' },
        { type: 'unicode', value: '✓', label: 'Check Mark' },
        { type: 'unicode', value: '✗', label: 'X Mark' },
        { type: 'unicode', value: '◯', label: 'Circle' },
        { type: 'unicode', value: '●', label: 'Filled Circle' },
        { type: 'unicode', value: '◆', label: 'Diamond' },
        { type: 'unicode', value: '▶', label: 'Play' },
        { type: 'unicode', value: '⏸', label: 'Pause' },
        
        // Arrows and navigation
        { type: 'unicode', value: '→', label: 'Right Arrow' },
        { type: 'unicode', value: '←', label: 'Left Arrow' },
        { type: 'unicode', value: '↑', label: 'Up Arrow' },
        { type: 'unicode', value: '↓', label: 'Down Arrow' },
        { type: 'unicode', value: '⇒', label: 'Double Right Arrow' },
        { type: 'unicode', value: '⇐', label: 'Double Left Arrow' },
        
        // Special symbols
        { type: 'unicode', value: '★', label: 'Star Outline' },
        { type: 'unicode', value: '♦', label: 'Diamond Suit' },
        { type: 'unicode', value: '♠', label: 'Spade Suit' },
        { type: 'unicode', value: '♥', label: 'Heart Suit' },
        { type: 'unicode', value: '♣', label: 'Club Suit' },
        { type: 'unicode', value: '※', label: 'Reference Mark' },
        { type: 'unicode', value: '§', label: 'Section Sign' },
        { type: 'unicode', value: '¶', label: 'Paragraph' },
        
        // Priority indicators
        { type: 'unicode', value: '!', label: 'Exclamation' },
        { type: 'unicode', value: '!!', label: 'Double Exclamation' },
        { type: 'unicode', value: '⚠', label: 'Warning' },
        { type: 'unicode', value: '🔥', label: 'Fire (High Priority)' },
        { type: 'unicode', value: '❗', label: 'Heavy Exclamation' },
        { type: 'unicode', value: '❓', label: 'Question Mark' }
    ];
    
    constructor(plugin: CommandCenterPlugin) {
        this.plugin = plugin;
    }
    
    /**
     * Get icon for a specific widget item
     */
    getIcon(category: string, itemType?: string, fallback?: string): string {
        const customIcons = this.plugin.settings.customIcons;
        
        if (!customIcons?.useCustomIcons) {
            return this.getDefaultIcon(category, itemType, fallback);
        }
        
        // Try to get custom icon
        const customIcon = this.getCustomIcon(category, itemType);
        if (customIcon) {
            return customIcon;
        }
        
        // Fall back to default
        return this.getDefaultIcon(category, itemType, fallback);
    }
    
    /**
     * Get custom user-defined icon
     */
    private getCustomIcon(category: string, itemType?: string): string | null {
        const customIcons = this.plugin.settings.customIcons;
        if (!customIcons) return null;
        
        // Check specific mappings first
        switch (category) {
            case 'action':
                return customIcons.actionButtons?.[itemType || ''] || null;
            case 'file':
                if (itemType) {
                    return customIcons.fileTypes?.[itemType] || null;
                }
                return customIcons.recentFiles || null;
            case 'todo':
                if (itemType === 'completed') {
                    return customIcons.todoStates?.completed || null;
                } else {
                    return customIcons.todoStates?.incomplete || null;
                }
            case 'bookmark':
                return customIcons.bookmarks || null;
            case 'pinned':
                return customIcons.pinnedNotes || null;
            case 'search-result':
                return customIcons.searchResults || null;
            default:
                return null;
        }
    }
    
    /**
     * Get default built-in icon
     */
    private getDefaultIcon(category: string, itemType?: string, fallback?: string): string {
        const key = itemType ? `${category}-${itemType}` : category;
        return IconService.DEFAULT_ICONS[key] || fallback || IconService.DEFAULT_ICONS['file-default'];
    }
    
    /**
     * Get icon for action button by action name
     */
    getActionIcon(actionName: string): string {
        return this.getIcon('action', actionName, '⚡');
    }
    
    /**
     * Get icon for file based on extension
     */
    getFileIcon(extension?: string): string {
        if (extension) {
            return this.getIcon('file', extension.toLowerCase(), IconService.DEFAULT_ICONS['file-default']);
        }
        return this.getIcon('file', undefined, IconService.DEFAULT_ICONS['file-default']);
    }
    
    /**
     * Get icon for todo item based on completion status
     */
    getTodoIcon(completed: boolean): string {
        return this.getIcon('todo', completed ? 'completed' : 'incomplete');
    }
    
    /**
     * Get icon for bookmark
     */
    getBookmarkIcon(): string {
        return this.getIcon('bookmark');
    }
    
    /**
     * Get icon for pinned note
     */
    getPinnedNoteIcon(): string {
        return this.getIcon('pinned');
    }
    
    /**
     * Get icon for search result
     */
    getSearchResultIcon(): string {
        return this.getIcon('search-result', undefined, '🔍');
    }
    
    /**
     * Validate if an icon string is valid
     */
    static isValidIcon(icon: string): boolean {
        if (!icon || icon.trim().length === 0) return false;
        
        // Allow emojis, single characters, and short strings
        return icon.trim().length <= 4;
    }
    
    /**
     * Get all available action names for icon customization (matching actual buttons)
     */
    getAvailableActionNames(): string[] {
        return [
            'new-note',
            'random-note',
            'toggle-theme', 
            'canvas',
            'excalidraw',
            'web-viewer',
            'today-note',
            'yesterday-note',
            'graph-view',
            'vault-stats',
            'settings'
        ];
    }
    
    /**
     * Get common file extensions for icon customization
     */
    getCommonFileExtensions(): string[] {
        return ['md', 'pdf', 'png', 'jpg', 'gif', 'txt', 'json', 'css', 'js', 'ts'];
    }
    
    /**
     * Create an icon element with proper styling
     */
    createIconElement(container: HTMLElement, iconValue: string, className: string = 'widget-icon'): HTMLElement {
        const iconEl = container.createSpan({
            cls: className,
            text: iconValue
        });
        
        // Apply consistent icon styling
        iconEl.style.display = 'flex';
        iconEl.style.alignItems = 'center';
        iconEl.style.justifyContent = 'center';
        iconEl.style.flexShrink = '0';
        iconEl.style.width = '20px';
        iconEl.style.height = '20px';
        iconEl.style.fontSize = 'var(--font-ui-large)';
        
        return iconEl;
    }
}