import { EnhancedSearchWidget } from '../widgets/EnhancedSearchWidget';
import { TodoWidget } from '../widgets/TodoWidget';
import { PinnedNotesWidget } from '../widgets/PinnedNotesWidget';
import { DateTimeUtil } from '../utils/dateTime';
import type { CommandCenterPlugin } from '../main';
import type { TFile } from 'obsidian';
import { Notice } from 'obsidian';

export class CommandCenterLayout {
    private plugin: CommandCenterPlugin;
    private container: HTMLElement;
    private searchWidget: EnhancedSearchWidget | null = null;
    private todoWidget: TodoWidget | null = null;
    private pinnedNotesWidget: PinnedNotesWidget | null = null;

    constructor(plugin: CommandCenterPlugin, container: HTMLElement) {
        this.plugin = plugin;
        this.container = container;
        this.render().catch(console.error);
    }

    private async render() {
        // CRITICAL: Clear existing content first to prevent duplication
        this.cleanup();
        
        // Apply theme customizations
        this.applyThemeCustomizations();
        
        // Apply layout preset (container is already contentEl with homepage-grid class)
        this.applyLayoutPreset();
        
        // Create grid sections using named areas based on settings
        this.createHeader();
        
        if (this.plugin.settings.showSearch) {
            this.createSearchSection();
        }
        
        this.createQuickActions(); // Always show for now
        
        if (this.plugin.settings.showBookmarks) {
            await this.createBookmarks();
        }
        
        if (this.plugin.settings.showRecentFiles) {
            this.createRecentFiles();
        }
        
        if (this.plugin.settings.showTodos) {
            this.createTodos();
        }
        
        // Initialize search widget
        this.initializeSearch();
        
        // Apply widget backgrounds after all widgets are created
        this.applyWidgetBackgrounds();
    }

    private cleanup() {
        // Remove any lingering preview popups
        const existingPreviews = this.container.querySelectorAll('.file-preview-popup');
        existingPreviews.forEach(preview => preview.remove());
        
        // Destroy existing widgets
        if (this.searchWidget) {
            this.searchWidget.destroy();
            this.searchWidget = null;
        }
        
        if (this.todoWidget) {
            this.todoWidget.destroy();
            this.todoWidget = null;
        }
        
        if (this.pinnedNotesWidget) {
            this.pinnedNotesWidget.destroy();
            this.pinnedNotesWidget = null;
        }
        
        // Clear all content from container but preserve classes
        // contentEl needs to keep its classes for CSS to work
        this.container.innerHTML = '';
    }

    private applyLayoutPreset() {
        // Remove existing preset classes
        this.container.removeClass('preset-default', 'preset-minimal', 'preset-dashboard', 'preset-productivity');
        this.container.removeClass('no-search', 'no-recent');
        
        // Apply current preset class
        const presetClass = `preset-${this.plugin.settings.layoutPreset}`;
        this.container.addClass(presetClass);
        
        // Apply widget visibility classes
        if (!this.plugin.settings.showSearch) {
            this.container.addClass('no-search');
        }
        if (!this.plugin.settings.showRecentFiles) {
            this.container.addClass('no-recent');
        }
        if (!this.plugin.settings.showTodos) {
            this.container.addClass('no-todos');
        }
        
        // Layout preset applied successfully
        
        // Apply custom column count if not using a preset
        if (this.plugin.settings.layoutPreset === 'default') {
            this.container.style.setProperty('--custom-columns', this.plugin.settings.widgetColumns.toString());
        }
    }

    private createHeader() {
        const header = this.container.createDiv({ cls: 'header-section' });
        
        // Add banner if enabled
        if (this.plugin.settings.showBanner) {
            header.addClass('has-banner');
            this.createBanner(header);
        }
        
        // Create title and date/time based on position setting
        if (this.plugin.settings.showDateTime && this.plugin.settings.dateTimePosition === 'above-title') {
            this.createDateTime(header);
        }
        
        // Custom message or title
        const welcomeEl = header.createDiv({ cls: 'welcome-text' });
        const displayText = this.plugin.settings.customMessage || this.plugin.settings.customTitle;
        welcomeEl.createEl('h1', { text: displayText });
        
        // Date and time (below title or positioned)
        if (this.plugin.settings.showDateTime && this.plugin.settings.dateTimePosition !== 'above-title') {
            this.createDateTime(header);
        }
    }

