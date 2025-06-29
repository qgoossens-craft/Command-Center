import { Setting, PluginSettingTab } from 'obsidian';
import type { CommandCenterPlugin } from '../main';
import type { CommandCenterSettings } from '../types/settings';

export class FloatingSettingsPanel {
    private plugin: CommandCenterPlugin;
    private panelEl: HTMLElement | null = null;
    private isVisible = false;
    private isDragging = false;
    private dragOffset = { x: 0, y: 0 };

    constructor(plugin: CommandCenterPlugin) {
        this.plugin = plugin;
    }

    show() {
        if (this.isVisible) return;
        
        this.createPanel();
        this.isVisible = true;
    }

    hide() {
        if (!this.isVisible || !this.panelEl) return;
        
        this.panelEl.remove();
        this.panelEl = null;
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    private refreshPanel() {
        if (!this.isVisible || !this.panelEl) return;
        
        // Store scroll position
        const contentArea = this.panelEl.querySelector('.settings-content-area') as HTMLElement;
        const scrollTop = contentArea?.scrollTop || 0;
        
        // Find and clear content area
        if (contentArea) {
            contentArea.empty();
            
            // Recreate all settings
            this.createAllSettings(contentArea);
            
            // Restore scroll position
            setTimeout(() => {
                if (contentArea) {
                    contentArea.scrollTop = scrollTop;
                }
            }, 10);
        }
    }

    private createPanel() {
        // Create floating panel
        this.panelEl = document.body.createDiv({ cls: 'floating-settings-panel' });
        
        // Set initial position
        this.panelEl.style.position = 'fixed';
        this.panelEl.style.top = '10%';
        this.panelEl.style.left = '20%';
        this.panelEl.style.zIndex = '1000';
        this.panelEl.style.maxWidth = '500px';
        this.panelEl.style.maxHeight = '80vh';
        
        // Create header with drag handle and close button
        const header = this.panelEl.createDiv({ cls: 'settings-drag-header' });
        const titleContainer = header.createDiv({ cls: 'header-title-container' });
        titleContainer.createEl('h2', { text: 'Command Center Settings' });
        titleContainer.createEl('div', { cls: 'drag-hint', text: '⋮⋮ Drag to move' });
        
        const closeButton = header.createDiv({ cls: 'settings-close-button', text: '✕' });
        closeButton.addEventListener('click', () => this.hide());
        
        // Create scrollable content area
        const contentArea = this.panelEl.createDiv({ cls: 'settings-content-area' });
        
        // Setup drag functionality
        this.setupDragEvents(header);
        
        // Populate settings
        this.createAllSettings(contentArea);
    }

    private setupDragEvents(header: HTMLElement) {
        header.style.cursor = 'move';
        
        const onMouseDown = (e: MouseEvent) => {
            this.isDragging = true;
            const rect = this.panelEl!.getBoundingClientRect();
            this.dragOffset.x = e.clientX - rect.left;
            this.dragOffset.y = e.clientY - rect.top;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };
        
        const onMouseMove = (e: MouseEvent) => {
            if (!this.isDragging || !this.panelEl) return;
            
            const newX = e.clientX - this.dragOffset.x;
            const newY = e.clientY - this.dragOffset.y;
            
            // Keep panel within viewport bounds
            const maxX = window.innerWidth - this.panelEl.offsetWidth;
            const maxY = window.innerHeight - this.panelEl.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            
            this.panelEl.style.left = `${clampedX}px`;
            this.panelEl.style.top = `${clampedY}px`;
        };
        
        const onMouseUp = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        header.addEventListener('mousedown', onMouseDown);
    }

    private createAllSettings(contentArea: HTMLElement) {
        // General Settings Section
        contentArea.createEl('h3', { text: 'General Settings' });

        // Custom Title
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        new Setting(contentArea)
            .setName('Open on startup')
            .setDesc('Automatically open the homepage when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.openOnStartup)
                .onChange(async (value) => {
                    this.plugin.settings.openOnStartup = value;
                    await this.plugin.saveSettings();
                }));

        // Visual Settings Section
        contentArea.createEl('h3', { text: 'Visual Settings' });

        // Title Font Size
        new Setting(contentArea)
            .setName('Title font size')
            .setDesc('Size of the main title')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    '1.5em': 'Small',
                    '2em': 'Medium',
                    '2.5em': 'Large',
                    '3em': 'Extra Large',
                    '3.5em': 'Huge',
                    '4em': 'Massive'
                })
                .setValue(this.plugin.settings.titleFontSize)
                .onChange(async (value: any) => {
                    this.plugin.settings.titleFontSize = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Background Image
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        contentArea.createEl('h3', { text: 'Banner Settings' });

        // Show Banner
        new Setting(contentArea)
            .setName('Show banner')
            .setDesc('Display a banner at the top of the homepage')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBanner)
                .onChange(async (value) => {
                    this.plugin.settings.showBanner = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.refreshPanel(); // Refresh to show/hide banner settings
                }));

