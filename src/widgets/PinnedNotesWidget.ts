import { TFile, Notice } from 'obsidian';
import type { CommandCenterPlugin } from '../main';

export class PinnedNotesWidget {
    private plugin: CommandCenterPlugin;
    private container: HTMLElement;

    constructor(plugin: CommandCenterPlugin, container: HTMLElement) {
        this.plugin = plugin;
        this.container = container;
        this.render();
    }

    private render() {
        this.container.empty();
        
        // Create main widget container
        const widget = this.container.createDiv({ cls: 'pinned-notes-widget' });
        
        // Add header with add button
        const header = widget.createDiv({ cls: 'pinned-notes-header' });
        header.createEl('h3', { text: 'Pinned Notes', cls: 'pinned-notes-title' });
        
        // Add new container button (only if less than max containers)
        if (this.plugin.settings.pinnedContainers.length < this.plugin.settings.maxPinnedContainers) {
            const addBtn = header.createEl('button', { 
                cls: 'pinned-notes-add-btn',
                text: '+ Add Container'
            });
            addBtn.addEventListener('click', () => this.addNewContainer());
        }
        
        // Render containers
        const containersEl = widget.createDiv({ 
            cls: `pinned-notes-containers pinned-notes-${this.plugin.settings.pinnedNotesViewMode}` 
        });
        
        if (this.plugin.settings.pinnedContainers.length === 0) {
            containersEl.createEl('div', { 
                text: 'No pinned notes yet. Click "+ Add Container" to get started.',
                cls: 'pinned-notes-empty'
            });
        } else {
            this.plugin.settings.pinnedContainers.forEach(container => {
                this.renderContainer(containersEl, container);
            });
        }
    }
    