    private createBanner(header: HTMLElement) {
        const banner = header.createDiv({ cls: 'banner-container' });
        
        // Set banner height and opacity
        banner.style.height = this.plugin.settings.bannerHeight;
        banner.style.opacity = this.plugin.settings.bannerOpacity.toString();
        
        // Add background image if specified
        if (this.plugin.settings.bannerImage) {
            banner.style.backgroundImage = `url(${this.plugin.settings.bannerImage})`;
            banner.style.backgroundSize = this.plugin.settings.bannerImageFit;
            banner.style.backgroundPosition = this.plugin.settings.bannerImagePosition;
            banner.style.backgroundRepeat = 'no-repeat';
            
            // Add blur effect if specified
            if (this.plugin.settings.bannerBlur > 0) {
                banner.style.filter = `blur(${this.plugin.settings.bannerBlur}px)`;
            }
        }
        
        // Add banner text if specified
        if (this.plugin.settings.bannerText) {
            const bannerText = banner.createDiv({ 
                cls: `banner-text banner-text-${this.plugin.settings.bannerTextPosition}` 
            });
            
            // Apply text styling
            bannerText.style.color = this.plugin.settings.bannerTextColor;
            bannerText.style.fontSize = this.plugin.settings.bannerTextSize;
            
            // Apply overlay styling
            const overlayColor = this.plugin.settings.bannerOverlayColor;
            const overlayOpacity = this.plugin.settings.bannerOverlayOpacity;
            bannerText.style.background = `${overlayColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}`;
            
            const textSpan = bannerText.createEl('span', { text: this.plugin.settings.bannerText });
            
            // Apply text shadow if enabled
            if (this.plugin.settings.bannerTextShadow) {
                textSpan.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            } else {
                textSpan.style.textShadow = 'none';
            }
        }
    }

    private createDateTime(header: HTMLElement) {
        const now = new Date();
        
        // Create container with positioning and layout classes
        const dateTimeEl = header.createDiv({ 
            cls: `datetime-display datetime-${this.plugin.settings.dateTimePosition} datetime-${this.plugin.settings.dateTimeLayout}` 
        });
        
        // Apply background styling
        if (this.plugin.settings.dateTimeBackground !== 'transparent') {
            dateTimeEl.style.background = this.plugin.settings.dateTimeBackground;
            if (this.plugin.settings.dateTimeBackground.startsWith('#') || this.plugin.settings.dateTimeBackground.startsWith('rgb')) {
                // For solid colors, apply opacity
                const alpha = Math.round(this.plugin.settings.dateTimeBackgroundOpacity * 255).toString(16).padStart(2, '0');
                dateTimeEl.style.background = `${this.plugin.settings.dateTimeBackground}${alpha}`;
            } else {
                // For CSS variables, wrap in rgba if needed
                dateTimeEl.style.opacity = this.plugin.settings.dateTimeBackgroundOpacity.toString();
            }
        }
        
        // Apply border if enabled
        if (this.plugin.settings.dateTimeBorder) {
            dateTimeEl.style.border = '1px solid var(--background-modifier-border)';
            dateTimeEl.style.borderRadius = 'var(--radius-s)';
            dateTimeEl.style.padding = 'var(--size-4-2) var(--size-4-3)';
        }
        
        // Create date element
        const dateEl = dateTimeEl.createEl('div', { 
            text: DateTimeUtil.formatDateCustom(now, this.plugin.settings.dateFormat),
            cls: 'date-text'
        });
        
        // Apply date styling
        dateEl.style.fontSize = this.plugin.settings.dateFontSize;
        dateEl.style.color = this.plugin.settings.dateColor;
        
        if (this.plugin.settings.dateTimeShadow) {
            dateEl.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
        } else {
            dateEl.style.textShadow = 'none';
        }
        
        // Create time element
        const timeEl = dateTimeEl.createEl('div', { 
            text: DateTimeUtil.formatTimeCustom(now, this.plugin.settings.timeFormat),
            cls: 'time-text'
        });
        
        // Apply time styling
        timeEl.style.fontSize = this.plugin.settings.timeFontSize;
        timeEl.style.color = this.plugin.settings.timeColor;
        
        if (this.plugin.settings.dateTimeShadow) {
            timeEl.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';
        } else {
            timeEl.style.textShadow = 'none';
        }
    }