        if (this.plugin.settings.showBanner) {
            // Banner Text
            new Setting(contentArea)
                .setName('Banner text')
                .setDesc('Text to display on the banner')
                .addText(text => text
                    .setPlaceholder('Welcome to your workspace')
                    .setValue(this.plugin.settings.bannerText)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerText = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Image
            new Setting(contentArea)
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
            new Setting(contentArea)
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
            new Setting(contentArea)
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

            // Advanced Banner Settings
            contentArea.createEl('h4', { text: 'Advanced Banner Settings', cls: 'setting-item-heading' });

            // Banner Text Position
            new Setting(contentArea)
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

            // Banner Text Color
            this.createColorPaletteSetting(contentArea, 'Banner text color', 'Choose color for the banner text', 'bannerTextColor');

            // Banner Text Size
            new Setting(contentArea)
                .setName('Text size')
                .setDesc('Font size of the banner text')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        '0.8em': 'Extra Small',
                        '1em': 'Small',
                        '1.2em': 'Medium',
                        '1.5em': 'Large',
                        '1.8em': 'Extra Large',
                        '2.2em': 'Huge',
                        '2.8em': 'Massive'
                    })
                    .setValue(this.plugin.settings.bannerTextSize)
                    .onChange(async (value: any) => {
                        this.plugin.settings.bannerTextSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Text Shadow
            new Setting(contentArea)
                .setName('Text shadow')
                .setDesc('Add a shadow effect behind the banner text for better readability')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.bannerTextShadow)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerTextShadow = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Image Fit
            new Setting(contentArea)
                .setName('Image fit')
                .setDesc('How the banner image should be displayed')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'cover': 'Cover (fill area, may crop)',
                        'contain': 'Contain (fit entirely)',
                        'fill': 'Fill (stretch to fit)',
                        'scale-down': 'Scale down (smaller version of contain)'
                    })
                    .setValue(this.plugin.settings.bannerImageFit)
                    .onChange(async (value: any) => {
                        this.plugin.settings.bannerImageFit = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Image Position
            new Setting(contentArea)
                .setName('Image position')
                .setDesc('Position of the banner image')
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

            // Banner Overlay Color
            this.createColorPaletteSetting(contentArea, 'Overlay color', 'Choose color for the banner overlay', 'bannerOverlayColor');

            // Banner Overlay Opacity
            new Setting(contentArea)
                .setName('Overlay opacity')
                .setDesc('Opacity of the text overlay background')
                .addSlider(slider => slider
                    .setLimits(0, 1, 0.1)
                    .setValue(this.plugin.settings.bannerOverlayOpacity)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bannerOverlayOpacity = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Banner Blur
            new Setting(contentArea)
                .setName('Background blur')
                .setDesc('Blur effect for the banner background image (in pixels)')
                .addSlider(slider => slider
                    .setLimits(0, 20, 1)
                    .setValue(this.plugin.settings.bannerBlur)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bannerBlur = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Date & Time Settings
        contentArea.createEl('h3', { text: 'Date & Time Settings' });

        // Show Date/Time
        new Setting(contentArea)
            .setName('Show date and time')
            .setDesc('Display the current date and time on the homepage')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showDateTime)
                .onChange(async (value) => {
                    this.plugin.settings.showDateTime = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.refreshPanel(); // Refresh to show/hide date/time settings
                }));

        if (this.plugin.settings.showDateTime) {
            // Date Format
            new Setting(contentArea)
                .setName('Date format')
                .setDesc('How to display the date (using date-fns format)')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'EEEE, MMMM d, yyyy': 'Friday, June 27, 2025',
                        'MMM d, yyyy': 'Jun 27, 2025',
                        'MM/dd/yyyy': '06/27/2025',
                        'dd/MM/yyyy': '27/06/2025',
                        'yyyy-MM-dd': '2025-06-27',
                        'EEEE, MMM d': 'Friday, Jun 27',
                        'd MMMM yyyy': '27 June 2025'
                    })
                    .setValue(this.plugin.settings.dateFormat)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateFormat = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Time Format
            new Setting(contentArea)
                .setName('Time format')
                .setDesc('How to display the time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'h:mm a': '8:04 PM',
                        'HH:mm': '20:04',
                        'h:mm:ss a': '8:04:32 PM',
                        'HH:mm:ss': '20:04:32'
                    })
                    .setValue(this.plugin.settings.timeFormat)
                    .onChange(async (value: any) => {
                        this.plugin.settings.timeFormat = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date/Time Position
            new Setting(contentArea)
                .setName('Position')
                .setDesc('Where to display the date and time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'center': 'Center',
                        'left': 'Left',
                        'right': 'Right',
                        'below-title': 'Below Title',
                        'above-title': 'Above Title'
                    })
                    .setValue(this.plugin.settings.dateTimePosition)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateTimePosition = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date/Time Layout
            new Setting(contentArea)
                .setName('Layout')
                .setDesc('How to arrange date and time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        'horizontal': 'Horizontal (side by side)',
                        'vertical': 'Vertical (stacked)',
                        'stacked': 'Stacked (date emphasized)'
                    })
                    .setValue(this.plugin.settings.dateTimeLayout)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateTimeLayout = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date Font Size
            new Setting(contentArea)
                .setName('Date font size')
                .setDesc('Font size for the date')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        '0.8em': 'Extra Small',
                        '0.9em': 'Small',
                        '1em': 'Medium',
                        '1.2em': 'Large',
                        '1.4em': 'Extra Large',
                        '1.6em': 'Huge'
                    })
                    .setValue(this.plugin.settings.dateFontSize)
                    .onChange(async (value: any) => {
                        this.plugin.settings.dateFontSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Time Font Size
            new Setting(contentArea)
                .setName('Time font size')
                .setDesc('Font size for the time')
                .addDropdown(dropdown => dropdown
                    .addOptions({
                        '0.8em': 'Extra Small',
                        '0.9em': 'Small',
                        '1em': 'Medium',
                        '1.2em': 'Large',
                        '1.4em': 'Extra Large',
                        '1.6em': 'Huge'
                    })
                    .setValue(this.plugin.settings.timeFontSize)
                    .onChange(async (value: any) => {
                        this.plugin.settings.timeFontSize = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date Color
            this.createColorPaletteSetting(contentArea, 'Date color', 'Choose color for the date text', 'dateColor');

            // Time Color  
            this.createColorPaletteSetting(contentArea, 'Time color', 'Choose color for the time text', 'timeColor');

            // Date/Time Background
            this.createColorPaletteSetting(contentArea, 'Background color', 'Choose background color for date/time area', 'dateTimeBackground');

            // Date/Time Background Opacity
            new Setting(contentArea)
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

            // Date/Time Shadow
            new Setting(contentArea)
                .setName('Text shadow')
                .setDesc('Add shadow effect to date/time text')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.dateTimeShadow)
                    .onChange(async (value) => {
                        this.plugin.settings.dateTimeShadow = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));

            // Date/Time Border
            new Setting(contentArea)
                .setName('Border')
                .setDesc('Add border around date/time area')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.dateTimeBorder)
                    .onChange(async (value) => {
                        this.plugin.settings.dateTimeBorder = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Widget Visibility Section
        contentArea.createEl('h3', { text: 'Widget Visibility' });

        // Show Search
        new Setting(contentArea)
            .setName('Show search widget')
            .setDesc('Display the universal search widget')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showSearch)
                .onChange(async (value) => {
                    this.plugin.settings.showSearch = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Show Recent Files
        new Setting(contentArea)
            .setName('Show recent files')
            .setDesc('Display a list of recently modified files')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showRecentFiles)
                .onChange(async (value) => {
                    this.plugin.settings.showRecentFiles = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Show Bookmarks
        new Setting(contentArea)
            .setName('Show bookmarks')
            .setDesc('Display your Obsidian bookmarks')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBookmarks)
                .onChange(async (value) => {
                    this.plugin.settings.showBookmarks = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Show Todos
        new Setting(contentArea)
            .setName('Show tasks')
            .setDesc('Display your todo/task list')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showTodos)
                .onChange(async (value) => {
                    this.plugin.settings.showTodos = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Todo Settings Section
        contentArea.createEl('h3', { text: 'Task Settings' });

        // Auto Cleanup Completed
        new Setting(contentArea)
            .setName('Auto-cleanup completed tasks')
            .setDesc('Automatically remove completed tasks after specified days')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoCleanupCompleted)
                .onChange(async (value) => {
                    this.plugin.settings.autoCleanupCompleted = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.refreshPanel(); // Refresh to show/hide cleanup settings
                }));

        if (this.plugin.settings.autoCleanupCompleted) {
            // Cleanup Delay Days
            new Setting(contentArea)
                .setName('Cleanup delay (days)')
                .setDesc('Number of days to wait before removing completed tasks (0 = immediate)')
                .addSlider(slider => slider
                    .setLimits(0, 30, 1)
                    .setValue(this.plugin.settings.cleanupDelayDays)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.cleanupDelayDays = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Layout Settings Section
        contentArea.createEl('h3', { text: 'Layout Settings' });

        // Layout Preset
        new Setting(contentArea)
            .setName('Layout preset')
            .setDesc('Choose a predefined layout for your homepage')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    'default': 'Default (balanced)',
                    'minimal': 'Minimal (clean)',
                    'dashboard': 'Dashboard (information-dense)',
                    'productivity': 'Productivity (task-focused)'
                })
                .setValue(this.plugin.settings.layoutPreset)
                .onChange(async (value: any) => {
                    this.plugin.settings.layoutPreset = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Widget Columns
        new Setting(contentArea)
            .setName('Widget columns')
            .setDesc('Number of columns for widget layout (when using default preset)')
            .addSlider(slider => slider
                .setLimits(1, 5, 1)
                .setValue(this.plugin.settings.widgetColumns)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.widgetColumns = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Content Limits Section
        contentArea.createEl('h3', { text: 'Content Limits' });

        // Max Recent Files
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        new Setting(contentArea)
            .setName('Max tasks')
            .setDesc('Maximum number of tasks to display')
            .addSlider(slider => slider
                .setLimits(1, 50, 1)
                .setValue(this.plugin.settings.maxTodos)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.maxTodos = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Section Names Section
        contentArea.createEl('h3', { text: 'Section Names' });

        // Search Section Title
        new Setting(contentArea)
            .setName('Search section title')
            .setDesc('Title for the search widget section')
            .addText(text => text
                .setPlaceholder('Universal Search')
                .setValue(this.plugin.settings.searchSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.searchSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Quick Actions Section Title
        new Setting(contentArea)
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
        new Setting(contentArea)
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
        new Setting(contentArea)
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

        // Tasks Section Title
        new Setting(contentArea)
            .setName('Tasks section title')
            .setDesc('Title for the tasks section')
            .addText(text => text
                .setPlaceholder('Tasks')
                .setValue(this.plugin.settings.todosSectionTitle)
                .onChange(async (value) => {
                    this.plugin.settings.todosSectionTitle = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Theme Settings Section
        contentArea.createEl('h3', { text: 'Theme Settings' });

        // Use Obsidian Accent
        new Setting(contentArea)
            .setName('Use Obsidian accent color')
            .setDesc('Use the accent color from your Obsidian theme')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useObsidianAccent)
                .onChange(async (value) => {
                    this.plugin.settings.useObsidianAccent = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.refreshPanel(); // Refresh to show/hide custom accent color
                }));

        if (!this.plugin.settings.useObsidianAccent) {
            // Custom Accent Color
            this.createColorPaletteSetting(contentArea, 'Custom accent color', 'Choose a custom accent color for the homepage', 'customAccentColor');
        }

        // Advanced Todo Settings Section
        contentArea.createEl('h3', { text: 'Advanced Task Settings' });

        // Todo Parse Mode
        new Setting(contentArea)
            .setName('Task source')
            .setDesc('Where to look for tasks')
            .addDropdown(dropdown => dropdown
                .addOptions({
                    'vault': 'Entire vault',
                    'single-file': 'Single file only'
                })
                .setValue(this.plugin.settings.todoParseMode)
                .onChange(async (value: any) => {
                    this.plugin.settings.todoParseMode = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                    this.refreshPanel(); // Refresh to show/hide source file setting
                }));

        // Todo Source File (only show if single-file mode)
        if (this.plugin.settings.todoParseMode === 'single-file') {
            new Setting(contentArea)
                .setName('Task source file')
                .setDesc('File to scan for tasks (when using single-file mode)')
                .addText(text => text
                    .setPlaceholder('Tasks.md')
                    .setValue(this.plugin.settings.todoSourceFile)
                    .onChange(async (value) => {
                        this.plugin.settings.todoSourceFile = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHomepage();
                    }));
        }

        // Default Todo File
        new Setting(contentArea)
            .setName('Default task file')
            .setDesc('File where new tasks will be created')
            .addText(text => text
                .setPlaceholder('Tasks.md')
                .setValue(this.plugin.settings.defaultTodoFile)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTodoFile = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHomepage();
                }));

        // Quick note at bottom
        const note = contentArea.createDiv({ cls: 'settings-note' });
        note.createEl('p', { 
            text: '💡 Drag this panel anywhere and see changes instantly on your homepage!',
            cls: 'settings-tip'
        });
    }

    // Helper method to create color palette settings (simplified version)
    private createColorPaletteSetting(containerEl: HTMLElement, name: string, desc: string, settingKey: keyof CommandCenterSettings) {
        const setting = new Setting(containerEl)
            .setName(name)
            .setDesc(desc);

        const colorWrapper = setting.controlEl.createDiv({ cls: 'color-setting-wrapper' });
        
        const colorOptions = [
            { name: 'Default', value: 'var(--text-muted)' },
            { name: 'Accent', value: 'var(--text-accent)' },
            { name: 'Red', value: '#ff6b6b' },
            { name: 'Blue', value: '#4dabf7' },
            { name: 'Green', value: '#51cf66' },
            { name: 'Purple', value: '#9775fa' },
            { name: 'Orange', value: '#ff922b' }
        ];

        const palette = colorWrapper.createDiv({ cls: 'color-palette' });
        
        colorOptions.forEach(option => {
            const colorOption = palette.createDiv({ 
                cls: `color-option ${this.plugin.settings[settingKey] === option.value ? 'selected' : ''}` 
            });
            colorOption.style.backgroundColor = option.value;
            colorOption.title = option.name;
            
            colorOption.addEventListener('click', async () => {
                // Remove previous selection
                palette.querySelectorAll('.color-option').forEach(el => el.removeClass('selected'));
                colorOption.addClass('selected');
                
                // Update setting
                (this.plugin.settings as any)[settingKey] = option.value;
                await this.plugin.saveSettings();
                this.plugin.refreshHomepage();
            });
        });

        return colorWrapper;
    }
}