import { IconDatabase } from '../services/IconDatabase';
import type { IconDefinition } from '../services/IconService';

export interface IconPickerOptions {
    onIconSelect: (icon: string) => void;
    maxHeight?: string;
    showSearch?: boolean;
    showCategories?: boolean;
    compact?: boolean;
}

export class IconPicker {
    private container: HTMLElement;
    private options: IconPickerOptions;
    private searchInput: HTMLInputElement | null = null;
    private categorySelect: HTMLSelectElement | null = null;
    private iconGrid: HTMLElement | null = null;
    private currentIcons: IconDefinition[] = [];

    constructor(container: HTMLElement, options: IconPickerOptions) {
        this.container = container;
        this.options = {
            maxHeight: '300px',
            showSearch: true,
            showCategories: true,
            compact: false,
            ...options
        };
        this.render();
    }

    private render() {
        this.container.empty();
        this.container.addClass('icon-picker-container');

        if (this.options.showSearch) {
            this.createSearchInput();
        }

        if (this.options.showCategories && !this.options.compact) {
            this.createCategorySelect();
        }

        this.createIconGrid();
        this.loadIcons();
    }

    private createSearchInput() {
        const searchContainer = this.container.createDiv({ cls: 'icon-picker-search' });
        
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: 'Search icons... (try "star", "arrow", "file", etc.)',
            cls: 'icon-picker-search-input'
        });

        // Apply styling
        this.searchInput.style.width = '100%';
        this.searchInput.style.padding = '8px 12px';
        this.searchInput.style.border = '1px solid var(--background-modifier-border)';
        this.searchInput.style.borderRadius = '6px';
        this.searchInput.style.background = 'var(--background-primary)';
        this.searchInput.style.color = 'var(--text-normal)';
        this.searchInput.style.marginBottom = '10px';
        this.searchInput.style.fontSize = '14px';

        // Add search functionality with debounce
        let searchTimeout: NodeJS.Timeout;
        this.searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 300);
        });

        // Add clear button
        const clearBtn = searchContainer.createEl('button', {
            text: '×',
            cls: 'icon-picker-clear-btn'
        });
        clearBtn.style.position = 'absolute';
        clearBtn.style.right = '8px';
        clearBtn.style.top = '50%';
        clearBtn.style.transform = 'translateY(-50%)';
        clearBtn.style.border = 'none';
        clearBtn.style.background = 'transparent';
        clearBtn.style.cursor = 'pointer';
        clearBtn.style.fontSize = '18px';
        clearBtn.style.color = 'var(--text-muted)';
        clearBtn.style.display = 'none';

        searchContainer.style.position = 'relative';

        clearBtn.addEventListener('click', () => {
            if (this.searchInput) {
                this.searchInput.value = '';
                this.performSearch();
                clearBtn.style.display = 'none';
            }
        });

        this.searchInput.addEventListener('input', () => {
            clearBtn.style.display = this.searchInput?.value ? 'block' : 'none';
        });
    }

    private createCategorySelect() {
        const categoryContainer = this.container.createDiv({ cls: 'icon-picker-category' });
        
        this.categorySelect = categoryContainer.createEl('select', { cls: 'icon-picker-category-select' });
        
        // Apply styling
        this.categorySelect.style.width = '100%';
        this.categorySelect.style.padding = '8px 12px';
        this.categorySelect.style.border = '1px solid var(--background-modifier-border)';
        this.categorySelect.style.borderRadius = '6px';
        this.categorySelect.style.background = 'var(--background-primary)';
        this.categorySelect.style.color = 'var(--text-normal)';
        this.categorySelect.style.marginBottom = '10px';
        this.categorySelect.style.fontSize = '14px';

        // Add options
        const allOption = this.categorySelect.createEl('option', { value: '', text: 'All Categories' });
        const popularOption = this.categorySelect.createEl('option', { value: 'popular', text: 'Popular Icons' });
        
        const categories = IconDatabase.getCategories();
        categories.forEach(category => {
            this.categorySelect!.createEl('option', { value: category, text: category });
        });

        this.categorySelect.addEventListener('change', () => {
            this.loadIconsByCategory();
        });
    }

    private createIconGrid() {
        this.iconGrid = this.container.createDiv({ cls: 'icon-picker-grid' });
        
        // Apply styling
        this.iconGrid.style.display = 'grid';
        this.iconGrid.style.gridTemplateColumns = this.options.compact 
            ? 'repeat(auto-fill, minmax(32px, 1fr))'
            : 'repeat(auto-fill, minmax(40px, 1fr))';
        this.iconGrid.style.gap = this.options.compact ? '4px' : '8px';
        this.iconGrid.style.padding = '10px';
        this.iconGrid.style.border = '1px solid var(--background-modifier-border)';
        this.iconGrid.style.borderRadius = '6px';
        this.iconGrid.style.maxHeight = this.options.maxHeight || '300px';
        this.iconGrid.style.overflowY = 'auto';
        this.iconGrid.style.background = 'var(--background-secondary)';
    }

    private performSearch() {
        if (!this.searchInput) return;
        
        const query = this.searchInput.value.trim();
        
        if (query === '') {
            // Reset to popular icons when search is empty
            this.currentIcons = IconDatabase.getPopularIcons();
        } else {
            // Search with the query
            this.currentIcons = IconDatabase.searchIcons(query, 100);
        }
        
        this.renderIcons();
    }

    private loadIconsByCategory() {
        if (!this.categorySelect) return;
        
        const category = this.categorySelect.value;
        
        if (category === '') {
            // All icons - but limit to reasonable amount
            this.currentIcons = IconDatabase.ALL_ICONS.slice(0, 200);
        } else if (category === 'popular') {
            this.currentIcons = IconDatabase.getPopularIcons();
        } else {
            this.currentIcons = IconDatabase.getIconsByCategory(category);
        }
        
        this.renderIcons();
    }

    private loadIcons() {
        // Start with popular icons
        this.currentIcons = IconDatabase.getPopularIcons();
        this.renderIcons();
    }

    private renderIcons() {
        if (!this.iconGrid) return;
        
        this.iconGrid.empty();
        
        if (this.currentIcons.length === 0) {
            const noResults = this.iconGrid.createDiv({ cls: 'icon-picker-no-results' });
            noResults.textContent = 'No icons found. Try a different search term.';
            noResults.style.padding = '20px';
            noResults.style.textAlign = 'center';
            noResults.style.color = 'var(--text-muted)';
            noResults.style.fontStyle = 'italic';
            return;
        }

        // Add count indicator
        const countIndicator = this.iconGrid.createDiv({ cls: 'icon-picker-count' });
        countIndicator.textContent = `${this.currentIcons.length} icons`;
        countIndicator.style.gridColumn = '1 / -1';
        countIndicator.style.padding = '5px 0';
        countIndicator.style.fontSize = '12px';
        countIndicator.style.color = 'var(--text-muted)';
        countIndicator.style.textAlign = 'center';
        countIndicator.style.borderBottom = '1px solid var(--background-modifier-border)';
        countIndicator.style.marginBottom = '10px';

        this.currentIcons.forEach(iconDef => {
            const iconBtn = this.iconGrid!.createEl('button', {
                text: iconDef.value,
                title: `${iconDef.label} (${iconDef.type})`,
                cls: 'icon-picker-btn'
            });
            
            // Apply styling
            const size = this.options.compact ? '32px' : '40px';
            const fontSize = this.options.compact ? '14px' : '16px';
            
            iconBtn.style.width = size;
            iconBtn.style.height = size;
            iconBtn.style.padding = this.options.compact ? '4px' : '8px';
            iconBtn.style.border = '1px solid var(--background-modifier-border)';
            iconBtn.style.borderRadius = '4px';
            iconBtn.style.background = 'var(--background-primary)';
            iconBtn.style.cursor = 'pointer';
            iconBtn.style.fontSize = fontSize;
            iconBtn.style.transition = 'all 0.2s ease';
            iconBtn.style.display = 'flex';
            iconBtn.style.alignItems = 'center';
            iconBtn.style.justifyContent = 'center';

            // Add hover effects
            iconBtn.addEventListener('mouseenter', () => {
                iconBtn.style.background = 'var(--background-modifier-hover)';
                iconBtn.style.transform = this.options.compact ? 'scale(1.05)' : 'scale(1.1)';
                iconBtn.style.borderColor = 'var(--interactive-accent)';
            });

            iconBtn.addEventListener('mouseleave', () => {
                iconBtn.style.background = 'var(--background-primary)';
                iconBtn.style.transform = 'scale(1)';
                iconBtn.style.borderColor = 'var(--background-modifier-border)';
            });

            // Add click handler
            iconBtn.addEventListener('click', () => {
                this.selectIcon(iconDef.value, iconBtn);
            });
        });
    }

    private selectIcon(icon: string, button: HTMLElement) {
        // Visual feedback
        button.style.background = 'var(--interactive-accent)';
        button.style.color = 'var(--text-on-accent)';
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.background = 'var(--background-primary)';
            button.style.color = 'var(--text-normal)';
            button.style.transform = 'scale(1)';
        }, 150);

        // Call the callback
        this.options.onIconSelect(icon);
    }

    public destroy() {
        this.container.empty();
    }
    
    public updateIcons(newIcons: IconDefinition[]) {
        this.currentIcons = newIcons;
        this.renderIcons();
    }
    
    public clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.performSearch();
        }
    }

    public selectCategory(category: string) {
        if (this.categorySelect) {
            this.categorySelect.value = category;
            this.loadIconsByCategory();
        }
    }
}