    private createSearchSection() {
        const searchSection = this.container.createDiv({ cls: 'search-section' });
        
        // Search label
        searchSection.createEl('h2', { text: this.plugin.settings.searchSectionTitle, cls: 'section-title' });
        
        // Search widget container
        const searchContainer = searchSection.createDiv({ cls: 'search-container' });
        this.searchWidget = new EnhancedSearchWidget(this.plugin, searchContainer);
        
        // Add pinned notes below search if enabled
        if (this.plugin.settings.showPinnedNotes) {
            const pinnedContainer = searchSection.createDiv({ cls: 'pinned-notes-container' });
            this.pinnedNotesWidget = new PinnedNotesWidget(this.plugin, pinnedContainer);
        }
    }

    private createQuickActions() {
        const actionsSection = this.container.createDiv({ cls: 'quickactions-section' });
        
        actionsSection.createEl('h2', { text: this.plugin.settings.quickActionsSectionTitle, cls: 'section-title' });
        
        const actionsGrid = actionsSection.createDiv({ cls: 'actions-grid' });
        
        // Create action buttons using proper Obsidian patterns
        this.createActionButton(actionsGrid, 'New Note', '📝', () => this.createNewNote());
        this.createActionButton(actionsGrid, 'Random Note', '🎲', () => this.openRandomNote());
        this.createActionButton(actionsGrid, 'Toggle Theme', '🌓', () => this.toggleTheme());
        this.createActionButton(actionsGrid, 'Canvas', '🎨', () => this.openCanvas());
        this.createActionButton(actionsGrid, 'Excalidraw', '✏️', () => this.openExcalidraw());
        this.createActionButton(actionsGrid, 'Web Viewer', '🌐', () => this.openWebViewer());
        this.createActionButton(actionsGrid, 'Today\'s Note', '📅', () => this.openTodayNote());
        this.createActionButton(actionsGrid, 'Yesterday\'s Note', '📆', () => this.openYesterdayNote());
        this.createActionButton(actionsGrid, 'Graph View', '🕸️', () => this.openGraph());
        this.createActionButton(actionsGrid, 'Vault Stats', '📊', () => this.showVaultStats());
        this.createActionButton(actionsGrid, 'Settings', '⚙️', () => this.openSettings());
    }

    private createActionButton(container: HTMLElement, label: string, icon: string, onClick: () => void) {
        const button = container.createEl('button', { cls: 'cc-action-btn' });
        button.createEl('span', { text: icon, cls: 'cc-action-icon' });
        button.createEl('span', { text: label, cls: 'cc-action-label' });
        
        button.addEventListener('click', onClick);
    }

    // Debug helper: List all available commands
    private listAllCommands() {
        const allCommands = (this.plugin.app as any).commands.commands;
        const commandList = Object.keys(allCommands).map(id => ({
            id: id,
            name: allCommands[id].name
        }));
        
        console.log('=== ALL AVAILABLE COMMANDS ===');
        commandList.forEach(cmd => {
            console.log(`${cmd.id}: ${cmd.name}`);
        });
        
        // Filter for specific plugins
        console.log('\n=== EXCALIDRAW COMMANDS ===');
        commandList.filter(cmd => cmd.id.toLowerCase().includes('excalidraw')).forEach(cmd => {
            console.log(`${cmd.id}: ${cmd.name}`);
        });
        
        // Check for web/browser commands
        console.log('\n=== WEB/BROWSER COMMANDS ===');
        commandList.filter(cmd => 
            cmd.id.toLowerCase().includes('web') || 
            cmd.id.toLowerCase().includes('browser') ||
            cmd.id.toLowerCase().includes('surfing') ||
            cmd.id.toLowerCase().includes('url')
        ).forEach(cmd => {
            console.log(`${cmd.id}: ${cmd.name}`);
        });
        
        // Check core plugins
        console.log('\n=== CORE PLUGINS ===');
        const internalPlugins = (this.plugin.app as any).internalPlugins?.plugins;
        if (internalPlugins) {
            Object.keys(internalPlugins).forEach(pluginId => {
                console.log(`Core plugin: ${pluginId} - Enabled: ${internalPlugins[pluginId]?.enabled}`);
            });
        }
        
        // Also show in a notice
        const webCmds = commandList.filter(cmd => 
            cmd.id.toLowerCase().includes('web') || 
            cmd.id.toLowerCase().includes('browser')
        );
        if (webCmds.length > 0) {
            new Notice(`Found ${webCmds.length} web-related commands. Check console for details.`, 5000);
        }
    }

