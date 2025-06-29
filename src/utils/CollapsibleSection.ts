export class CollapsibleSection {
    private sectionEl: HTMLElement;
    private headerEl: HTMLElement;
    private contentEl: HTMLElement;
    private collapsed: boolean;
    private storageKey: string;

    constructor(
        parent: HTMLElement,
        title: string,
        description?: string,
        icon?: string,
        defaultCollapsed: boolean = false,
        storageKey?: string
    ) {
        this.storageKey = storageKey || `collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`;
        this.collapsed = this.loadCollapsedState() ?? defaultCollapsed;
        
        // Create section container
        this.sectionEl = parent.createDiv({ cls: 'settings-section' });
        
        // Create header
        this.headerEl = this.sectionEl.createDiv({ 
            cls: `settings-section-header ${this.collapsed ? 'collapsed' : ''}` 
        });
        
        // Create title with optional icon
        const titleContainer = this.headerEl.createDiv({ cls: 'settings-section-title' });
        if (icon) {
            titleContainer.createSpan({ text: icon, cls: 'settings-section-icon' });
        }
        titleContainer.createSpan({ text: title });
        
        // Create toggle arrow
        const toggle = this.headerEl.createSpan({ 
            text: '▼', 
            cls: 'settings-section-toggle' 
        });
        
        // Create content container
        this.contentEl = this.sectionEl.createDiv({ 
            cls: `settings-section-content ${this.collapsed ? 'collapsed' : ''}` 
        });
        
        // Add description if provided
        if (description) {
            this.contentEl.createDiv({ 
                text: description,
                cls: 'settings-section-description'
            });
        }
        
        // Add click handler
        this.headerEl.addEventListener('click', () => {
            this.toggle();
        });
    }
    
    public toggle() {
        this.collapsed = !this.collapsed;
        this.saveCollapsedState();
        
        if (this.collapsed) {
            this.headerEl.addClass('collapsed');
            this.contentEl.addClass('collapsed');
        } else {
            this.headerEl.removeClass('collapsed');
            this.contentEl.removeClass('collapsed');
        }
    }
    
    public expand() {
        if (this.collapsed) {
            this.toggle();
        }
    }
    
    public collapse() {
        if (!this.collapsed) {
            this.toggle();
        }
    }
    
    public getContentEl(): HTMLElement {
        return this.contentEl;
    }
    
    public getSectionEl(): HTMLElement {
        return this.sectionEl;
    }
    
    private loadCollapsedState(): boolean | null {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }
    
    private saveCollapsedState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.collapsed));
        } catch {
            // Ignore storage errors
        }
    }
    
    public destroy() {
        this.sectionEl.remove();
    }
}