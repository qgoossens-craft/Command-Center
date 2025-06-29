import { Plugin, WorkspaceLeaf } from 'obsidian';
import { CommandCenterSettings, DEFAULT_SETTINGS } from './types/settings';
import { HomepageView } from './views/HomepageView';
import { CommandCenterSettingsTab } from './settings/SettingsTab';
import { FloatingSettingsPanel } from './settings/FloatingSettingsPanel';
import { IconService } from './services/IconService';
import { VIEW_TYPE_HOMEPAGE, PLUGIN_NAME, HOMEPAGE_ICON } from './constants';

export class CommandCenterPlugin extends Plugin {
    settings: CommandCenterSettings;
    private homepageView: HomepageView | null = null;
    private floatingSettings: FloatingSettingsPanel | null = null;
    public iconService: IconService;
    public loadTime: number;

    async onload() {
        this.loadTime = Date.now();
        console.log(`Loading ${PLUGIN_NAME}`);
        
        // Load settings
        await this.loadSettings();

        // Initialize icon service
        this.iconService = new IconService(this);

        // Initialize floating settings panel
        this.floatingSettings = new FloatingSettingsPanel(this);

        // Register the homepage view
        this.registerView(
            VIEW_TYPE_HOMEPAGE,
            (leaf) => {
                this.homepageView = new HomepageView(leaf, this);
                return this.homepageView;
            }
        );

        // Add ribbon icon
        this.addRibbonIcon(HOMEPAGE_ICON, 'Open Homepage', () => {
            this.activateHomepageView();
        });

        // Add command to open homepage
        this.addCommand({
            id: 'open-homepage',
            name: 'Open Homepage',
            callback: () => {
                this.activateHomepageView();
            }
        });

        // Add command to toggle floating settings
        this.addCommand({
            id: 'toggle-floating-settings',
            name: 'Toggle Floating Settings',
            callback: () => {
                this.floatingSettings?.toggle();
            }
        });

        // Add settings tab
        this.addSettingTab(new CommandCenterSettingsTab(this.app, this));

        // Open homepage on startup if configured
        if (this.settings.openOnStartup) {
            this.app.workspace.onLayoutReady(() => {
                this.activateHomepageView();
            });
        }
    }

    onunload() {
        console.log(`Unloading ${PLUGIN_NAME}`);
        
        // Clean up views
        this.app.workspace.detachLeavesOfType(VIEW_TYPE_HOMEPAGE);
        this.homepageView = null;
        
        // Clean up floating settings
        this.floatingSettings?.hide();
        this.floatingSettings = null;
    }

    async loadSettings() {
        const loadedData = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
        
        // Ensure widgetBackgrounds exists for migration compatibility
        if (!this.settings.widgetBackgrounds) {
            this.settings.widgetBackgrounds = DEFAULT_SETTINGS.widgetBackgrounds;
            await this.saveSettings();
        }
        
        // Ensure customIcons exists for migration compatibility
        if (!this.settings.customIcons) {
            this.settings.customIcons = DEFAULT_SETTINGS.customIcons;
            await this.saveSettings();
        }
        
        // Add new searchResults field if missing (migration)
        if (!this.settings.customIcons.searchResults) {
            this.settings.customIcons.searchResults = DEFAULT_SETTINGS.customIcons.searchResults;
            await this.saveSettings();
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateHomepageView() {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE);

        if (leaves.length > 0) {
            // A homepage view already exists
            leaf = leaves[0];
        } else {
            // Create a new leaf
            leaf = workspace.getLeaf('tab');
            if (leaf) {
                await leaf.setViewState({
                    type: VIEW_TYPE_HOMEPAGE,
                    active: true,
                });
            }
        }

        // Reveal the leaf
        if (leaf) {
            workspace.revealLeaf(leaf);
        }
    }

    refreshHomepage() {
        if (this.homepageView) {
            this.homepageView.refresh();
        }
    }
}

// Export the plugin class as default
export default CommandCenterPlugin;