    private async createBookmarks() {
        const bookmarksSection = this.container.createDiv({ cls: 'bookmarks-section' });
        
        bookmarksSection.createEl('h2', { text: this.plugin.settings.bookmarksSectionTitle, cls: 'section-title' });
        
        // Get bookmarks
        const bookmarks = await this.getBookmarks();
        
        if (bookmarks.length === 0) {
            this.renderBookmarksEmptyState(bookmarksSection);
            return;
        }
        
        // Create bookmarks list directly (like recent files)
        const bookmarksList = bookmarksSection.createDiv({ cls: 'recent-list' });
        
        // Render bookmarks directly without categories (limited by settings)
        const limitedBookmarks = bookmarks.slice(0, this.plugin.settings.maxBookmarks);
        for (const bookmark of limitedBookmarks) {
            this.renderBookmarkItem(bookmarksList, bookmark.file);
        }
    }

    private createRecentFiles() {
        const recentSection = this.container.createDiv({ cls: 'recent-section' });
        
        recentSection.createEl('h2', { text: this.plugin.settings.recentFilesSectionTitle, cls: 'section-title' });
        
        const recentList = recentSection.createDiv({ cls: 'recent-list' });
        
        // Get recent files
        const recentFiles = this.plugin.app.vault.getMarkdownFiles()
            .sort((a, b) => b.stat.mtime - a.stat.mtime)
            .slice(0, this.plugin.settings.maxRecentFiles);
        
        if (recentFiles.length === 0) {
            recentList.createEl('div', { text: 'No files found', cls: 'empty-state' });
            return;
        }
        
        recentFiles.forEach(file => {
            const fileItem = recentList.createDiv({ cls: 'file-item' });
            
            const fileInfo = fileItem.createDiv({ cls: 'file-info' });
            fileInfo.createEl('div', { text: file.basename, cls: 'file-name' });
            
            // Add hover preview functionality
            let previewTimeout: NodeJS.Timeout;
            let previewEl: HTMLElement | null = null;
            
            fileItem.addEventListener('mouseenter', () => {
                previewTimeout = setTimeout(async () => {
                    previewEl = await this.showFilePreview(file, fileItem);
                }, 500); // 500ms delay before showing preview
            });
            
            fileItem.addEventListener('mouseleave', () => {
                clearTimeout(previewTimeout);
                if (previewEl) {
                    previewEl.remove();
                    previewEl = null;
                }
            });
            
            // Also remove preview on click to prevent blocking
            fileItem.addEventListener('mousedown', () => {
                clearTimeout(previewTimeout);
                if (previewEl) {
                    previewEl.remove();
                    previewEl = null;
                }
            });
            
            fileItem.addEventListener('click', () => {
                this.plugin.app.workspace.getLeaf().openFile(file);
            });
        });
    }

    private initializeSearch() {
        // Search widget is already initialized in createSearchSection
        // Add any additional search setup here if needed
    }

    // Action methods
    private async createNewNote() {
        const fileName = `Untitled-${Date.now()}`;
        const file = await this.plugin.app.vault.create(`${fileName}.md`, '');
        await this.plugin.app.workspace.getLeaf().openFile(file);
    }

    private async openRandomNote() {
        const files = this.plugin.app.vault.getMarkdownFiles();
        if (files.length > 0) {
            const randomFile = files[Math.floor(Math.random() * files.length)];
            await this.plugin.app.workspace.getLeaf().openFile(randomFile);
        }
    }

    private toggleTheme() {
        // Toggle between light and dark theme
        const currentTheme = (this.plugin.app as any).vault.getConfig('theme');
        const newTheme = currentTheme === 'obsidian' ? 'moonstone' : 'obsidian';
        (this.plugin.app as any).vault.setConfig('theme', newTheme);
    }

