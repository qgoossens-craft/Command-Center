import { Component, TFile, Notice, EventRef, Menu } from 'obsidian';
import type { CommandCenterPlugin } from '../main';

interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    line: number;
    file: TFile;
    category?: string;
    priority?: 'high' | 'medium' | 'low';
    completedDate?: number; // timestamp when task was completed
}

export class TodoWidget extends Component {
    private plugin: CommandCenterPlugin;
    private container: HTMLElement;
    private todos: TodoItem[] = [];
    private todoFile: TFile | null = null;
    private progressBar: HTMLElement;
    private todoList: HTMLElement;
    private addTodoInput: HTMLInputElement;
    private fileModifyEventRef: EventRef | null = null;
    private fileCreateEventRef: EventRef | null = null;
    private fileDeleteEventRef: EventRef | null = null;
    private refreshTimeout: NodeJS.Timeout | null = null;
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor(plugin: CommandCenterPlugin, container: HTMLElement) {
        super();
        this.plugin = plugin;
        this.container = container;
        this.loadTodos().then(() => {
            this.render();
            this.registerFileEvents();
            this.startCleanupInterval();
        });
    }

    private async render() {
        this.container.empty();
        this.container.addClass('todo-widget');

        // Widget header with progress
        const header = this.container.createDiv({ cls: 'todo-header' });
        
        this.progressBar = header.createDiv({ cls: 'todo-progress-container' });
        this.updateProgressBar();

        // Filter buttons removed

        // Todo list
        this.todoList = this.container.createDiv({ cls: 'todo-list' });
        this.renderTodos();

        // Add new todo
        const addSection = this.container.createDiv({ cls: 'todo-add-section' });
        this.addTodoInput = addSection.createEl('input', {
            type: 'text',
            placeholder: 'Add a new task...',
            cls: 'todo-add-input'
        });

        const addButton = addSection.createEl('button', {
            text: '+',
            cls: 'todo-add-btn'
        });

        // Bind events
        this.addTodoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addNewTodo();
            }
        });

        addButton.addEventListener('click', () => this.addNewTodo());
    }


    private async loadTodos() {
        // Parse todos based on settings
        if (this.plugin.settings.todoParseMode === 'single-file') {
            await this.parseTodosFromSingleFile();
        } else {
            await this.parseTodosFromVault();
        }
    }

    private async parseTodosFromSingleFile() {
        this.todos = [];
        
        // Get the specified file
        const todoFile = this.plugin.app.vault.getAbstractFileByPath(this.plugin.settings.todoSourceFile) as TFile;
        
        if (!todoFile) {
            // Try to create the file if it doesn't exist
            try {
                const newFile = await this.plugin.app.vault.create(
                    this.plugin.settings.todoSourceFile, 
                    `# Tasks\n\n- [ ] Add your first task here\n`
                );
                await this.parseTodoFile(newFile);
            } catch (error) {
                console.error('Could not create todo file:', error);
            }
        } else {
            await this.parseTodoFile(todoFile);
        }
    }
    
    private async parseTodoFile(file: TFile) {
        try {
            const content = await this.plugin.app.vault.read(file);
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                const todoMatch = line.match(/^(\s*)- \[([ xX])\] (.+)$/);
                if (todoMatch) {
                    const [, , completed, text] = todoMatch;
                    const isCompleted = completed.toLowerCase() === 'x';
                    
                    // Extract category from tags (optional)
                    const categoryMatch = text.match(/#(\w+)/);
                    const category = categoryMatch ? categoryMatch[1] : undefined;
                    
                    // Extract priority (optional)
                    let priority: 'high' | 'medium' | 'low' | undefined;
                    if (text.includes('!!')) priority = 'high';
                    else if (text.includes('!')) priority = 'medium';
                    else priority = 'low';

                    // Extract completion date from comment if it exists
                    let completedDate: number | undefined;
                    if (isCompleted) {
                        const completedDateMatch = text.match(/<!--completed:(\d+)-->/);
                        if (completedDateMatch) {
                            completedDate = parseInt(completedDateMatch[1]);
                        } else {
                            // If no completion date found but task is completed, assume today
                            completedDate = Date.now();
                        }
                    }

                    this.todos.push({
                        id: `todo-${file.path}-${index}`,
                        text: text.replace(/#\w+/g, '').replace(/<!--completed:\d+-->/g, '').trim(),
                        completed: isCompleted,
                        line: index,
                        file: file,
                        category,
                        priority,
                        completedDate
                    });
                }
            });
        } catch (error) {
            console.error(`Error parsing todos from ${file.path}:`, error);
        }
    }

    private async parseTodosFromVault() {
        this.todos = [];
        
        // Get all markdown files in the vault
        const files = this.plugin.app.vault.getMarkdownFiles();
        
        // Parse todos from each file
        for (const file of files) {
            await this.parseTodoFile(file);
        }
        
        // Sort todos by modification time (most recent first)
        this.todos.sort((a, b) => b.file.stat.mtime - a.file.stat.mtime);
    }

    private async parseTodos() {
        // This method is now only used for refreshing after modifications
        await this.loadTodos();
    }

    private renderTodos() {
        this.todoList.empty();

        // Show only active (non-completed) todos
        const filteredTodos = this.todos.filter(todo => !todo.completed);

        if (filteredTodos.length === 0) {
            this.todoList.createEl('div', {
                text: 'No active tasks',
                cls: 'todo-empty-state'
            });
            return;
        }

        // Limit to max todos setting
        const maxTodos = this.plugin.settings.maxTodos || 10;
        const limitedTodos = filteredTodos.slice(0, maxTodos);

        limitedTodos.forEach(todo => {
            const todoItem = this.todoList.createDiv({ cls: 'todo-item' });
            
            if (todo.completed) {
                todoItem.addClass('todo-completed');
            }

            // Checkbox
            const checkbox = todoItem.createEl('input', {
                type: 'checkbox',
                cls: 'todo-checkbox'
            });
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => this.toggleTodo(todo));

            // Text
            const textEl = todoItem.createEl('span', {
                text: todo.text,
                cls: 'todo-text'
            });

            // Priority indicator (only show for incomplete tasks)
            if (todo.priority && todo.priority !== 'low' && !todo.completed) {
                const priorityEl = todoItem.createEl('span', {
                    cls: `todo-priority todo-priority-${todo.priority}`
                });
                priorityEl.textContent = todo.priority === 'high' ? '!!' : '!';
            }

            // Category tag
            if (todo.category) {
                todoItem.createEl('span', {
                    text: `#${todo.category}`,
                    cls: 'todo-category'
                });
            }

            // Right-click to delete
            todoItem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showDeleteMenu(e, todo);
            });
        });
    }


    private async toggleTodo(todo: TodoItem) {
        try {
            const content = await this.plugin.app.vault.read(todo.file);
            const lines = content.split('\n');
            
            // Toggle the checkbox in the specific line
            const currentLine = lines[todo.line];
            if (currentLine) {
                const newStatus = todo.completed ? ' ' : 'x';
                let newLine = currentLine.replace(/- \[([ xX])\]/, `- [${newStatus}]`);
                
                // Remove any completion date comments when toggling
                newLine = newLine.replace(/<!--completed:\d+-->/g, '').trim();
                
                lines[todo.line] = newLine;
                
                await this.plugin.app.vault.modify(todo.file, lines.join('\n'));
                
                // Update local state
                todo.completed = !todo.completed;
                todo.completedDate = todo.completed ? Date.now() : undefined;
                this.updateProgressBar();
                this.renderTodos();
                
                new Notice(todo.completed ? 'Task completed!' : 'Task reopened');
                
                // If immediate cleanup is enabled and task is completed, remove it
                if (todo.completed && this.plugin.settings.autoCleanupCompleted && this.plugin.settings.cleanupDelayDays === 0) {
                    setTimeout(() => {
                        this.deleteTodo(todo);
                    }, 1000); // Small delay to show completion state briefly
                }
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            new Notice('Failed to update task');
        }
    }

    private showDeleteMenu(event: MouseEvent, todo: TodoItem) {
        const menu = new Menu();
        
        menu.addItem((item) => {
            item
                .setTitle('Delete Task')
                .setIcon('trash')
                .onClick(() => {
                    this.deleteTodo(todo);
                });
        });
        
        menu.showAtMouseEvent(event);
    }

    private async deleteTodo(todo: TodoItem) {
        try {
            const content = await this.plugin.app.vault.read(todo.file);
            const lines = content.split('\n');
            
            // Remove the todo line
            lines.splice(todo.line, 1);
            
            await this.plugin.app.vault.modify(todo.file, lines.join('\n'));
            
            // Refresh the todo list
            await this.refreshTodos();
            
            new Notice('Task deleted');
        } catch (error) {
            console.error('Error deleting todo:', error);
            new Notice('Failed to delete task');
        }
    }

    private async addNewTodo() {
        const text = this.addTodoInput.value.trim();
        if (!text) return;

        try {
            // Determine which file to add the todo to based on mode
            let todoFileName: string;
            if (this.plugin.settings.todoParseMode === 'single-file') {
                todoFileName = this.plugin.settings.todoSourceFile;
            } else {
                todoFileName = this.plugin.settings.defaultTodoFile || 'Tasks.md';
            }
            
            let todoFile = this.plugin.app.vault.getAbstractFileByPath(todoFileName) as TFile;
            
            if (!todoFile) {
                // Create the file if it doesn't exist
                todoFile = await this.plugin.app.vault.create(todoFileName, `# Tasks\n\n`);
            }

            const content = await this.plugin.app.vault.read(todoFile);
            const newTodoLine = `- [ ] ${text}`;
            const updatedContent = content.trimEnd() + '\n' + newTodoLine;
            
            await this.plugin.app.vault.modify(todoFile, updatedContent);
            
            this.addTodoInput.value = '';
            await this.refreshTodos();
            
            new Notice('Task added!');
        } catch (error) {
            console.error('Error adding todo:', error);
            new Notice('Failed to add task');
        }
    }

    private updateProgressBar() {
        if (!this.progressBar) return;

        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.progressBar.empty();
        
        const progressContainer = this.progressBar.createDiv({ cls: 'progress-bar-container' });
        const progressFill = progressContainer.createDiv({ cls: 'progress-bar-fill' });
        progressFill.style.width = `${percentage}%`;
        
        // Hide task counter when auto-cleanup is enabled with 0 days delay
        const hideCounter = this.plugin.settings.autoCleanupCompleted && this.plugin.settings.cleanupDelayDays === 0;
        
        if (!hideCounter) {
            const progressText = this.progressBar.createDiv({ 
                cls: 'progress-text',
                text: `${completed}/${total} (${percentage}%)`
            });
        }
    }

    private async refreshTodos() {
        await this.parseTodos();
        this.updateProgressBar();
        this.renderTodos();
    }

    private registerFileEvents() {
        // Listen for file modifications
        this.fileModifyEventRef = this.plugin.app.vault.on('modify', (file) => {
            if (file instanceof TFile && file.extension === 'md') {
                this.debouncedRefresh();
            }
        });

        // Listen for file creations
        this.fileCreateEventRef = this.plugin.app.vault.on('create', (file) => {
            if (file instanceof TFile && file.extension === 'md') {
                this.debouncedRefresh();
            }
        });

        // Listen for file deletions
        this.fileDeleteEventRef = this.plugin.app.vault.on('delete', (file) => {
            if (file instanceof TFile && file.extension === 'md') {
                this.debouncedRefresh();
            }
        });
    }

    private debouncedRefresh() {
        // Clear existing timeout
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        // Set new timeout to refresh after 500ms of no changes
        this.refreshTimeout = setTimeout(() => {
            this.refreshTodos();
        }, 500);
    }

    private startCleanupInterval() {
        if (!this.plugin.settings.autoCleanupCompleted) {
            return;
        }

        // Run cleanup every hour
        this.cleanupInterval = setInterval(() => {
            this.cleanupCompletedTasks();
        }, 60 * 60 * 1000); // 1 hour

        // Also run cleanup immediately if it's been a while
        this.cleanupCompletedTasks();
    }

    private async cleanupCompletedTasks() {
        if (!this.plugin.settings.autoCleanupCompleted) {
            return;
        }

        const cutoffTime = this.plugin.settings.cleanupDelayDays === 0 ? 
            Date.now() : 
            Date.now() - (this.plugin.settings.cleanupDelayDays * 24 * 60 * 60 * 1000);
        let cleanedCount = 0;

        // Group todos by file for efficient processing
        const todosByFile = new Map<string, TodoItem[]>();
        for (const todo of this.todos) {
            if (todo.completed && todo.completedDate && todo.completedDate < cutoffTime) {
                if (!todosByFile.has(todo.file.path)) {
                    todosByFile.set(todo.file.path, []);
                }
                todosByFile.get(todo.file.path)!.push(todo);
            }
        }

        // Process each file
        for (const [filePath, todosToClean] of todosByFile) {
            const file = this.plugin.app.vault.getAbstractFileByPath(filePath) as TFile;
            if (!file) continue;

            try {
                const content = await this.plugin.app.vault.read(file);
                const lines = content.split('\n');

                // Sort todos by line number in descending order to avoid index shifting
                const sortedTodos = todosToClean.sort((a, b) => b.line - a.line);

                // Remove lines
                for (const todo of sortedTodos) {
                    if (todo.line < lines.length) {
                        lines.splice(todo.line, 1);
                        cleanedCount++;
                    }
                }

                // Write back to file
                await this.plugin.app.vault.modify(file, lines.join('\n'));
            } catch (error) {
                console.error(`Error cleaning up todos in ${filePath}:`, error);
            }
        }

        if (cleanedCount > 0) {
            new Notice(`Cleaned up ${cleanedCount} completed task${cleanedCount === 1 ? '' : 's'}`);
            // Refresh the todo list
            await this.refreshTodos();
        }
    }

    public destroy() {
        // Clean up event listeners
        if (this.fileModifyEventRef) {
            this.plugin.app.vault.offref(this.fileModifyEventRef);
        }
        if (this.fileCreateEventRef) {
            this.plugin.app.vault.offref(this.fileCreateEventRef);
        }
        if (this.fileDeleteEventRef) {
            this.plugin.app.vault.offref(this.fileDeleteEventRef);
        }
        
        // Clear timeouts and intervals
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        
        this.container.empty();
    }
}