// Export/Import Module for VPE Thin UI
// Handles configuration export/import functionality

class ExportImportManager {
    constructor(client) {
        this.client = client;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Export all button
        const exportAllBtn = document.getElementById('export-all');
        exportAllBtn?.addEventListener('click', () => {
            this.exportAll();
        });

        // Import all button
        const importAllBtn = document.getElementById('import-all');
        importAllBtn?.addEventListener('click', () => {
            this.importAll();
        });

        // Export settings button
        const exportSettingsBtn = document.getElementById('export-settings');
        exportSettingsBtn?.addEventListener('click', () => {
            this.exportSettings();
        });

        // Import settings button
        const importSettingsBtn = document.getElementById('import-settings');
        importSettingsBtn?.addEventListener('click', () => {
            this.importSettings();
        });

        // Export templates button
        const exportTemplatesBtn = document.getElementById('export-templates');
        exportTemplatesBtn?.addEventListener('click', () => {
            this.exportTemplates();
        });

        // Import templates button
        const importTemplatesBtn = document.getElementById('import-templates');
        importTemplatesBtn?.addEventListener('click', () => {
            this.importTemplates();
        });

        // Export styles button
        const exportStylesBtn = document.getElementById('export-styles');
        exportStylesBtn?.addEventListener('click', () => {
            this.exportStyles();
        });

        // Import styles button
        const importStylesBtn = document.getElementById('import-styles');
        importStylesBtn?.addEventListener('click', () => {
            this.importStyles();
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

        // Export configs button
        const exportConfigsBtn = document.getElementById('export-configs');
        exportConfigsBtn?.addEventListener('click', () => {
            this.exportConfigs();
        });

        // Import configs button
        const importConfigsBtn = document.getElementById('import-configs');
        importConfigsBtn?.addEventListener('click', () => {
            this.importConfigs();
        });
    }

    exportAll() {
        const exportData = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            metadata: {
                export_type: 'full',
                description: 'Complete VPE Thin UI export including all settings, templates, styles, history, and configurations'
            },
            data: {
                settings: this.client.state,
                templates: this.client.config.templates || [],
                styles: this.client.config.styles || [],
                history: this.client.state.history || [],
                configs: this.client.state.savedConfigs || [],
                user_templates: this.client.templateManager ? this.client.templateManager.userTemplates : [],
                current_style: this.client.styleManager ? this.client.styleManager.currentStyle : null
            }
        };

        this.downloadFile(exportData, 'vpe_full_export', 'json');
        this.client.showInfo('Complete configuration exported successfully');
    }

    importAll() {
        this.uploadFile(async (data) => {
            try {
                if (!data.data) {
                    throw new Error('Invalid export file format');
                }

                const confirmed = confirm('This will overwrite your current settings, templates, styles, and history. Continue?');
                if (!confirmed) return;

                // Import settings
                if (data.data.settings) {
                    this.client.state = { ...this.client.state, ...data.data.settings };
                    this.client.updateUI();
                    this.client.saveState();
                }

                // Import templates
                if (data.data.templates && Array.isArray(data.data.templates)) {
                    this.client.config.templates = data.data.templates;
                    if (this.client.templateManager) {
                        this.client.templateManager.updateTemplateSelect();
                    }
                }

                // Import styles
                if (data.data.styles && Array.isArray(data.data.styles)) {
                    this.client.config.styles = data.data.styles;
                    if (this.client.styleManager) {
                        this.client.styleManager.updateStyleUI();
                    }
                }

                // Import history
                if (data.data.history && Array.isArray(data.data.history)) {
                    this.client.state.history = data.data.history;
                    this.client.historyManager?.saveHistory();
                }

                // Import configs
                if (data.data.configs && Array.isArray(data.data.configs)) {
                    this.client.state.savedConfigs = data.data.configs;
                    this.client.saveState();
                }

                // Import user templates
                if (data.data.user_templates && Array.isArray(data.data.user_templates)) {
                    if (this.client.templateManager) {
                        this.client.templateManager.userTemplates = data.data.user_templates;
                        this.client.templateManager.saveUserTemplates();
                        this.client.templateManager.updateTemplateSelect();
                    }
                }

                // Import current style
                if (data.data.current_style) {
                    if (this.client.styleManager) {
                        this.client.styleManager.selectStyle(data.data.current_style.id);
                    }
                }

                this.client.showInfo('Complete configuration imported successfully');
            } catch (error) {
                this.client.showError('Failed to import configuration: ' + error.message);
            }
        });
    }

    exportSettings() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'settings',
            settings: this.client.state
        };