    private renderContainer(parent: HTMLElement, container: { id: string; title: string; notes: string[]; collapsed: boolean; }) {
        const containerEl = parent.createDiv({ 
            cls: `pinned-container ${container.collapsed ? 'collapsed' : ''}` 
        });
        
        // Container header
        const header = containerEl.createDiv({ cls: 'pinned-container-header' });
        
        // Collapse toggle
        const collapseBtn = header.createEl('button', { 
            cls: 'pinned-container-collapse',
            text: container.collapsed ? '▶' : '▼'
        });
        collapseBtn.addEventListener('click', () => {
            container.collapsed = !container.collapsed;
            this.plugin.saveSettings();
            this.render();
        });
        
        // Title (editable)
        const titleEl = header.createEl('span', { 
            cls: 'pinned-container-title',
            text: container.title || 'Untitled Container'
        });
        titleEl.contentEditable = 'true';
        titleEl.addEventListener('blur', () => {
            container.title = titleEl.textContent || 'Untitled Container';
            this.plugin.saveSettings();
        });
        titleEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                titleEl.blur();
            }
        });
        
        // Container actions
        const actions = header.createDiv({ cls: 'pinned-container-actions' });
        
        // Add note button
        const addNoteBtn = actions.createEl('button', { 
            cls: 'pinned-container-action',
            title: 'Add note'
        });
        addNoteBtn.innerHTML = '+';
        addNoteBtn.addEventListener('click', () => this.showNoteSelector(container));
        
        // Delete container button
        const deleteBtn = actions.createEl('button', { 
            cls: 'pinned-container-action pinned-container-delete',
            title: 'Delete container'
        });
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => this.deleteContainer(container.id));
        
        // Container content (only if not collapsed)
        if (!container.collapsed) {
            const content = containerEl.createDiv({ cls: 'pinned-container-content' });
            
            if (container.notes.length === 0) {
                content.createEl('div', { 
                    text: 'No notes pinned. Click + to add.',
                    cls: 'pinned-container-empty'
                });
            } else {
                const notesEl = content.createDiv({ 
                    cls: `pinned-notes-list pinned-notes-${this.plugin.settings.pinnedNotesViewMode}` 
                });
                
                container.notes.forEach(notePath => {
                    this.renderPinnedNote(notesEl, notePath, container);
                });
            }
        }
    }
    
    private renderPinnedNote(parent: HTMLElement, notePath: string, container: { id: string; notes: string[]; }) {
        const file = this.plugin.app.vault.getAbstractFileByPath(notePath);
        if (!file || !(file instanceof TFile)) return;
        
        const noteEl = parent.createDiv({ 
            cls: `pinned-note pinned-note-${this.plugin.settings.pinnedNotesViewMode}` 
        });
        
        // Note content wrapper
        const contentWrapper = noteEl.createDiv({ cls: 'pinned-note-content' });
        
        // Add preview image for gallery mode
        if (this.plugin.settings.pinnedNotesViewMode === 'gallery') {
            const preview = contentWrapper.createDiv({ cls: 'pinned-note-preview' });
            // You could add logic here to extract first image or create a preview
            preview.createEl('div', { text: '📄', cls: 'pinned-note-icon' });
        }
        
        // Note title
        const titleEl = contentWrapper.createEl('div', { 
            text: file.basename,
            cls: 'pinned-note-title'
        });
        
        // Note path (for list mode)
        if (this.plugin.settings.pinnedNotesViewMode === 'list') {
            contentWrapper.createEl('div', { 
                text: file.path,
                cls: 'pinned-note-path'
            });
        }
        
        // Remove button
        const removeBtn = noteEl.createEl('button', { 
            cls: 'pinned-note-remove',
            title: 'Remove from container'
        });
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeNoteFromContainer(container, notePath);
        });
        
        // Click to open
        contentWrapper.addEventListener('click', () => {
            this.plugin.app.workspace.getLeaf().openFile(file);
        });
        
        // Hover preview
        let previewTimeout: NodeJS.Timeout;
        let previewEl: HTMLElement | null = null;
        
        contentWrapper.addEventListener('mouseenter', () => {
            previewTimeout = setTimeout(async () => {
                previewEl = await this.showFilePreview(file, noteEl);
            }, 500);
        });
        
        contentWrapper.addEventListener('mouseleave', () => {
            clearTimeout(previewTimeout);
            if (previewEl) {
                previewEl.remove();
                previewEl = null;
            }
        });
    }
    
    private async showFilePreview(file: TFile, targetElement: HTMLElement): Promise<HTMLElement> {
        const preview = document.createElement('div');
        preview.className = 'pinned-note-preview-popup';
        
        // Get file content
        let content = '';
        try {
            const fileContent = await this.plugin.app.vault.read(file);
            content = fileContent.length > 300 
                ? fileContent.substring(0, 300) + '...'
                : fileContent;
        } catch (error) {
            content = 'Unable to preview file';
        }
        
        // Create preview content
        const previewHeader = preview.createDiv({ cls: 'preview-header' });
        previewHeader.createEl('strong', { text: file.basename });
        
        const previewContent = preview.createDiv({ cls: 'preview-content' });
        previewContent.createEl('div', { text: content, cls: 'preview-text' });
        
        // Position the preview
        const rect = targetElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        preview.style.position = 'absolute';
        preview.style.left = `${rect.right - containerRect.left + 10}px`;
        preview.style.top = `${rect.top - containerRect.top}px`;
        preview.style.zIndex = '1000';
        
        // Add to container
        this.container.appendChild(preview);
        
        return preview;
    }
    
    private addNewContainer() {
        const newContainer = {
            id: `container-${Date.now()}`,
            title: `Container ${this.plugin.settings.pinnedContainers.length + 1}`,
            notes: [],
            collapsed: false
        };
        
        this.plugin.settings.pinnedContainers.push(newContainer);
        this.plugin.saveSettings();
        this.render();
    }
    
    private deleteContainer(containerId: string) {
        this.plugin.settings.pinnedContainers = this.plugin.settings.pinnedContainers.filter(
            c => c.id !== containerId
        );
        this.plugin.saveSettings();
        this.render();
    }
    
    private removeNoteFromContainer(container: { notes: string[]; }, notePath: string) {
        container.notes = container.notes.filter(n => n !== notePath);
        this.plugin.saveSettings();
        this.render();
    }
    
    private showNoteSelector(container: { notes: string[]; }) {
        // Create a modal-like selector
        const modal = document.createElement('div');
        modal.className = 'pinned-notes-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pinned-notes-modal-content';
        
        modalContent.createEl('h3', { text: 'Select a note to pin' });
        
        // Search input
        const searchInput = modalContent.createEl('input', {
            type: 'text',
            placeholder: 'Search notes...',
            cls: 'pinned-notes-search'
        });
        
        // Results container
        const results = modalContent.createDiv({ cls: 'pinned-notes-results' });
        
        // Get all markdown files
        const files = this.plugin.app.vault.getMarkdownFiles()
            .filter(f => !container.notes.includes(f.path))
            .sort((a, b) => b.stat.mtime - a.stat.mtime);
        
        const renderResults = (searchTerm: string = '') => {
            results.empty();
            
            const filtered = searchTerm 
                ? files.filter(f => f.basename.toLowerCase().includes(searchTerm.toLowerCase()))
                : files.slice(0, 20); // Show top 20 recent files by default
            
            if (filtered.length === 0) {
                results.createEl('div', { text: 'No matching notes found', cls: 'no-results' });
                return;
            }
            
            filtered.forEach(file => {
                const item = results.createDiv({ cls: 'pinned-notes-result-item' });
                item.createEl('div', { text: file.basename, cls: 'result-title' });
                item.createEl('div', { text: file.path, cls: 'result-path' });
                
                item.addEventListener('click', () => {
                    container.notes.push(file.path);
                    this.plugin.saveSettings();
                    this.render();
                    document.body.removeChild(modal);
                });
            });
        };
        
        // Initial render
        renderResults();
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            renderResults((e.target as HTMLInputElement).value);
        });
        
        // Close button
        const closeBtn = modalContent.createEl('button', { 
            text: 'Cancel',
            cls: 'pinned-notes-modal-close'
        });
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        searchInput.focus();
    }
    
    public destroy() {
        this.container.empty();
    }
}