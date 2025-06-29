import { Component } from 'obsidian';
import type { CommandCenterPlugin } from '../main';

export class EnhancedSearchWidget extends Component {
    private plugin: CommandCenterPlugin;
    private container: HTMLElement;
    private searchInput: HTMLInputElement;
    private resultsContainer: HTMLElement;
    private searchTimeout: NodeJS.Timeout | null = null;

    constructor(plugin: CommandCenterPlugin, container: HTMLElement) {
        super();
        this.plugin = plugin;
        this.container = container;
        this.render();
    }

    private render() {
        this.container.empty();
        this.container.addClass('enhanced-search-widget');

        // Create search input with action buttons
        const searchContainer = this.container.createDiv({ cls: 'search-input-container' });
        
        this.searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: 'Search your vault...',
            cls: 'search-input'
        });
        
        // Create search action buttons
        const searchActions = searchContainer.createDiv({ cls: 'search-actions' });
        
        const webSearchBtn = searchActions.createEl('button', {
            cls: 'search-action-btn web-search-btn',
            title: 'Search on the web'
        });
        webSearchBtn.createEl('span', { text: '🌐' });
        
        const wikiSearchBtn = searchActions.createEl('button', {
            cls: 'search-action-btn wiki-search-btn',
            title: 'Search on Wikipedia'
        });
        wikiSearchBtn.createEl('span', { text: '📖' });
        
        // Bind action button events
        webSearchBtn.addEventListener('click', () => this.searchWeb());
        wikiSearchBtn.addEventListener('click', () => this.searchWikipedia());

        // Create results container
        this.resultsContainer = this.container.createDiv({ cls: 'search-results' });

        // Bind events
        this.bindEvents();
    }

    private bindEvents() {
        // Search input handling
        this.searchInput.addEventListener('input', () => {
            const query = this.searchInput.value.trim();
            
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            this.searchTimeout = setTimeout(() => {
                if (query.length > 0) {
                    this.performSearch(query);
                } else {
                    this.clearResults();
                }
            }, 300);
        });

        // Enhanced keyboard handling
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.ctrlKey || e.metaKey) {
                    // Ctrl/Cmd + Enter for web search
                    this.searchWeb();
                } else if (e.shiftKey) {
                    // Shift + Enter for Wikipedia search
                    this.searchWikipedia();
                } else {
                    // Regular Enter opens first result
                    this.openFirstResult();
                }
            }
        });

        // Click outside to clear search
        this.registerClickOutsideHandler();
    }

    private registerClickOutsideHandler() {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Check if click is outside the search widget container
            if (!this.container.contains(target)) {
                // Only clear if there's something to clear
                if (this.searchInput.value.trim().length > 0) {
                    this.clearSearch();
                }
            }
        };

        // Add event listener to document
        document.addEventListener('click', handleClickOutside);
        
        // Store reference for cleanup
        this.registerEvent(
            this.plugin.app.workspace.on('file-open', () => {
                // Also clear search when opening a file
                if (this.searchInput.value.trim().length > 0) {
                    this.clearSearch();
                }
            })
        );

        // Clean up the document event listener when the widget is destroyed
        this.register(() => {
            document.removeEventListener('click', handleClickOutside);
        });
    }

    private async performSearch(query: string) {
        const files = this.plugin.app.vault.getMarkdownFiles();
        const results = files
            .filter(file => 
                file.basename.toLowerCase().includes(query.toLowerCase()) ||
                file.path.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10)
            .sort((a, b) => {
                // Sort by how well the basename matches
                const aMatch = a.basename.toLowerCase().indexOf(query.toLowerCase());
                const bMatch = b.basename.toLowerCase().indexOf(query.toLowerCase());
                if (aMatch !== -1 && bMatch !== -1) {
                    return aMatch - bMatch;
                }
                if (aMatch !== -1) return -1;
                if (bMatch !== -1) return 1;
                return a.basename.localeCompare(b.basename);
            });

        this.displayResults(results, query);
    }

    private displayResults(files: any[], query: string) {
        this.resultsContainer.empty();

        if (files.length === 0) {
            const noResults = this.resultsContainer.createDiv({ cls: 'no-results' });
            noResults.textContent = `No results found for "${query}"`;
            return;
        }

        files.forEach((file, index) => {
            const resultItem = this.resultsContainer.createDiv({ cls: 'search-result-item' });
            
            // File icon
            const icon = resultItem.createEl('span', { cls: 'result-icon', text: '📄' });
            
            // File info
            const info = resultItem.createDiv({ cls: 'result-info' });
            const name = info.createDiv({ cls: 'result-name', text: file.basename });
            const path = info.createDiv({ cls: 'result-path', text: file.path });

            // Highlight matching text
            this.highlightMatch(name, file.basename, query);
            this.highlightMatch(path, file.path, query);

            // Click handler
            resultItem.addEventListener('click', () => {
                this.plugin.app.workspace.getLeaf().openFile(file);
                this.clearSearch();
            });

            // Add hover effect
            resultItem.addEventListener('mouseenter', () => {
                resultItem.addClass('highlighted');
            });
            resultItem.addEventListener('mouseleave', () => {
                resultItem.removeClass('highlighted');
            });
        });
    }

    private highlightMatch(element: HTMLElement, text: string, query: string) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        
        if (index !== -1) {
            const before = text.substring(0, index);
            const match = text.substring(index, index + query.length);
            const after = text.substring(index + query.length);
            
            element.innerHTML = `${before}<span class="search-highlight">${match}</span>${after}`;
        }
    }

    private openFirstResult() {
        const firstResult = this.resultsContainer.querySelector('.search-result-item') as HTMLElement;
        if (firstResult) {
            firstResult.click();
        }
    }

    private clearResults() {
        this.resultsContainer.empty();
    }

    private clearSearch() {
        this.searchInput.value = '';
        this.clearResults();
    }

    public focus() {
        this.searchInput.focus();
    }

    private searchWeb() {
        const query = this.searchInput.value.trim();
        if (!query) return;
        
        // Check if web viewer plugin is enabled
        const webViewerPlugin = this.plugin.app.internalPlugins.plugins.websocket;
        if (!webViewerPlugin || !webViewerPlugin.enabled) {
            // Fallback: open in system browser
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(searchUrl, '_blank');
            return;
        }
        
        // Use Obsidian's web viewer
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        this.plugin.app.workspace.getLeaf('tab').setViewState({
            type: 'webpage',
            state: { url: searchUrl }
        });
        
        this.clearSearch();
    }
    
    private searchWikipedia() {
        const query = this.searchInput.value.trim();
        if (!query) return;
        
        // Check if web viewer plugin is enabled
        const webViewerPlugin = this.plugin.app.internalPlugins.plugins.websocket;
        if (!webViewerPlugin || !webViewerPlugin.enabled) {
            // Fallback: open in system browser
            const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
            window.open(wikiUrl, '_blank');
            return;
        }
        
        // Use Obsidian's web viewer
        const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        this.plugin.app.workspace.getLeaf('tab').setViewState({
            type: 'webpage',
            state: { url: wikiUrl }
        });
        
        this.clearSearch();
    }

    public destroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.container.empty();
    }
}