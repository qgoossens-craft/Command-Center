import { App, PluginSettingTab, Setting } from 'obsidian';
import type { CommandCenterPlugin } from '../main';
import type { CommandCenterSettings } from '../types/settings';
import { PLUGIN_NAME } from '../constants';
import { CollapsibleSection } from '../utils/CollapsibleSection';

export class CommandCenterSettingsTab extends PluginSettingTab {
    plugin: CommandCenterPlugin;

    constructor(app: App, plugin: CommandCenterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        
        // Store current scroll position
        const scrollPosition = containerEl.scrollTop;
        
        containerEl.empty();

        containerEl.createEl('h2', { text: `${PLUGIN_NAME} Settings` });

        // General Settings Section
        const generalSection = new CollapsibleSection(
            containerEl,
            'General Settings',
            'Basic configuration options for your homepage',
            '⚙️',
            false
        );
        const generalEl = generalSection.getContentEl();
        
        // Custom Title
        new Setting(generalEl)
            .setName('Homepage Title')
            .setDesc('The main title displayed on your homepage')
            .addText(text => text
                .setPlaceholder('Command Center')
                .setValue(this.plugin.settings.customTitle)
                .onChange(async (value) => {
                    this.plugin.settings.customTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Custom Message
        new Setting(generalEl)
            .setName('Custom Message')
            .setDesc('Custom message to display instead of title (leave empty to show title)')
            .addText(text => text
                .setPlaceholder('Welcome to your workspace')
                .setValue(this.plugin.settings.customMessage)
                .onChange(async (value) => {
                    this.plugin.settings.customMessage = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Open on Startup
        new Setting(generalEl)
            .setName('Open on startup')
            .setDesc('Automatically open the homepage when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.openOnStartup)
                .onChange(async (value) => {
                    this.plugin.settings.openOnStartup = value;
                    await this.plugin.saveSettings();
                }));

        // Visual Settings Section
        const visualSection = new CollapsibleSection(
            containerEl,
            'Visual Settings',
            'Customize the appearance and background of your homepage',
            '🎨',
            true
        );
        const visualEl = visualSection.getContentEl();

        // Title Font Size
        new Setting(visualEl)
            .setName('Title font size')
            .setDesc('Size of the main title (e.g., 2em, 3em, 48px)')
            .addText(text => text
                .setPlaceholder('3em')
                .setValue(this.plugin.settings.titleFontSize)
                .onChange(async (value) => {
                    this.plugin.settings.titleFontSize = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Background Image
        new Setting(visualEl)
            .setName('Background image')
            .setDesc('URL or path to background image (leave empty for none)')
            .addText(text => text
                .setPlaceholder('https://example.com/image.jpg')
                .setValue(this.plugin.settings.backgroundImage)
                .onChange(async (value) => {
                    this.plugin.settings.backgroundImage = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Background Color
        new Setting(visualEl)
            .setName('Background color')
            .setDesc('Background color (CSS format, e.g., #1e1e1e, rgb(30,30,30))')
            .addText(text => text
                .setPlaceholder('#1e1e1e')
                .setValue(this.plugin.settings.backgroundColor)
                .onChange(async (value) => {
                    this.plugin.settings.backgroundColor = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Background Overlay
        new Setting(visualEl)
            .setName('Background overlay')
            .setDesc('Add a dark overlay over background images for better text readability')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.backgroundOverlay)
                .onChange(async (value) => {
                    this.plugin.settings.backgroundOverlay = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Overlay Opacity
        new Setting(visualEl)
            .setName('Overlay opacity')
            .setDesc('Strength of the background overlay (0 = transparent, 1 = opaque)')
            .addSlider(slider => slider
                .setLimits(0, 1, 0.1)
                .setValue(this.plugin.settings.backgroundOverlayOpacity)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.backgroundOverlayOpacity = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Banner Settings Section
        const bannerSection = new CollapsibleSection(
            containerEl,
            'Banner Settings',
            'Configure banner images and text overlays',
            '🖼️',
            true
        );
        const bannerEl = bannerSection.getContentEl();

        // Show Banner
        new Setting(bannerEl)
            .setName('Show banner')
            .setDesc('Display a banner at the top of the homepage, behind the title')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBanner)
                .onChange(async (value) => {
                    this.plugin.settings.showBanner = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.display(); // Refresh to show/hide banner settings
                }));

        // Banner settings (only show if banner is enabled)
        if (this.plugin.settings.showBanner) {
            // Banner Text
            new Setting(bannerEl)
                .setName('Banner text')
                .setDesc('Text to display on the banner (leave empty for image-only banner)')
                .addText(text => text
                    .setPlaceholder('Welcome to your workspace')
                    .setValue(this.plugin.settings.bannerText)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerText = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Image
            new Setting(bannerEl)
                .setName('Banner image')
                .setDesc('URL or path to banner background image (leave empty for text-only banner)')
                .addText(text => text
                    .setPlaceholder('https://example.com/banner.jpg')
                    .setValue(this.plugin.settings.bannerImage)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerImage = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Height
            new Setting(bannerEl)
                .setName('Banner height')
                .setDesc('Height of the banner (e.g., 200px, 15vh, 10em)')
                .addText(text => text
                    .setPlaceholder('200px')
                    .setValue(this.plugin.settings.bannerHeight)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerHeight = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Opacity
            new Setting(bannerEl)
                .setName('Banner opacity')
                .setDesc('Opacity of the banner background (0 = transparent, 1 = opaque)')
                .addSlider(slider => slider
                    .setLimits(0, 1, 0.1)
                    .setValue(this.plugin.settings.bannerOpacity)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bannerOpacity = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Text Position
            new Setting(bannerEl)
                .setName('Text position')
                .setDesc('Position of the text within the banner')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'center': 'Center',
                        'left': 'Left',
                        'right': 'Right',
                        'top-left': 'Top Left',
                        'top-center': 'Top Center',
                        'top-right': 'Top Right',
                        'bottom-left': 'Bottom Left',
                        'bottom-center': 'Bottom Center',
                        'bottom-right': 'Bottom Right'
                    })
                    .setValue(this.plugin.settings.bannerTextPosition)
                    .onChange(async (value: any) => {
                        this.plugin.settings.bannerTextPosition = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Text Size
            new Setting(bannerEl)
                .setName('Text size')
                .setDesc('Size of the banner text')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'var(--font-ui-small)': 'Small',
                        'var(--font-ui-medium)': 'Medium',
                        'var(--font-ui-large)': 'Large',
                        'var(--font-ui-larger)': 'Larger',
                        '1.5em': 'Extra Large',
                        '2em': 'XXL',
                        '2.5em': 'Huge',
                        '3em': 'Massive',
                        'custom': 'Custom...'
                    })
                    .setValue(this.plugin.settings.bannerTextSize)
                    .onChange(async (value) => {
                        if (value === 'custom') {
                            // Keep current value and don't change it
                            return;
                        }
                        this.plugin.settings.bannerTextSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Custom text size input (only show if custom is selected)
            if (this.plugin.settings.bannerTextSize === 'custom' || 
                !['var(--font-ui-small)', 'var(--font-ui-medium)', 'var(--font-ui-large)', 'var(--font-ui-larger)', '1.5em', '2em', '2.5em', '3em'].includes(this.plugin.settings.bannerTextSize)) {
                new Setting(bannerEl)
                    .setName('Custom text size')
                    .setDesc('Custom size value (e.g., 1.8em, 24px, large)')
                    .addText(text => text
                        .setPlaceholder('1.8em')
                        .setValue(this.plugin.settings.bannerTextSize === 'custom' ? '' : this.plugin.settings.bannerTextSize)
                        .onChange(async (value) => {
                            this.plugin.settings.bannerTextSize = value || 'var(--font-ui-larger)';
                            await this.plugin.saveSettings();
                            this.plugin.refreshHomepage();
                        }));
            }

            // Text Color - use the new createColorPaletteSetting method
            this.createBannerColorPaletteSetting(bannerEl, 'Text color', 'Choose a color for the banner text', 'bannerTextColor');

            // Text Shadow
            new Setting(bannerEl)
                .setName('Text shadow')
                .setDesc('Add shadow effect to banner text for better readability')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.bannerTextShadow)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerTextShadow = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Image Fit
            new Setting(bannerEl)
                .setName('Image fit')
                .setDesc('How the background image should fit within the banner')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'cover': 'Cover - Fill entire banner, may crop image',
                        'contain': 'Contain - Fit entire image, may show empty space',
                        'fill': 'Fill - Stretch to fill banner (may distort)',
                        'scale-down': 'Scale Down - Smaller of contain or original size'
                    })
                    .setValue(this.plugin.settings.bannerImageFit)
                    .onChange(async (value: any) => {
                        this.plugin.settings.bannerImageFit = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Image Position
            new Setting(bannerEl)
                .setName('Image position')
                .setDesc('Position of the background image within the banner')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'center': 'Center',
                        'top': 'Top',
                        'bottom': 'Bottom',
                        'left': 'Left',
                        'right': 'Right',
                        'top-left': 'Top Left',
                        'top-right': 'Top Right',
                        'bottom-left': 'Bottom Left',
                        'bottom-right': 'Bottom Right'
                    })
                    .setValue(this.plugin.settings.bannerImagePosition)
                    .onChange(async (value: any) => {
                        this.plugin.settings.bannerImagePosition = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Overlay Color
            new Setting(bannerEl)
                .setName('Overlay color')
                .setDesc('Color of the overlay behind text (e.g., #000000, rgb(0,0,0))')
                .addText(text => text
                    .setPlaceholder('#000000')
                    .setValue(this.plugin.settings.bannerOverlayColor)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerOverlayColor = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Overlay Opacity
            new Setting(bannerEl)
                .setName('Overlay opacity')
                .setDesc('Opacity of the text overlay background (0 = transparent, 1 = opaque)')
                .addSlider(slider => slider
                    .setLimits(0, 1, 0.1)
                    .setValue(this.plugin.settings.bannerOverlayOpacity)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bannerOverlayOpacity = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Image Blur
            new Setting(bannerEl)
                .setName('Image blur')
                .setDesc('Blur effect for the background image (0 = no blur, 10 = heavy blur)')
                .addSlider(slider => slider
                    .setLimits(0, 10, 1)
                    .setValue(this.plugin.settings.bannerBlur)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bannerBlur = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Layout Settings Section
        const layoutSection = new CollapsibleSection(
            containerEl,
            'Layout Settings',
            'Configure layout presets and widget arrangement',
            '⚡',
            true
        );
        const layoutEl = layoutSection.getContentEl();

        // Layout Preset
        new Setting(layoutEl)
            .setName('Layout preset')
            .setDesc('Choose a predefined layout style that affects widget arrangement')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    'default': 'Default - Balanced grid layout',
                    'minimal': 'Minimal - Clean single column',
                    'dashboard': 'Dashboard - Information-dense grid',
                    'productivity': 'Productivity - Focus-oriented layout'
                })
                .setValue(this.plugin.settings.layoutPreset)
                .onChange(async (value: any) => {
                    this.plugin.settings.layoutPreset = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Widget Columns
        new Setting(layoutEl)
            .setName('Widget columns')
            .setDesc('Number of columns for widget layout (overridden by layout presets)')
            .addSlider(slider => slider
                .setLimits(1, 5, 1)
                .setValue(this.plugin.settings.widgetColumns)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.widgetColumns = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Widget Visibility Section
        const widgetVisibilitySection = new CollapsibleSection(
            containerEl,
            'Widget Visibility',
            'Control which widgets appear on your homepage (widgets will be available in future phases)',
            '📊',
            true
        );
        const widgetVisibilityEl = widgetVisibilitySection.getContentEl();

        // Show Search
        new Setting(widgetVisibilityEl)
            .setName('Show search widget')
            .setDesc('Display universal search bar with file search and quick actions')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showSearch)
                .onChange(async (value) => {
                    this.plugin.settings.showSearch = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Show Bookmarks
        new Setting(widgetVisibilityEl)
            .setName('Show bookmarks widget')
            .setDesc('Display bookmarks and starred files')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBookmarks)
                .onChange(async (value) => {
                    this.plugin.settings.showBookmarks = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Show Recent Files
        new Setting(widgetVisibilityEl)
            .setName('Show recent files widget')
            .setDesc('Display recently modified files')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showRecentFiles)
                .onChange(async (value) => {
                    this.plugin.settings.showRecentFiles = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));
                
        // Show Pinned Notes
        new Setting(widgetVisibilityEl)
            .setName('Show pinned notes')
            .setDesc('Display pinned notes containers below search')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showPinnedNotes)
                .onChange(async (value) => {
                    this.plugin.settings.showPinnedNotes = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.display(); // Refresh to show/hide related settings
                }));
                
        // Pinned Notes View Mode (only show if pinned notes are enabled)
        if (this.plugin.settings.showPinnedNotes) {
            new Setting(widgetVisibilityEl)
                .setName('Pinned notes view mode')
                .setDesc('Display pinned notes as list or gallery')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'list': 'List View',
                        'gallery': 'Gallery View'
                    })
                    .setValue(this.plugin.settings.pinnedNotesViewMode)
                    .onChange(async (value: 'list' | 'gallery') => {
                        this.plugin.settings.pinnedNotesViewMode = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Content Limits Section
        const contentLimitsSection = new CollapsibleSection(
            containerEl,
            'Content Limits',
            'Set maximum number of items to display in each widget',
            '🔢',
            true
        );
        const contentLimitsEl = contentLimitsSection.getContentEl();

        // Max Recent Files
        new Setting(contentLimitsEl)
            .setName('Max recent files')
            .setDesc('Maximum number of recent files to display')
            .addSlider(slider => slider
                .setLimits(1, 20, 1)
                .setValue(this.plugin.settings.maxRecentFiles)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxRecentFiles = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Max Bookmarks
        new Setting(contentLimitsEl)
            .setName('Max bookmarks')
            .setDesc('Maximum number of bookmarks to display')
            .addSlider(slider => slider
                .setLimits(1, 20, 1)
                .setValue(this.plugin.settings.maxBookmarks)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxBookmarks = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Max Todos
        new Setting(contentLimitsEl)
            .setName('Max todos')
            .setDesc('Maximum number of todos to display')
            .addSlider(slider => slider
                .setLimits(1, 20, 1)
                .setValue(this.plugin.settings.maxTodos)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxTodos = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Section Names Section
        const sectionNamesSection = new CollapsibleSection(
            containerEl,
            'Section Names',
            'Customize the titles displayed for each widget section',
            '🏷️',
            true
        );
        const sectionNamesEl = sectionNamesSection.getContentEl();

        // Search Section Title
        new Setting(sectionNamesEl)
            .setName('Search section title')
            .setDesc('Title for the search section')
            .addText(text => text
                .setPlaceholder('Universal Search')
                .setValue(this.plugin.settings.searchSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.searchSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Quick Actions Section Title
        new Setting(sectionNamesEl)
            .setName('Quick actions section title')
            .setDesc('Title for the quick actions section')
            .addText(text => text
                .setPlaceholder('Quick Actions')
                .setValue(this.plugin.settings.quickActionsSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.quickActionsSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Bookmarks Section Title
        new Setting(sectionNamesEl)
            .setName('Bookmarks section title')
            .setDesc('Title for the bookmarks section')
            .addText(text => text
                .setPlaceholder('Bookmarks')
                .setValue(this.plugin.settings.bookmarksSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.bookmarksSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Recent Files Section Title
        new Setting(sectionNamesEl)
            .setName('Recent files section title')
            .setDesc('Title for the recent files section')
            .addText(text => text
                .setPlaceholder('Recent Files')
                .setValue(this.plugin.settings.recentFilesSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.recentFilesSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Todos Section Title
        new Setting(sectionNamesEl)
            .setName('Todos section title')
            .setDesc('Title for the todos section')
            .addText(text => text
                .setPlaceholder('Tasks')
                .setValue(this.plugin.settings.todosSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.todosSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Todo Settings Section
        const todoSettingsSection = new CollapsibleSection(
            containerEl,
            'Todo Settings',
            'Configure task parsing, source files, and cleanup options',
            '✅',
            true
        );
        const todoSettingsEl = todoSettingsSection.getContentEl();

        // Todo Parse Mode
        new Setting(todoSettingsEl)
            .setName('Task parsing mode')
            .setDesc('Parse tasks from entire vault or a single file')
            .addDropdown(dropdown => dropdown
                .addOption('vault', 'Entire vault')
                .addOption('single-file', 'Single file')
                .setValue(this.plugin.settings.todoParseMode)
                .onChange(async (value: 'vault' | 'single-file') => {
                    this.plugin.settings.todoParseMode = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.display(); // Refresh to show/hide source file setting
                }));

        // Todo Source File (only show in single-file mode)
        if (this.plugin.settings.todoParseMode === 'single-file') {
            new Setting(todoSettingsEl)
                .setName('Task source file')
                .setDesc('File to read tasks from (e.g., Tasks.md)')
                .addText(text => text
                    .setPlaceholder('Tasks.md')
                    .setValue(this.plugin.settings.todoSourceFile)
                    .onChange(async (value) => {
                        this.plugin.settings.todoSourceFile = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Default Todo File (for new tasks)
        new Setting(todoSettingsEl)
            .setName('Default task file')
            .setDesc('File where new tasks are added when in vault mode')
            .addText(text => text
                .setPlaceholder('Tasks.md')
                .setValue(this.plugin.settings.defaultTodoFile)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTodoFile = value;
                    await this.plugin.saveSettings();
                }));

        // Auto Cleanup Completed Tasks
        new Setting(todoSettingsEl)
            .setName('Auto-cleanup completed tasks')
            .setDesc('Automatically remove completed tasks after a specified number of days (0 = immediately)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoCleanupCompleted)
                .onChange(async (value) => {
                    this.plugin.settings.autoCleanupCompleted = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show/hide cleanup delay setting
                }));

        // Cleanup Delay Days (only show if auto-cleanup is enabled)
        if (this.plugin.settings.autoCleanupCompleted) {
            new Setting(todoSettingsEl)
                .setName('Cleanup delay (days)')
                .setDesc('Number of days to wait before removing completed tasks (0 = immediately)')
                .addSlider(slider => slider
                    .setLimits(0, 30, 1)
                    .setValue(this.plugin.settings.cleanupDelayDays)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.cleanupDelayDays = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // Date & Time Settings Section
        const dateTimeSection = new CollapsibleSection(
            containerEl,
            'Date & Time Settings',
            'Customize date and time display formats and appearance',
            '🗓️',
            true
        );
        const dateTimeEl = dateTimeSection.getContentEl();

        // Date Format
        new Setting(dateTimeEl)
            .setName('Date format')
            .setDesc('Custom date format pattern (e.g., "EEEE, MMMM d, yyyy" for "Monday, January 1, 2024")')
            .addText(text => text
                .setPlaceholder('EEEE, MMMM d, yyyy')
                .setValue(this.plugin.settings.dateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.dateFormat = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Add some common format examples
        const dateExamples = dateTimeEl.createDiv({ cls: 'setting-item-description' });
        dateExamples.innerHTML = `
            <strong>Common patterns:</strong><br>
            • <code>EEEE, MMMM d, yyyy</code> → Monday, January 1, 2024<br>
            • <code>EEE, MMM d, yyyy</code> → Mon, Jan 1, 2024<br>
            • <code>MM/dd/yyyy</code> → 01/01/2024<br>
            • <code>dd/MM/yyyy</code> → 01/01/2024<br>
            • <code>yyyy-MM-dd</code> → 2024-01-01
        `;

        // Time Format
        new Setting(dateTimeEl)
            .setName('Time format')
            .setDesc('Custom time format pattern (e.g., "h:mm a" for "1:30 PM")')
            .addText(text => text
                .setPlaceholder('h:mm a')
                .setValue(this.plugin.settings.timeFormat)
                .onChange(async (value) => {
                    this.plugin.settings.timeFormat = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Add time format examples
        const timeExamples = dateTimeEl.createDiv({ cls: 'setting-item-description' });
        timeExamples.innerHTML = `
            <strong>Common patterns:</strong><br>
            • <code>h:mm a</code> → 1:30 PM<br>
            • <code>HH:mm</code> → 13:30<br>
            • <code>h:mm:ss a</code> → 1:30:45 PM<br>
            • <code>HH:mm:ss</code> → 13:30:45
        `;

        // Show Date/Time
        new Setting(dateTimeEl)
            .setName('Show date & time')
            .setDesc('Display date and time in the header')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showDateTime)
                .onChange(async (value) => {
                    this.plugin.settings.showDateTime = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.display(); // Refresh to show/hide date/time settings
                }));

        // Date/time settings (only show if date/time is enabled)
        if (this.plugin.settings.showDateTime) {
            // Position
            new Setting(dateTimeEl)
                .setName('Position')
                .setDesc('Position of date and time relative to the title')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'center': 'Center (below title)',
                        'left': 'Left side',
                        'right': 'Right side',
                        'above-title': 'Above title',
                        'below-title': 'Below title'
                    })
                    .setValue(this.plugin.settings.dateTimePosition)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateTimePosition = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Layout
            new Setting(dateTimeEl)
                .setName('Layout')
                .setDesc('How date and time are arranged')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'horizontal': 'Side by side',
                        'vertical': 'Stacked vertically',
                        'stacked': 'Compact stack'
                    })
                    .setValue(this.plugin.settings.dateTimeLayout)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateTimeLayout = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date Font Size
            new Setting(dateTimeEl)
                .setName('Date size')
                .setDesc('Font size for the date')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'var(--font-ui-small)': 'Small',
                        'var(--font-ui-medium)': 'Medium',
                        'var(--font-ui-large)': 'Large',
                        'var(--font-ui-larger)': 'Larger',
                        '1.5em': 'Extra Large',
                        '2em': 'XXL',
                        'custom': 'Custom...'
                    })
                    .setValue(this.plugin.settings.dateFontSize)
                    .onChange(async (value) => {
                        if (value === 'custom') return;
                        this.plugin.settings.dateFontSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Time Font Size
            new Setting(dateTimeEl)
                .setName('Time size')
                .setDesc('Font size for the time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'var(--font-ui-small)': 'Small',
                        'var(--font-ui-medium)': 'Medium',
                        'var(--font-ui-large)': 'Large',
                        'var(--font-ui-larger)': 'Larger',
                        '1.5em': 'Extra Large',
                        '2em': 'XXL',
                        'custom': 'Custom...'
                    })
                    .setValue(this.plugin.settings.timeFontSize)
                    .onChange(async (value) => {
                        if (value === 'custom') return;
                        this.plugin.settings.timeFontSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date Color
            this.createColorPaletteSetting(dateTimeEl, 'Date color', 'Choose color for the date text', 'dateColor');

            // Time Color
            this.createColorPaletteSetting(dateTimeEl, 'Time color', 'Choose color for the time text', 'timeColor');

            // Background
            new Setting(dateTimeEl)
                .setName('Background')
                .setDesc('Background style behind date/time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'transparent': 'None (transparent)',
                        'var(--background-secondary)': 'Secondary background',
                        'var(--background-modifier-hover)': 'Hover background',
                        'var(--interactive-accent)': 'Accent color',
                        'custom': 'Custom color...'
                    })
                    .setValue(this.plugin.settings.dateTimeBackground)
                    .onChange(async (value) => {
                        if (value === 'custom') return;
                        this.plugin.settings.dateTimeBackground = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Background Opacity
            if (this.plugin.settings.dateTimeBackground !== 'transparent') {
                new Setting(dateTimeEl)
                    .setName('Background opacity')
                    .setDesc('Opacity of the date/time background')
                    .addSlider(slider => slider
                        .setLimits(0, 1, 0.1)
                        .setValue(this.plugin.settings.dateTimeBackgroundOpacity)
                        .setDynamicTooltip()
                        .onChange(async (value) => {
                            this.plugin.settings.dateTimeBackgroundOpacity = value;
                            await this.plugin.saveSettings();
                            this.plugin.refreshHomepage();
                        }));
            }

            // Text Shadow
            new Setting(dateTimeEl)
                .setName('Text shadow')
                .setDesc('Add shadow effect to date/time text')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.dateTimeShadow)
                    .onChange(async (value) => {
                        this.plugin.settings.dateTimeShadow = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Border
            new Setting(dateTimeEl)
                .setName('Border')
                .setDesc('Add border around date/time container')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.dateTimeBorder)
                    .onChange(async (value) => {
                        this.plugin.settings.dateTimeBorder = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Theme Settings Section
        const themeSection = new CollapsibleSection(
            containerEl,
            'Theme Settings',
            'Customize colors and accent settings',
            '🎨',
            true
        );
        const themeEl = themeSection.getContentEl();

        // Use Obsidian Accent
        new Setting(themeEl)
            .setName('Use Obsidian accent color')
            .setDesc('Use Obsidian\'s accent color or set a custom one')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useObsidianAccent)
                .onChange(async (value) => {
                    this.plugin.settings.useObsidianAccent = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.display(); // Refresh to show/hide custom color setting
                }));

        // Custom Accent Color (only show if not using Obsidian accent)
        if (!this.plugin.settings.useObsidianAccent) {
            new Setting(themeEl)
                .setName('Custom accent color')
                .setDesc('Custom accent color (hex format, e.g., #7c3aed)')
                .addText(text => text
                    .setPlaceholder('#7c3aed')
                    .setValue(this.plugin.settings.customAccentColor)
                    .onChange(async (value) => {
                        this.plugin.settings.customAccentColor = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Advanced Settings Section
        const advancedSection = new CollapsibleSection(
            containerEl,
            'Advanced Settings',
            'Reset settings and advanced configuration options',
            '⚙️',
            true
        );
        const advancedEl = advancedSection.getContentEl();
        
        // Reset to Defaults
        new Setting(advancedEl)
            .setName('Reset to defaults')
            .setDesc('Reset all settings to their default values')
            .addButton(button => button
                .setButtonText('Reset')
                .setWarning()
                .onClick(async () => {
                    const confirmed = confirm('Are you sure you want to reset all settings to defaults?');
                    if (confirmed) {
                        Object.assign(this.plugin.settings, { ...this.plugin.settings, ...await import('../types/settings').then(m => m.DEFAULT_SETTINGS) });
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                        this.display(); // Refresh the settings panel
                    }
                }));
        
        // Restore scroll position after a brief delay to allow DOM to settle
        setTimeout(() => {
            containerEl.scrollTop = scrollPosition;
        }, 0);
    }


    private createColorPaletteSetting(containerEl: HTMLElement, name: string, desc: string, settingKey: keyof CommandCenterSettings) {
        const colorSetting = new Setting(containerEl)
            .setName(name)
            .setDesc(desc);

        // Create color palette container
        const colorPalette = colorSetting.controlEl.createDiv({ cls: 'color-palette' });
        
        // Create a wrapper for the color setting and potential custom input
        const colorWrapper = containerEl.createDiv({ cls: 'color-setting-wrapper' });
        // Move the color setting into the wrapper
        colorWrapper.appendChild(colorSetting.settingEl);
        colorSetting.settingEl.setAttribute('data-color-setting', String(settingKey));
        
        // Define color options
        const colorOptions = [
            { name: 'Default', value: 'var(--text-muted)' },
            { name: 'Normal', value: 'var(--text-normal)' },
            { name: 'Accent', value: 'var(--text-accent)' },
            { name: 'White', value: 'white' },
            { name: 'Black', value: 'black' },
            { name: 'Red', value: '#ff4757' },
            { name: 'Orange', value: '#ffa502' },
            { name: 'Yellow', value: '#ffdd59' },
            { name: 'Green', value: '#2ed573' },
            { name: 'Blue', value: '#3742fa' },
            { name: 'Purple', value: '#8c7ae6' },
            { name: 'Custom', value: 'custom' }
        ];

        // Create color buttons
        colorOptions.forEach(color => {
            const colorBtn = colorPalette.createEl('button', { 
                cls: 'color-option color-option-small',
                title: color.name
            });
            
            if (color.value === 'custom') {
                colorBtn.textContent = '✎';
                colorBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
                colorBtn.style.color = 'white';
            } else if (color.value.startsWith('var(')) {
                colorBtn.style.background = color.value;
                colorBtn.textContent = color.name.charAt(0);
                colorBtn.style.color = color.value === 'var(--text-muted)' ? 'var(--text-on-accent)' : 'white';
            } else {
                colorBtn.style.backgroundColor = color.value;
                if (color.value === 'white' || color.value === '#ffdd59') {
                    colorBtn.style.border = '2px solid #ccc';
                }
            }
            
            // Add selection indicator
            if ((this.plugin.settings as any)[settingKey] === color.value) {
                colorBtn.addClass('selected');
            }
            
            colorBtn.addEventListener('click', async () => {
                // Remove selection from all buttons
                colorPalette.querySelectorAll('.color-option').forEach(btn => btn.removeClass('selected'));
                
                if (color.value === 'custom') {
                    colorBtn.addClass('selected');
                    this.showCustomColorInputForKey(colorWrapper, settingKey);
                } else {
                    colorBtn.addClass('selected');
                    (this.plugin.settings as any)[settingKey] = color.value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    // Remove any existing custom input from this wrapper
                    const existingCustom = colorWrapper.querySelector(`[data-setting-key="${String(settingKey)}"]`);
                    if (existingCustom) {
                        existingCustom.remove();
                    }
                }
            });
        });

        // Show custom input if current color is not in presets
        const isPresetColor = colorOptions.some(option => option.value === (this.plugin.settings as any)[settingKey]);
        if (!isPresetColor && (this.plugin.settings as any)[settingKey] !== 'custom') {
            this.showCustomColorInputForKey(colorWrapper, settingKey);
        }
        
        return colorWrapper;
    }

    private showCustomColorInputForKey(wrapperEl: HTMLElement, settingKey: keyof CommandCenterSettings) {
        // Remove any existing custom input for this setting
        const existingCustom = wrapperEl.querySelector(`[data-setting-key="${String(settingKey)}"]`);
        if (existingCustom) {
            existingCustom.remove();
        }

        // Create a temporary container for the custom setting
        const tempContainer = document.createElement('div');
        
        // Create custom color input
        const customColorSetting = new Setting(tempContainer)
            .setName(`Custom ${String(settingKey).replace('Color', '')} color`)
            .setDesc('Enter a custom color (e.g., #ff6b6b, rgb(255,107,107), var(--text-accent))')
            .addText(text => text
                .setPlaceholder('#ff6b6b')
                .setValue((this.plugin.settings as any)[settingKey] === 'custom' ? '' : (this.plugin.settings as any)[settingKey] as string)
                .onChange(async (value) => {
                    (this.plugin.settings as any)[settingKey] = value || 'var(--text-muted)';
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        customColorSetting.settingEl.addClass('custom-color-setting');
        customColorSetting.settingEl.setAttribute('data-setting-key', String(settingKey));
        
        // Move the setting element from temp container to wrapper
        wrapperEl.appendChild(customColorSetting.settingEl);
    }

    private createBannerColorPaletteSetting(containerEl: HTMLElement, name: string, desc: string, settingKey: keyof CommandCenterSettings) {
        const colorSetting = new Setting(containerEl)
            .setName(name)
            .setDesc(desc);

        // Create color palette container
        const colorPalette = colorSetting.controlEl.createDiv({ cls: 'color-palette' });
        
        // Create a wrapper for the color setting and potential custom input
        const colorWrapper = containerEl.createDiv({ cls: 'color-setting-wrapper' });
        // Move the color setting into the wrapper
        colorWrapper.appendChild(colorSetting.settingEl);
        colorSetting.settingEl.setAttribute('data-color-setting', String(settingKey));
        
        // Define banner color options (original banner colors)
        const colorOptions = [
            { name: 'White', value: 'white' },
            { name: 'Black', value: 'black' },
            { name: 'Red', value: '#ff4757' },
            { name: 'Orange', value: '#ffa502' },
            { name: 'Yellow', value: '#ffdd59' },
            { name: 'Green', value: '#2ed573' },
            { name: 'Blue', value: '#3742fa' },
            { name: 'Purple', value: '#8c7ae6' },
            { name: 'Pink', value: '#fd79a8' },
            { name: 'Gray', value: '#747d8c' },
            { name: 'Accent', value: 'var(--interactive-accent)' },
            { name: 'Custom', value: 'custom' }
        ];

        // Create color buttons
        colorOptions.forEach(color => {
            const colorBtn = colorPalette.createEl('button', { 
                cls: 'color-option',
                title: color.name
            });
            
            if (color.value === 'custom') {
                colorBtn.textContent = '✎';
                colorBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)';
                colorBtn.style.color = 'white';
            } else if (color.value.startsWith('var(')) {
                colorBtn.style.background = 'var(--interactive-accent)';
                colorBtn.textContent = 'A';
                colorBtn.style.color = 'var(--text-on-accent)';
            } else {
                colorBtn.style.backgroundColor = color.value;
                if (color.value === 'white' || color.value === '#ffdd59') {
                    colorBtn.style.border = '2px solid #ccc';
                }
            }
            
            // Add selection indicator
            if ((this.plugin.settings as any)[settingKey] === color.value) {
                colorBtn.addClass('selected');
            }
            
            colorBtn.addEventListener('click', async () => {
                // Remove selection from all buttons
                colorPalette.querySelectorAll('.color-option').forEach(btn => btn.removeClass('selected'));
                
                if (color.value === 'custom') {
                    colorBtn.addClass('selected');
                    this.showCustomColorInputForKey(colorWrapper, settingKey);
                } else {
                    colorBtn.addClass('selected');
                    (this.plugin.settings as any)[settingKey] = color.value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    // Remove any existing custom input from this wrapper
                    const existingCustom = colorWrapper.querySelector(`[data-setting-key="${String(settingKey)}"]`);
                    if (existingCustom) {
                        existingCustom.remove();
                    }
                }
            });
        });

        // Show custom input if current color is not in presets
        const isPresetColor = colorOptions.some(option => option.value === (this.plugin.settings as any)[settingKey]);
        if (!isPresetColor && (this.plugin.settings as any)[settingKey] !== 'custom') {
            this.showCustomColorInputForKey(colorWrapper, settingKey);
        }
        
        return colorWrapper;
    }

}