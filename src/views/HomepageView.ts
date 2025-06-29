import { ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_HOMEPAGE, HOMEPAGE_ICON } from '../constants';
import { CommandCenterLayout } from '../components/CommandCenterLayout';
import type { CommandCenterPlugin } from '../main';

export class HomepageView extends ItemView {
    plugin: CommandCenterPlugin;
    private commandCenter: CommandCenterLayout | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: CommandCenterPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_HOMEPAGE;
    }

    getDisplayText(): string {
        return 'Command Center';
    }

    getIcon(): string {
        return HOMEPAGE_ICON;
    }

    async onOpen() {
        // Build sophisticated UI directly in contentEl following research pattern
        this.contentEl.empty();
        this.contentEl.addClass('homepage-container');
        this.contentEl.addClass('homepage-grid');
        
        // Remove default styling and set full height
        this.contentEl.style.padding = '0';
        this.contentEl.style.margin = '0';
        this.contentEl.style.height = '100%';
        
        // Build the dashboard directly in contentEl
        await this.buildDashboard();
    }

    private async buildDashboard() {
        // Create the command center layout directly in contentEl
        this.commandCenter = new CommandCenterLayout(this.plugin, this.contentEl);
    }

    async onClose() {
        // Cleanup command center
        if (this.commandCenter) {
            this.commandCenter.destroy();
            this.commandCenter = null;
        }
    }
    
    // Public method to refresh the view
    public async refresh() {
        if (this.commandCenter) {
            this.commandCenter.refresh();
        }
    }
}