    private openCanvas() {
        // Try to create a new canvas
        try {
            (this.plugin.app as any).commands.executeCommandById('canvas:new-file');
            
        } catch (error) {
            // Fallback: inform user that Canvas plugin is not enabled
            new Notice('Canvas plugin is not enabled. Please enable it in Community Plugins.');
        }
    }

    private async openExcalidraw() {
        // Check if Excalidraw plugin is available
        const allCommands = (this.plugin.app as any).commands.commands;
        const excalidrawCommands = Object.keys(allCommands).filter(id => id.includes('excalidraw'));
        
        if (excalidrawCommands.length === 0) {
            new Notice('Excalidraw plugin is not installed or enabled. Please install it from Community Plugins.');
            return;
        }
        
        try {
            // Use the autocreate command to create a new Excalidraw drawing
            (this.plugin.app as any).commands.executeCommandById('obsidian-excalidraw-plugin:excalidraw-autocreate-newtab');
        } catch (error) {
            console.error('Failed to create Excalidraw drawing:', error);
            
            // Fallback to basic autocreate
            try {
                (this.plugin.app as any).commands.executeCommandById('obsidian-excalidraw-plugin:excalidraw-autocreate');
            } catch (fallbackError) {
                new Notice('Failed to create Excalidraw drawing. Please check if the plugin is properly configured.');
            }
        }
    }

    private openWebViewer() {
        // Check if web viewer is available
        const allCommands = (this.plugin.app as any).commands.commands;
        const hasWebViewer = 'webviewer:open' in allCommands;
        
        if (!hasWebViewer) {
            // Fallback: open Google in external browser
            const url = 'https://www.google.com';
            window.open(url, '_blank');
            new Notice('Web viewer plugin is not enabled. Opened Google in external browser.');
            return;
        }
        
        try {
            // Open web viewer
            (this.plugin.app as any).commands.executeCommandById('webviewer:open');
        } catch (error) {
            console.error('Failed to open web viewer:', error);
            // Fallback to external browser
            const url = 'https://www.google.com';
            window.open(url, '_blank');
            new Notice('Failed to open web viewer. Opened Google in external browser.');
        }
    }

    private async openTodayNote() {
        // Check if daily notes plugin is available
        const allCommands = (this.plugin.app as any).commands.commands;
        const hasDailyNotes = 'daily-notes' in allCommands;
        
        if (!hasDailyNotes) {
            new Notice('Daily Notes plugin is not enabled. Please enable it in Core Plugins.');
            return;
        }
        
        try {
            // Use the main daily-notes command to open today's note
            (this.plugin.app as any).commands.executeCommandById('daily-notes');
        } catch (error) {
            console.error('Failed to open today\'s note:', error);
            
            // Fallback: create or open note with today's date
            const today = new Date();
            const dateStr = today.getFullYear() + '-' + 
                           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(today.getDate()).padStart(2, '0');
            
            const fileName = `${dateStr}.md`;
            const existingFile = this.plugin.app.vault.getAbstractFileByPath(fileName);
            
            if (existingFile && existingFile.path.endsWith('.md')) {
                await this.plugin.app.workspace.getLeaf().openFile(existingFile as any);
            } else {
                try {
                    const file = await this.plugin.app.vault.create(fileName, `# ${dateStr}\n\n`);
                    await this.plugin.app.workspace.getLeaf().openFile(file);
                } catch (createError) {
                    new Notice(`Could not create today's note: ${fileName}`);
                }
            }
        }
    }

    private async openYesterdayNote() {
        // Check if daily notes plugin is available
        const allCommands = (this.plugin.app as any).commands.commands;
        const hasDailyNotes = 'daily-notes:goto-prev' in allCommands;
        
        if (!hasDailyNotes) {
            new Notice('Daily Notes plugin is not enabled. Please enable it in Core Plugins.');
            return;
        }
        
        try {
            // Use goto-prev command to open previous daily note
            (this.plugin.app as any).commands.executeCommandById('daily-notes:goto-prev');
        } catch (error) {
            console.error('Failed to open yesterday\'s note:', error);
            
            // Fallback: open note with yesterday's date
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.getFullYear() + '-' + 
                           String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(yesterday.getDate()).padStart(2, '0');
            
            const fileName = `${dateStr}.md`;
            const existingFile = this.plugin.app.vault.getAbstractFileByPath(fileName);
            
            if (existingFile && existingFile.path.endsWith('.md')) {
                await this.plugin.app.workspace.getLeaf().openFile(existingFile as any);
            } else {
                new Notice(`Yesterday's note (${dateStr}) not found.`);
            }
        }
    }