        this.downloadFile(exportData, 'vpe_settings', 'json');
        this.client.showInfo('Settings exported successfully');
    }

    importSettings() {
        this.uploadFile(async (data) => {
            try {
                if (!data.settings) {
                    throw new Error('Invalid settings file format');
                }

                const confirmed = confirm('This will overwrite your current settings. Continue?');
                if (!confirmed) return;

                this.client.state = { ...this.client.state, ...data.settings };
                this.client.updateUI();
                this.client.saveState();

                this.client.showInfo('Settings imported successfully');
            } catch (error) {
                this.client.showError('Failed to import settings: ' + error.message);
            }
        });
    }

    exportTemplates() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'templates',
            templates: this.client.config.templates || [],
            user_templates: this.client.templateManager ? this.client.templateManager.userTemplates : []
        };

        this.downloadFile(exportData, 'vpe_templates', 'json');
        this.client.showInfo('Templates exported successfully');
    }

    importTemplates() {
        this.uploadFile(async (data) => {
            try {
                if (!data.templates || !Array.isArray(data.templates)) {
                    throw new Error('Invalid templates file format');
                }

                const confirmed = confirm('This will overwrite your current templates. Continue?');
                if (!confirmed) return;

                this.client.config.templates = data.templates;

                if (this.client.templateManager) {
                    if (data.user_templates && Array.isArray(data.user_templates)) {
                        this.client.templateManager.userTemplates = data.user_templates;
                        this.client.templateManager.saveUserTemplates();
                    }
                    this.client.templateManager.updateTemplateSelect();
                }

                this.client.showInfo('Templates imported successfully');
            } catch (error) {
                this.client.showError('Failed to import templates: ' + error.message);
            }
        });
    }

    exportStyles() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'styles',
            styles: this.client.config.styles || []
        };

        this.downloadFile(exportData, 'vpe_styles', 'json');
        this.client.showInfo('Styles exported successfully');
    }

    importStyles() {
        this.uploadFile(async (data) => {
            try {
                if (!data.styles || !Array.isArray(data.styles)) {
                    throw new Error('Invalid styles file format');
                }

                const confirmed = confirm('This will overwrite your current styles. Continue?');
                if (!confirmed) return;

                this.client.config.styles = data.styles;

                if (this.client.styleManager) {
                    this.client.styleManager.updateStyleUI();
                }

                this.client.showInfo('Styles imported successfully');
            } catch (error) {
                this.client.showError('Failed to import styles: ' + error.message);
            }
        });
    }

    exportHistory() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'history',
            history: this.client.state.history || []
        };

        this.downloadFile(exportData, 'vpe_history', 'json');
        this.client.showInfo('History exported successfully');
    }

    importHistory() {
        this.uploadFile(async (data) => {
            try {
                if (!data.history || !Array.isArray(data.history)) {
                    throw new Error('Invalid history file format');
                }

                const confirmed = confirm('This will merge with your current history. Continue?');
                if (!confirmed) return;

                // Merge histories, avoiding duplicates by ID
                const existingIds = new Set(this.client.state.history.map(h => h.id));
                const newEntries = data.history.filter(h => !existingIds.has(h.id));

                if (newEntries.length > 0) {
                    this.client.state.history = [...newEntries, ...this.client.state.history];

                    // Limit to 100 entries
                    if (this.client.state.history.length > 100) {
                        this.client.state.history = this.client.state.history.slice(0, 100);
                    }

                    this.client.historyManager?.saveHistory();
                    this.client.showInfo(`Imported ${newEntries.length} history entries`);
                } else {
                    this.client.showInfo('No new history entries to import');
                }
            } catch (error) {
                this.client.showError('Failed to import history: ' + error.message);
            }
        });
    }

    exportConfigs() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'configs',
            configs: this.client.state.savedConfigs || []
        };

        this.downloadFile(exportData, 'vpe_configs', 'json');
        this.client.showInfo('Configurations exported successfully');
    }

    importConfigs() {
        this.uploadFile(async (data) => {
            try {
                if (!data.configs || !Array.isArray(data.configs)) {
                    throw new Error('Invalid configurations file format');
                }

                const confirmed = confirm('This will merge with your current configurations. Continue?');
                if (!confirmed) return;

                // Merge configs, avoiding duplicates by name
                const existingNames = new Set(this.client.state.savedConfigs.map(c => c.name));
                const newConfigs = data.configs.filter(c => !existingNames.has(c.name));

                if (newConfigs.length > 0) {
                    this.client.state.savedConfigs = [...newConfigs, ...this.client.state.savedConfigs];
                    this.client.saveState();
                    this.client.showInfo(`Imported ${newConfigs.length} configurations`);
                } else {
                    this.client.showInfo('No new configurations to import');
                }
            } catch (error) {
                this.client.showError('Failed to import configurations: ' + error.message);
            }
        });
    }

    downloadFile(data, filename, extension) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${Date.now()}.${extension}`;
        link.click();

        URL.revokeObjectURL(url);
    }

    uploadFile(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    await callback(data);
                } catch (error) {
                    this.client.showError('Failed to import file: ' + error.message);
                }
            }
        };

        input.click();
    }

    async exportToClipboard() {
        const exportData = {
            timestamp: new Date().toISOString(),
            type: 'clipboard',
            settings: this.client.state,
            templates: this.client.config.templates || [],
            styles: this.client.config.styles || []
        };

        const dataStr = JSON.stringify(exportData, null, 2);

        try {
            await navigator.clipboard.writeText(dataStr);
            this.client.showInfo('Configuration copied to clipboard');
        } catch (error) {
            this.client.showError('Failed to copy to clipboard: ' + error.message);
        }
    }

    async importFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const data = JSON.parse(text);
            if (!data.settings) {
                throw new Error('Invalid clipboard data format');
            }

            const confirmed = confirm('This will overwrite your current settings. Continue?');
            if (!confirmed) return;

            this.client.state = { ...this.client.state, ...data.settings };
            this.client.updateUI();
            this.client.saveState();

            if (data.templates && Array.isArray(data.templates)) {
                this.client.config.templates = data.templates;
                if (this.client.templateManager) {
                    this.client.templateManager.updateTemplateSelect();
                }
            }

            if (data.styles && Array.isArray(data.styles)) {
                this.client.config.styles = data.styles;
                if (this.client.styleManager) {
                    this.client.styleManager.updateStyleUI();
                }
            }

            this.client.showInfo('Configuration imported from clipboard');
        } catch (error) {
            this.client.showError('Failed to import from clipboard: ' + error.message);
        }
    }

    exportAsShareableLink() {
        const exportData = {
            settings: this.client.state,
            templates: this.client.config.templates || [],
            styles: this.client.config.styles || []
        };

        const dataStr = JSON.stringify(exportData);
        const compressed = this.compressData(dataStr);
        const shareableUrl = `${window.location.origin}${window.location.pathname}?config=${encodeURIComponent(compressed)}`;

        // Create share modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'share-modal';
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Share Configuration</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Share this configuration with others:</p>
                        <div class="input-group">
                            <input type="text" class="form-control" value="${shareableUrl}" readonly id="share-url">
                            <button class="btn btn-outline-secondary" type="button" onclick="window.exportImportManager.copyShareUrl()">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <div class="mt-3">
                            <p class="text-muted small">
                                Note: This URL contains your current settings, templates, and styles. 
                                Anyone with this link can import your configuration.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Initialize Bootstrap modal
        const shareModal = new bootstrap.Modal(modal);
        window.shareModal = shareModal; // Store reference
        shareModal.show();

        // Clean up modal when closed
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    copyShareUrl() {
        const urlInput = document.getElementById('share-url');
        if (urlInput) {
            urlInput.select();
            urlInput.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            this.client.showInfo('Share URL copied to clipboard');
        }
    }

    importFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const configParam = urlParams.get('config');

        if (configParam) {
            try {
                const decompressed = this.decompressData(configParam);
                const data = JSON.parse(decompressed);

                if (data.settings) {
                    this.client.state = { ...this.client.state, ...data.settings };
                    this.client.updateUI();
                    this.client.saveState();
                }

                if (data.templates && Array.isArray(data.templates)) {
                    this.client.config.templates = data.templates;
                    if (this.client.templateManager) {
                        this.client.templateManager.updateTemplateSelect();
                    }
                }

                if (data.styles && Array.isArray(data.styles)) {
                    this.client.config.styles = data.styles;
                    if (this.client.styleManager) {
                        this.client.styleManager.updateStyleUI();
                    }
                }

                this.client.showInfo('Configuration imported from URL');

                // Remove the config parameter from URL
                const newUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);

            } catch (error) {
                console.error('Failed to import from URL:', error);
            }
        }
    }

    compressData(data) {
        // Simple compression using btoa (base64 encoding)
        // In a real implementation, you might want to use a proper compression library
        return btoa(unescape(encodeURIComponent(data)));
    }

    decompressData(data) {
        // Simple decompression using atob (base64 decoding)
        return decodeURIComponent(escape(atob(data)));
    }

    createBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            type: 'backup',
            version: '1.0.0',
            data: {
                settings: this.client.state,
                templates: this.client.config.templates || [],
                styles: this.client.config.styles || [],
                history: this.client.state.history || [],
                configs: this.client.state.savedConfigs || [],
                user_templates: this.client.templateManager ? this.client.templateManager.userTemplates : []
            }
        };

        this.downloadFile(backupData, 'vpe_backup', 'json');
        this.client.showInfo('Backup created successfully');
    }

    restoreBackup() {
        this.uploadFile(async (data) => {
            try {
                if (!data.data || data.type !== 'backup') {
                    throw new Error('Invalid backup file format');
                }

                const confirmed = confirm('This will restore your complete configuration from backup. Continue?');
                if (!confirmed) return;

                // Restore all data
                this.client.state = data.data.settings || this.client.state;
                this.client.config.templates = data.data.templates || [];
                this.client.config.styles = data.data.styles || [];
                this.client.state.history = data.data.history || [];
                this.client.state.savedConfigs = data.data.configs || [];

                if (this.client.templateManager) {
                    this.client.templateManager.userTemplates = data.data.user_templates || [];
                    this.client.templateManager.saveUserTemplates();
                    this.client.templateManager.updateTemplateSelect();
                }

                this.client.updateUI();
                this.client.saveState();
                this.client.historyManager?.saveHistory();

                this.client.showInfo('Backup restored successfully');
            } catch (error) {
                this.client.showError('Failed to restore backup: ' + error.message);
            }
        });
    }

    validateExportData(data) {
        const errors = [];

        if (!data || typeof data !== 'object') {
            return { isValid: false, errors: ['Invalid data format'] };
        }

        if (!data.timestamp) {
            errors.push('Missing timestamp');
        }

        // Full export format (with nested data)
        if (data.data) {
            if (!data.data.settings || typeof data.data.settings !== 'object') {
                errors.push('Missing or invalid settings');
            }
            if (data.data.templates !== undefined && !Array.isArray(data.data.templates)) {
                errors.push('Invalid templates format');
            }
            if (data.data.styles !== undefined && !Array.isArray(data.data.styles)) {
                errors.push('Invalid styles format');
            }
        }
        // Flat export format (settings at top level)
        else if (data.settings) {
            if (typeof data.settings !== 'object') {
                errors.push('Invalid settings format');
            }
        }
        // Type-specific exports
        else if (!data.templates && !data.styles && !data.history && !data.configs) {
            errors.push('No recognizable export data found');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Export for use in main client
window.ExportImportManager = ExportImportManager;