// History Manager Module for VPE Thin UI
// Handles generation history functionality

class HistoryManager {
    constructor(client) {
        this.client = client;
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // History button
        const historyBtn = document.getElementById('history');
        historyBtn?.addEventListener('click', () => {
            this.showHistory();
        });

        // Clear history button
        const clearHistoryBtn = document.getElementById('clear-history');
        clearHistoryBtn?.addEventListener('click', () => {
            this.clearHistory();
        });

        // Export history button
        const exportHistoryBtn = document.getElementById('export-history');
        exportHistoryBtn?.addEventListener('click', () => {
            this.exportHistory();
        });

        // Import history button
        const importHistoryBtn = document.getElementById('import-history');
        importHistoryBtn?.addEventListener('click', () => {
            this.importHistory();
        });
    }

    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('vpe_generation_history');
            if (savedHistory) {
                this.client.state.history = JSON.parse(savedHistory);
            } else {
                this.client.state.history = [];
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            this.client.state.history = [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('vpe_generation_history', JSON.stringify(this.client.state.history));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    addToHistory(prompt, settings, image = null) {
        const historyEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            prompt: prompt,
            settings: settings,
            image: image, // Base64 encoded image
            metadata: {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                prompt_length: prompt.length,
                settings_summary: this.generateSettingsSummary(settings)
            }
        };

        this.client.state.history.unshift(historyEntry);

        // Limit history to 100 entries
        if (this.client.state.history.length > 100) {
            this.client.state.history = this.client.state.history.slice(0, 100);
        }

        this.saveHistory();
    }

    generateSettingsSummary(settings) {
        return {
            cfg_scale: settings.cfg_scale,
            steps: settings.steps,
            sampler: settings.sampler,
            aspect_ratio: settings.aspect_ratio,
            quality: settings.quality,
            batch_mode: settings.batch_mode,
            batch_size: settings.batch_size
        };
    }

    showHistory() {
        const historyContainer = document.getElementById('history-container');
        if (!historyContainer) return;

        historyContainer.innerHTML = '';

        if (this.client.state.history.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-history fa-3x mb-3"></i>
                    <p>No generation history available.</p>
                    <p class="small">Your generated images will appear here.</p>
                </div>
            `;
            return;
        }

        // Create history grid
        const grid = document.createElement('div');
        grid.className = 'row';

        this.client.state.history.forEach((entry, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';

            const card = document.createElement('div');
            card.className = 'card h-100';

            // Card header with timestamp
            const header = document.createElement('div');
            header.className = 'card-header d-flex justify-content-between align-items-center';
            header.innerHTML = `
                <small class="text-muted">${new Date(entry.timestamp).toLocaleString()}</small>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="window.vpeClient.historyManager.loadHistoryEntry('${entry.id}')" title="Use this prompt">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="window.vpeClient.historyManager.viewHistoryEntry('${entry.id}')" title="View details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="window.vpeClient.historyManager.deleteHistoryEntry('${entry.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Card body with prompt
            const body = document.createElement('div');
            body.className = 'card-body';
            body.innerHTML = `
                <h6 class="card-title">Prompt</h6>
                <p class="card-text text-muted small">${this.truncateText(entry.prompt, 100)}</p>
            `;

            // Card footer with settings
            const footer = document.createElement('div');
            footer.className = 'card-footer';
            footer.innerHTML = `
                <small class="text-muted">
                    <i class="fas fa-cog"></i> ${entry.metadata.settings_summary.sampler} | 
                    <i class="fas fa-sliders-h"></i> CFG: ${entry.metadata.settings_summary.cfg_scale} | 
                    <i class="fas fa-step-forward"></i> Steps: ${entry.metadata.settings_summary.steps}
                </small>
            `;

            card.appendChild(header);
            card.appendChild(body);
            card.appendChild(footer);
            col.appendChild(card);
            grid.appendChild(col);
        });

        historyContainer.appendChild(grid);

        // Add summary stats
        const stats = document.createElement('div');
        stats.className = 'mt-4 p-3 bg-light rounded';
        stats.innerHTML = `
            <h6>History Statistics</h6>
            <div class="row text-center">
                <div class="col">
                    <strong>${this.client.state.history.length}</strong>
                    <br><small class="text-muted">Total Generations</small>
                </div>
                <div class="col">
                    <strong>${this.getUniquePromptsCount()}</strong>
                    <br><small class="text-muted">Unique Prompts</small>
                </div>
                <div class="col">
                    <strong>${this.getAveragePromptLength()}</strong>
                    <br><small class="text-muted">Avg Prompt Length</small>
                </div>
            </div>
        `;
        historyContainer.appendChild(stats);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    getUniquePromptsCount() {
        const uniquePrompts = new Set(this.client.state.history.map(entry => entry.prompt));
        return uniquePrompts.size;
    }

    getAveragePromptLength() {
        if (this.client.state.history.length === 0) return 0;
        const totalLength = this.client.state.history.reduce((sum, entry) => sum + entry.prompt.length, 0);
        return Math.round(totalLength / this.client.state.history.length);
    }

    loadHistoryEntry(id) {
        const entry = this.client.state.history.find(h => h.id === id);
        if (entry) {
            this.client.state.prompt = entry.prompt;
            this.client.state.cfgScale = entry.settings.cfg_scale;
            this.client.state.steps = entry.settings.steps;
            this.client.state.sampler = entry.settings.sampler;
            this.client.state.aspectRatio = entry.settings.aspect_ratio;
            this.client.state.quality = entry.settings.quality;
            this.client.state.batchMode = entry.settings.batch_mode;
            this.client.state.batchSize = entry.settings.batch_size;

            this.client.updateUI();
            this.client.showInfo('History entry loaded');
        }
    }

    viewHistoryEntry(id) {
        const entry = this.client.state.history.find(h => h.id === id);
        if (!entry) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'history-modal';
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Generation Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h6>Prompt</h6>
                                <p class="bg-light p-3 rounded">${entry.prompt}</p>
                                
                                ${entry.image ? `
                                    <h6>Generated Image</h6>
                                    <img src="data:image/png;base64,${entry.image}" class="img-fluid rounded" alt="Generated image">
                                ` : '<p class="text-muted">No image available</p>'}
                            </div>
                            <div class="col-md-4">
                                <h6>Settings</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>CFG Scale:</strong></td><td>${entry.settings.cfg_scale}</td></tr>
                                    <tr><td><strong>Steps:</strong></td><td>${entry.settings.steps}</td></tr>
                                    <tr><td><strong>Sampler:</strong></td><td>${entry.settings.sampler}</td></tr>
                                    <tr><td><strong>Aspect Ratio:</strong></td><td>${entry.settings.aspect_ratio}</td></tr>
                                    <tr><td><strong>Quality:</strong></td><td>${entry.settings.quality}</td></tr>
                                    <tr><td><strong>Batch Mode:</strong></td><td>${entry.settings.batch_mode ? 'Yes' : 'No'}</td></tr>
                                    ${entry.settings.batch_mode ? `<tr><td><strong>Batch Size:</strong></td><td>${entry.settings.batch_size}</td></tr>` : ''}
                                </table>
                                
                                <h6>Metadata</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Date:</strong></td><td>${entry.metadata.date}</td></tr>
                                    <tr><td><strong>Time:</strong></td><td>${entry.metadata.time}</td></tr>
                                    <tr><td><strong>Prompt Length:</strong></td><td>${entry.metadata.prompt_length} characters</td></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="window.vpeClient.historyManager.loadHistoryEntry('${entry.id}'); window.historyModal.hide();">
                            <i class="fas fa-redo"></i> Use This
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Bootstrap modal
        const historyModal = new bootstrap.Modal(modal);
        window.historyModal = historyModal; // Store reference
        historyModal.show();

        // Clean up modal when closed
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteHistoryEntry(id) {
        const confirmed = confirm('Are you sure you want to delete this history entry?');
        if (!confirmed) return;

        this.client.state.history = this.client.state.history.filter(h => h.id !== id);
        this.saveHistory();

        this.client.showInfo('History entry deleted');
        this.showHistory(); // Refresh the view
    }

    clearHistory() {
        const confirmed = confirm('Are you sure you want to clear all history? This action cannot be undone.');
        if (!confirmed) return;

        this.client.state.history = [];
        this.saveHistory();

        this.client.showInfo('History cleared');
        this.showHistory(); // Refresh the view
    }

    exportHistory() {
        const historyData = {
            timestamp: new Date().toISOString(),
            total_entries: this.client.state.history.length,
            history: this.client.state.history
        };

        const dataStr = JSON.stringify(historyData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `vpe_history_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.client.showInfo('History exported successfully');
    }

    importHistory() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const historyData = JSON.parse(text);

                    if (historyData.history && Array.isArray(historyData.history)) {
                        // Merge histories, avoiding duplicates by ID
                        const existingIds = new Set(this.client.state.history.map(h => h.id));
                        const newEntries = historyData.history.filter(h => !existingIds.has(h.id));

                        if (newEntries.length > 0) {
                            this.client.state.history = [...newEntries, ...this.client.state.history];

                            // Limit to 100 entries
                            if (this.client.state.history.length > 100) {
                                this.client.state.history = this.client.state.history.slice(0, 100);
                            }

                            this.saveHistory();
                            this.client.showInfo(`Imported ${newEntries.length} history entries`);
                        } else {
                            this.client.showInfo('No new history entries to import');
                        }
                    } else {
                        this.client.showError('Invalid history file format');
                    }
                } catch (error) {
                    this.client.showError('Failed to import history: ' + error.message);
                }
            }
        };

        input.click();
    }

    searchHistory(query) {
        if (!query || query.trim() === '') {
            this.showHistory();
            return;
        }

        const searchResults = this.client.state.history.filter(entry =>
            entry.prompt.toLowerCase().includes(query.toLowerCase())
        );

        const historyContainer = document.getElementById('history-container');
        if (!historyContainer) return;

        historyContainer.innerHTML = '';

        if (searchResults.length === 0) {
            historyContainer.innerHTML = `
                <div class="text-center text-muted py-4">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <p>No history entries found matching: "${query}"</p>
                </div>
            `;
            return;
        }

        // Create search results grid
        const grid = document.createElement('div');
        grid.className = 'row';

        searchResults.forEach((entry, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';

            const card = document.createElement('div');
            card.className = 'card h-100';

            // Highlight search terms in prompt
            const highlightedPrompt = this.highlightSearchTerms(entry.prompt, query);

            // Card header with timestamp
            const header = document.createElement('div');
            header.className = 'card-header d-flex justify-content-between align-items-center';
            header.innerHTML = `
                <small class="text-muted">${new Date(entry.timestamp).toLocaleString()}</small>
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-outline-primary" onclick="window.vpeClient.historyManager.loadHistoryEntry('${entry.id}')" title="Use this prompt">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="window.vpeClient.historyManager.viewHistoryEntry('${entry.id}')" title="View details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="window.vpeClient.historyManager.deleteHistoryEntry('${entry.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Card body with highlighted prompt
            const body = document.createElement('div');
            body.className = 'card-body';
            body.innerHTML = `
                <h6 class="card-title">Prompt</h6>
                <p class="card-text text-muted small">${highlightedPrompt}</p>
            `;

            // Card footer with settings
            const footer = document.createElement('div');
            footer.className = 'card-footer';
            footer.innerHTML = `
                <small class="text-muted">
                    <i class="fas fa-cog"></i> ${entry.metadata.settings_summary.sampler} | 
                    <i class="fas fa-sliders-h"></i> CFG: ${entry.metadata.settings_summary.cfg_scale} | 
                    <i class="fas fa-step-forward"></i> Steps: ${entry.metadata.settings_summary.steps}
                </small>
            `;

            card.appendChild(header);
            card.appendChild(body);
            card.appendChild(footer);
            col.appendChild(card);
            grid.appendChild(col);
        });

        historyContainer.appendChild(grid);

        // Add search summary
        const summary = document.createElement('div');
        summary.className = 'mt-4 p-3 bg-light rounded';
        summary.innerHTML = `
            <h6>Search Results</h6>
            <p>Found <strong>${searchResults.length}</strong> entries matching: <em>"${query}"</em></p>
            <button class="btn btn-sm btn-outline-secondary" onclick="window.vpeClient.historyManager.showHistory()">
                <i class="fas fa-times"></i> Clear Search
            </button>
        `;
        historyContainer.appendChild(summary);
    }

    highlightSearchTerms(text, query) {
        if (!query || query.trim() === '') return text;

        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getHistoryStats() {
        const stats = {
            total_entries: this.client.state.history.length,
            unique_prompts: this.getUniquePromptsCount(),
            average_prompt_length: this.getAveragePromptLength(),
            most_used_sampler: this.getMostUsedSampler(),
            most_used_cfg_scale: this.getMostUsedCfgScale(),
            date_range: this.getDateRange()
        };
        return stats;
    }

    getMostUsedSampler() {
        const samplerCounts = {};
        this.client.state.history.forEach(entry => {
            const sampler = entry.settings.sampler;
            samplerCounts[sampler] = (samplerCounts[sampler] || 0) + 1;
        });

        let mostUsed = '';
        let maxCount = 0;
        for (const [sampler, count] of Object.entries(samplerCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostUsed = sampler;
            }
        }
        return mostUsed;
    }

    getMostUsedCfgScale() {
        const cfgCounts = {};
        this.client.state.history.forEach(entry => {
            const cfg = entry.settings.cfg_scale;
            cfgCounts[cfg] = (cfgCounts[cfg] || 0) + 1;
        });

        let mostUsed = '';
        let maxCount = 0;
        for (const [cfg, count] of Object.entries(cfgCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostUsed = cfg;
            }
        }
        return mostUsed;
    }

    getDateRange() {
        if (this.client.state.history.length === 0) return { start: null, end: null };

        const dates = this.client.state.history.map(entry => new Date(entry.timestamp));
        const start = new Date(Math.min(...dates));
        const end = new Date(Math.max(...dates));

        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    }
}

// Export for use in main client
window.HistoryManager = HistoryManager;