    private openGraph() {
        (this.plugin.app as any).commands.executeCommandById('graph:open');
    }


    private showVaultStats() {
        const files = this.plugin.app.vault.getMarkdownFiles();
        const totalFiles = files.length;
        const message = `📊 Vault Statistics:\n\n` +
                       `📄 Total Files: ${totalFiles}\n` +
                       `💾 Vault Size: ${this.formatBytes(files.reduce((acc, file) => acc + file.stat.size, 0))}`;
        
        new Notice(message, 5000);
    }

    private openSettings() {
        (this.plugin.app as any).commands.executeCommandById('app:open-settings');
    }

    private focusSearch() {
        if (this.searchWidget) {
            this.searchWidget.focus();
        }
    }

    // Utility methods
    private getGreeting(hour: number): string {
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    }

    private formatRelativeTime(timestamp: number): string {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }

    private formatBytes(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    private async showFilePreview(file: TFile, targetElement: HTMLElement): Promise<HTMLElement> {
        // Create preview container
        const preview = document.createElement('div');
        preview.className = 'file-preview-popup';
        
        // Get file content
        let content = '';
        try {
            const fileContent = await this.plugin.app.vault.read(file);
            // Limit preview to first 300 characters
            content = fileContent.length > 300 
                ? fileContent.substring(0, 300) + '...'
                : fileContent;
        } catch (error) {
            content = 'Unable to preview file';
        }
        
        // Create preview content
        const previewHeader = preview.createDiv({ cls: 'preview-header' });
        previewHeader.createEl('strong', { text: file.basename });
        previewHeader.createEl('span', { 
            text: ` • ${Math.round(file.stat.size / 1024)}KB`,
            cls: 'preview-size'
        });
        
        const previewContent = preview.createDiv({ cls: 'preview-content' });
        previewContent.createEl('div', { text: content, cls: 'preview-text' });
        
        // Position the preview on the left side
        const rect = targetElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        preview.style.position = 'absolute';
        preview.style.right = `${containerRect.right - rect.left + 10}px`;
        preview.style.top = `${rect.top - containerRect.top}px`;
        preview.style.zIndex = '1000';
        
        // Add to container
        this.container.appendChild(preview);
        
        return preview;
    }

    // Bookmark methods
    private async getBookmarks(): Promise<Array<{file: TFile, category: string, order: number}>> {
        const bookmarks: Array<{file: TFile, category: string, order: number}> = [];
        
        try {
            // Get Obsidian's bookmarks
            const bookmarksPlugin = (this.plugin.app as any).internalPlugins?.plugins?.bookmarks?.instance;
            
            if (bookmarksPlugin && bookmarksPlugin.items) {
                const bookmarkItems = bookmarksPlugin.items;
                
                for (let i = 0; i < bookmarkItems.length; i++) {
                    const item = bookmarkItems[i];
                    
                    if (item.type === 'file' || item.path) {
                        const path = item.path || item.ctime;
                        const file = this.plugin.app.vault.getAbstractFileByPath(path);
                        
                        if (file && file.path.endsWith('.md')) {
                            bookmarks.push({
                                file: file as TFile,
                                category: 'Bookmarked',
                                order: i
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error accessing bookmarks:', error);
        }
        
        return bookmarks;
    }

    private renderBookmarksEmptyState(container: HTMLElement) {
        const emptyState = container.createDiv({ cls: 'empty-state' });
        emptyState.createEl('div', { text: '⭐ No bookmarks yet' });
        emptyState.createEl('div', { 
            text: 'Bookmark files in Obsidian to see them here',
            cls: 'empty-state-hint'
        });
    }

    private renderBookmarkItem(container: HTMLElement, file: TFile) {
        const fileItem = container.createDiv({ cls: 'file-item' });
        
        const fileInfo = fileItem.createDiv({ cls: 'file-info' });
        fileInfo.createEl('div', { text: file.basename, cls: 'file-name' });
        
        // Add hover preview and click functionality
        this.addBookmarkInteractions(fileItem, file);
    }

    private addBookmarkInteractions(item: HTMLElement, file: TFile) {
        // Add hover preview functionality
        let previewTimeout: NodeJS.Timeout;
        let previewEl: HTMLElement | null = null;
        
        item.addEventListener('mouseenter', () => {
            previewTimeout = setTimeout(async () => {
                previewEl = await this.showFilePreview(file, item);
            }, 500);
        });
        
        item.addEventListener('mouseleave', () => {
            clearTimeout(previewTimeout);
            if (previewEl) {
                previewEl.remove();
                previewEl = null;
            }
        });
        
        item.addEventListener('mousedown', () => {
            clearTimeout(previewTimeout);
            if (previewEl) {
                previewEl.remove();
                previewEl = null;
            }
        });
        
        // Click to open
        item.addEventListener('click', () => {
            this.plugin.app.workspace.getLeaf().openFile(file);
        });
    }

    public refresh() {
        // Re-render the entire layout (cleanup is handled in render())
        this.render().catch(console.error);
    }

    private applyThemeCustomizations() {
        // Apply accent color customization
        if (!this.plugin.settings.useObsidianAccent) {
            this.container.style.setProperty('--interactive-accent', this.plugin.settings.customAccentColor);
            this.container.style.setProperty('--interactive-accent-hover', this.plugin.settings.customAccentColor + 'dd');
            this.container.style.setProperty('--text-accent', this.plugin.settings.customAccentColor);
        } else {
            // Remove custom properties to use Obsidian defaults
            this.container.style.removeProperty('--interactive-accent');
            this.container.style.removeProperty('--interactive-accent-hover');
            this.container.style.removeProperty('--text-accent');
        }
        
        // Apply background customizations
        this.applyBackgroundStyles();
    }
    
    private applyBackgroundStyles() {
        // Reset background styles
        this.container.style.backgroundImage = '';
        this.container.style.backgroundColor = '';
        
        // Apply background color if set
        if (this.plugin.settings.backgroundColor) {
            this.container.style.backgroundColor = this.plugin.settings.backgroundColor;
        }
        
        // Apply background image if set
        if (this.plugin.settings.backgroundImage) {
            const imageUrl = this.processImageUrl(this.plugin.settings.backgroundImage);
            this.container.style.backgroundImage = `url('${imageUrl}')`;
            this.container.style.backgroundSize = 'cover';
            this.container.style.backgroundPosition = 'center';
            this.container.style.backgroundRepeat = 'no-repeat';
            
            // Apply overlay if enabled
            if (this.plugin.settings.backgroundOverlay) {
                // Create overlay element if it doesn't exist
                let overlay = this.container.querySelector('.homepage-background-overlay') as HTMLElement;
                if (!overlay) {
                    overlay = this.container.createDiv({ cls: 'homepage-background-overlay' });
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.right = '0';
                    overlay.style.bottom = '0';
                    overlay.style.pointerEvents = 'none';
                    overlay.style.zIndex = '0';
                    
                    // Ensure all content is above the overlay
                    const sections = this.container.querySelectorAll('.header-section, .search-section, .quickactions-section, .bookmarks-section, .recent-section, .todos-section');
                    sections.forEach(section => {
                        (section as HTMLElement).style.position = 'relative';
                        (section as HTMLElement).style.zIndex = '1';
                    });
                }
                
                // Apply overlay with opacity
                const opacity = this.plugin.settings.backgroundOverlayOpacity;
                overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
            } else {
                // Remove overlay if it exists
                const overlay = this.container.querySelector('.homepage-background-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
        }
    }
    
    private processImageUrl(url: string): string {
        // Handle vault-relative paths
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
            // This is a vault path
            const file = this.plugin.app.vault.getAbstractFileByPath(url);
            if (file) {
                // Convert to resource URL
                return this.plugin.app.vault.getResourcePath(file as any);
            }
        }
        return url;
    }
    
    private applyOpacityToColor(color: string, opacity: number): string {
        // If the color is already in rgba format, extract and replace alpha
        if (color.startsWith('rgba(')) {
            const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
            if (rgbaMatch) {
                const [, r, g, b] = rgbaMatch;
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
        }
        
        // If the color is in rgb format, convert to rgba
        if (color.startsWith('rgb(')) {
            const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
                const [, r, g, b] = rgbMatch;
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
        }
        
        // If the color is a hex value, convert to rgba
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            let r: number, g: number, b: number;
            
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else {
                // Invalid hex, return as is
                return color;
            }
            
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        
        // For CSS variables or named colors, use color-mix if modern browsers support it
        // Fallback: use the color as-is
        return color;
    }
    
    private applyWidgetBackgrounds() {
        // Apply backgrounds to each widget section
        const widgetMappings = [
            { selector: '.search-section', key: 'search' as const },
            { selector: '.quickactions-section', key: 'quickActions' as const },
            { selector: '.bookmarks-section', key: 'bookmarks' as const },
            { selector: '.recent-section', key: 'recentFiles' as const },
            { selector: '.todos-section', key: 'todos' as const }
        ];
        
        widgetMappings.forEach(({ selector, key }) => {
            const section = this.container.querySelector(selector) as HTMLElement;
            if (section) {
                this.applyWidgetBackground(section, key);
            }
        });
    }
    
    private applyWidgetBackground(element: HTMLElement, widgetKey: keyof typeof this.plugin.settings.widgetBackgrounds) {
        // Safety check for missing widgetBackgrounds settings
        if (!this.plugin.settings.widgetBackgrounds) {
            return;
        }
        
        const settings = this.plugin.settings.widgetBackgrounds[widgetKey];
        
        if (!settings) {
            return;
        }
        
        // Remove any existing widget background elements and styles
        element.classList.remove('has-widget-background');
        const existingBg = element.querySelector('.widget-background-overlay');
        if (existingBg) {
            existingBg.remove();
        }
        element.style.backgroundImage = '';
        element.style.backgroundColor = '';
        element.removeAttribute('data-has-image');
        element.style.removeProperty('--widget-bg-opacity');
        element.style.removeProperty('--widget-bg-image');
        
        if (settings.enabled) {
            element.classList.add('has-widget-background');
            
            // Create a background overlay element
            const bgOverlay = element.createDiv({ cls: 'widget-background-overlay' });
            bgOverlay.style.position = 'absolute';
            bgOverlay.style.top = '0';
            bgOverlay.style.left = '0';
            bgOverlay.style.right = '0';
            bgOverlay.style.bottom = '0';
            bgOverlay.style.pointerEvents = 'none';
            bgOverlay.style.zIndex = '0';
            bgOverlay.style.borderRadius = 'var(--radius-m)';
            
            // Apply background image if set
            if (settings.image) {
                const imageUrl = this.processImageUrl(settings.image);
                
                bgOverlay.style.backgroundImage = `url('${imageUrl}')`;
                bgOverlay.style.backgroundSize = 'cover';
                bgOverlay.style.backgroundPosition = 'center';
                bgOverlay.style.backgroundRepeat = 'no-repeat';
                bgOverlay.style.opacity = settings.opacity.toString();
                
                element.setAttribute('data-has-image', 'true');
            } 
            // Apply background color if no image and color is set
            else if (settings.color) {
                element.removeAttribute('data-has-image');
                
                // Apply color with opacity
                const backgroundColor = this.applyOpacityToColor(settings.color, settings.opacity);
                bgOverlay.style.backgroundColor = backgroundColor;
            } else {
                bgOverlay.remove(); // Remove the overlay if no background is set
            }
            
            // Ensure the parent element supports absolute positioning
            element.style.position = 'relative';
            
            // Ensure all content is above the background
            const children = Array.from(element.children) as HTMLElement[];
            children.forEach(child => {
                if (child !== bgOverlay) {
                    child.style.position = 'relative';
                    child.style.zIndex = '1';
                }
            });
        }
    }

    private createTodos() {
        const todosSection = this.container.createDiv({ cls: 'todos-section' });
        
        todosSection.createEl('h2', { text: this.plugin.settings.todosSectionTitle || 'Tasks', cls: 'section-title' });
        
        // Create todo widget container
        const todosContainer = todosSection.createDiv({ cls: 'todos-container' });
        this.todoWidget = new TodoWidget(this.plugin, todosContainer);
    }

    public destroy() {
        // Use the cleanup method for consistency
        this.cleanup();
    }
}