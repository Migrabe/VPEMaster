// Client-side logic for VPE Thin UI - Main Logic Module
// Enhanced with advanced features and improved functionality

class VPEClient {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.isGenerating = false;
        this.currentGenerationId = null;
        this.config = {};
        this.state = {
            prompt: '',
            negativePrompt: '',
            seed: '',
            cfgScale: 7,
            steps: 28,
            sampler: 'Euler a',
            aspectRatio: '1:1',
            quality: 'High',
            batchMode: false,
            batchSize: 1,
            stylePreset: 'realistic',
            template: null,
            history: [],
            savedConfigs: []
        };

        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            this.setupEventListeners();
            this.setupWebSocket();
            this.loadState();
            this.renderUI();
            this.updateUI();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize client');
        }
    }

    async loadConfig() {
        try {
            const results = await Promise.allSettled([
                fetch('/config/prompt-templates.json').then(r => r.json()),
                fetch('/config/style-presets.json').then(r => r.json()),
                fetch('/config/ui-buttons.json').then(r => r.json())
            ]);

            this.config = {
                templates: results[0].status === 'fulfilled' ? results[0].value : [],
                styles: results[1].status === 'fulfilled' ? results[1].value : [],
                buttons: results[2].status === 'fulfilled' ? results[2].value : {}
            };

            results.forEach((r, i) => {
                if (r.status === 'rejected') {
                    const names = ['templates', 'styles', 'buttons'];
                    console.warn(`Failed to load ${names[i]} config:`, r.reason);
                }
            });
        } catch (error) {
            console.error('Failed to load config:', error);
            this.config = { templates: [], styles: [], buttons: {} };
            this.showError('Failed to load configuration files');
        }
    }

    setupEventListeners() {
        // Form controls
        const promptInput = document.getElementById('prompt');
        const negativePromptInput = document.getElementById('negative-prompt');
        const seedInput = document.getElementById('seed');
        const cfgScaleInput = document.getElementById('cfg-scale');
        const stepsInput = document.getElementById('steps');
        const samplerSelect = document.getElementById('sampler');
        const aspectRatioSelect = document.getElementById('aspect-ratio');
        const qualitySelect = document.getElementById('quality');
        const batchModeToggle = document.getElementById('batch-mode');
        const batchSizeInput = document.getElementById('batch-size');

        // Event listeners
        promptInput?.addEventListener('input', (e) => {
            this.state.prompt = e.target.value;
            this.saveState();
        });

        negativePromptInput?.addEventListener('input', (e) => {
            this.state.negativePrompt = e.target.value;
            this.saveState();
        });

        seedInput?.addEventListener('input', (e) => {
            this.state.seed = e.target.value;
            this.saveState();
        });

        cfgScaleInput?.addEventListener('input', (e) => {
            this.state.cfgScale = parseFloat(e.target.value);
            this.updateCfgScaleLabel();
            this.saveState();
        });

        stepsInput?.addEventListener('input', (e) => {
            this.state.steps = parseInt(e.target.value);
            this.updateStepsLabel();
            this.saveState();
        });

        samplerSelect?.addEventListener('change', (e) => {
            this.state.sampler = e.target.value;
            this.saveState();
        });

        aspectRatioSelect?.addEventListener('change', (e) => {
            this.state.aspectRatio = e.target.value;
            this.saveState();
        });

        qualitySelect?.addEventListener('change', (e) => {
            this.state.quality = e.target.value;
            this.applyQualitySettings();
            this.saveState();
        });

        batchModeToggle?.addEventListener('change', (e) => {
            this.state.batchMode = e.target.checked;
            this.updateBatchUI();
            this.saveState();
        });

        batchSizeInput?.addEventListener('input', (e) => {
            this.state.batchSize = parseInt(e.target.value);
            this.saveState();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.generateImage();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveCurrentConfig();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.loadConfigFromStorage();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportConfig();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.importConfig();
                        break;
                }
            }
        });
    }

    setupWebSocket() {
        this._wsReconnectAttempts = 0;
        this._wsMaxReconnect = 5;
        this._wsReconnectDelay = 2000;
        this._connectWebSocket();
    }

    _connectWebSocket() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.hostname || 'localhost';
            const port = window.location.port || '3000';
            this.ws = new WebSocket(`${protocol}//${host}:${port}`);

            this.ws.onopen = () => {
                this.isConnected = true;
                this._wsReconnectAttempts = 0;
                this.updateConnectionStatus(true);
                console.log('WebSocket connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    this.handleMessage(JSON.parse(event.data));
                } catch (err) {
                    console.error('Failed to parse WebSocket message:', err);
                }
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                this.updateConnectionStatus(false);
                console.log('WebSocket disconnected');
                this._scheduleReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Failed to setup WebSocket:', error);
            this._scheduleReconnect();
        }
    }

    _scheduleReconnect() {
        if (this._wsReconnectAttempts >= this._wsMaxReconnect) {
            console.warn('WebSocket: max reconnect attempts reached');
            return;
        }
        this._wsReconnectAttempts++;
        const delay = this._wsReconnectDelay * this._wsReconnectAttempts;
        console.log(`WebSocket: reconnecting in ${delay}ms (attempt ${this._wsReconnectAttempts})`);
        setTimeout(() => this._connectWebSocket(), delay);
    }

    handleMessage(message) {
        switch (message.type) {
            case 'generation_started':
                this.handleGenerationStarted(message);
                break;
            case 'generation_progress':
                this.handleGenerationProgress(message);
                break;
            case 'generation_completed':
                this.handleGenerationCompleted(message);
                break;
            case 'generation_error':
                this.handleGenerationError(message);
                break;
            case 'generation_stopped':
                this.handleGenerationStopped(message);
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handleGenerationStarted(message) {
        this.isGenerating = true;
        this.currentGenerationId = message.generationId;
        this.updateGenerationUI(true);
        this.addToHistory(message.prompt, message.settings);
    }

    handleGenerationProgress(message) {
        const progress = document.getElementById('progress');
        if (progress) {
            progress.style.width = `${message.progress}%`;
        }
    }

    handleGenerationCompleted(message) {
        this.isGenerating = false;
        this.updateGenerationUI(false);

        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${message.image}`;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

            const resultDiv = document.createElement('div');
            resultDiv.style.marginBottom = '20px';
            resultDiv.appendChild(img);

            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-success btn-sm';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadBtn.onclick = () => this.downloadImage(message.image, message.prompt);
            resultDiv.appendChild(downloadBtn);

            resultContainer.insertBefore(resultDiv, resultContainer.firstChild);
        }
    }

    handleGenerationError(message) {
        this.isGenerating = false;
        this.updateGenerationUI(false);
        this.showError(`Generation error: ${message.error}`);
    }

    handleGenerationStopped(message) {
        this.isGenerating = false;
        this.updateGenerationUI(false);
        this.showInfo('Generation stopped by user');
    }

    updateCfgScaleLabel() {
        const label = document.getElementById('cfg-scale-label');
        if (label) {
            label.textContent = `CFG Scale: ${this.state.cfgScale}`;
        }
    }

    updateStepsLabel() {
        const label = document.getElementById('steps-label');
        if (label) {
            label.textContent = `Steps: ${this.state.steps}`;
        }
    }

    updateBatchUI() {
        const batchSizeContainer = document.getElementById('batch-size-container');
        if (batchSizeContainer) {
            batchSizeContainer.style.display = this.state.batchMode ? 'block' : 'none';
        }
    }

    updateConnectionStatus(connected) {
        const status = document.getElementById('connection-status');
        if (status) {
            status.textContent = connected ? 'Connected' : 'Disconnected';
            status.className = connected ? 'text-success' : 'text-danger';
        }
    }

    updateGenerationUI(isGenerating) {
        const generateBtn = document.getElementById('generate');
        const stopBtn = document.getElementById('stop');
        const progressContainer = document.getElementById('progress-container');

        if (generateBtn) {
            generateBtn.disabled = isGenerating;
        }

        if (stopBtn) {
            stopBtn.disabled = !isGenerating;
        }

        if (progressContainer) {
            progressContainer.style.display = isGenerating ? 'block' : 'none';
        }
    }

    addToHistory(prompt, settings) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            prompt: prompt,
            settings: settings,
            id: Date.now()
        };

        this.state.history.unshift(historyEntry);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }

        this.saveState();
    }

    saveState() {
        try {
            localStorage.setItem('vpe_client_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }

    loadState() {
        try {
            const savedState = localStorage.getItem('vpe_client_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                // Validate key fields before merging
                const defaults = {
                    prompt: '', negativePrompt: '', seed: '',
                    cfgScale: 7, steps: 28, sampler: 'Euler a',
                    aspectRatio: '1:1', quality: 'High',
                    batchMode: false, batchSize: 1,
                    stylePreset: 'realistic', template: null,
                    history: [], savedConfigs: []
                };
                const validated = {};
                for (const [key, defaultVal] of Object.entries(defaults)) {
                    if (key in parsed && typeof parsed[key] === typeof defaultVal) {
                        validated[key] = parsed[key];
                    } else if (key in parsed && defaultVal === null) {
                        validated[key] = parsed[key];
                    }
                }
                this.state = { ...this.state, ...validated };
            }
        } catch (error) {
            console.error('Failed to load state:', error);
            localStorage.removeItem('vpe_client_state');
        }
    }

    showError(message) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger alert-dismissible fade show';
            alert.innerHTML = `
                <strong>Error:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            alertContainer.appendChild(alert);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    showInfo(message) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = 'alert alert-info alert-dismissible fade show';
            alert.innerHTML = `
                <strong>Info:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            alertContainer.appendChild(alert);

            // Auto-dismiss after 3 seconds
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }
    }

    downloadImage(base64Data, prompt) {
        const link = document.createElement('a');
        link.download = `vpe_${Date.now()}.png`;
        link.href = `data:image/png;base64,${base64Data}`;
        link.click();
    }

    renderUI() {
        // Render template select options
        const templateSelect = document.getElementById('template-select');
        if (templateSelect && this.config.templates) {
            templateSelect.innerHTML = '<option value="">Select Template</option>';
            this.config.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                templateSelect.appendChild(option);
            });
        }

        // Render style buttons
        const styleContainer = document.getElementById('style-container');
        if (styleContainer && this.config.styles) {
            styleContainer.innerHTML = '';
            this.config.styles.forEach(style => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary btn-sm me-2 mb-2 style-btn';
                btn.textContent = style.name;
                btn.dataset.style = style.id;
                btn.title = style.description;
                styleContainer.appendChild(btn);
            });
        }

        // Render quality presets
        const qualitySelect = document.getElementById('quality');
        if (qualitySelect) {
            qualitySelect.innerHTML = '';
            const qualities = ['Low', 'Medium', 'High', 'Ultra'];
            qualities.forEach(quality => {
                const option = document.createElement('option');
                option.value = quality;
                option.textContent = quality;
                qualitySelect.appendChild(option);
            });
        }

        // Render aspect ratios
        const aspectRatioSelect = document.getElementById('aspect-ratio');
        if (aspectRatioSelect) {
            aspectRatioSelect.innerHTML = '';
            const ratios = ['1:1', '16:9', '4:3', '3:2', '2:3'];
            ratios.forEach(ratio => {
                const option = document.createElement('option');
                option.value = ratio;
                option.textContent = ratio;
                aspectRatioSelect.appendChild(option);
            });
        }

        // Render samplers
        const samplerSelect = document.getElementById('sampler');
        if (samplerSelect) {
            samplerSelect.innerHTML = '';
            const samplers = ['Euler', 'Euler a', 'DPM++ 2M', 'DPM++ 2M Karras', 'DDIM'];
            samplers.forEach(sampler => {
                const option = document.createElement('option');
                option.value = sampler;
                option.textContent = sampler;
                samplerSelect.appendChild(option);
            });
        }
    }

    updateUI() {
        // Update form values from state
        const promptInput = document.getElementById('prompt');
        const negativePromptInput = document.getElementById('negative-prompt');
        const seedInput = document.getElementById('seed');
        const cfgScaleInput = document.getElementById('cfg-scale');
        const stepsInput = document.getElementById('steps');
        const samplerSelect = document.getElementById('sampler');
        const aspectRatioSelect = document.getElementById('aspect-ratio');
        const qualitySelect = document.getElementById('quality');
        const batchModeToggle = document.getElementById('batch-mode');
        const batchSizeInput = document.getElementById('batch-size');
        const templateSelect = document.getElementById('template-select');

        if (promptInput) promptInput.value = this.state.prompt;
        if (negativePromptInput) negativePromptInput.value = this.state.negativePrompt;
        if (seedInput) seedInput.value = this.state.seed;
        if (cfgScaleInput) cfgScaleInput.value = this.state.cfgScale;
        if (stepsInput) stepsInput.value = this.state.steps;
        if (samplerSelect) samplerSelect.value = this.state.sampler;
        if (aspectRatioSelect) aspectRatioSelect.value = this.state.aspectRatio;
        if (qualitySelect) qualitySelect.value = this.state.quality;
        if (batchModeToggle) batchModeToggle.checked = this.state.batchMode;
        if (batchSizeInput) batchSizeInput.value = this.state.batchSize;
        if (templateSelect) templateSelect.value = this.state.template;

        // Update labels
        this.updateCfgScaleLabel();
        this.updateStepsLabel();
        this.updateBatchUI();
        this.updateConnectionStatus(this.isConnected);
        this.updateGenerationUI(this.isGenerating);
    }

    applyQualitySettings() {
        switch (this.state.quality) {
            case 'Low':
                this.state.cfgScale = 6;
                this.state.steps = 20;
                this.state.sampler = 'Euler';
                break;
            case 'Medium':
                this.state.cfgScale = 7;
                this.state.steps = 25;
                this.state.sampler = 'Euler a';
                break;
            case 'High':
                this.state.cfgScale = 7.5;
                this.state.steps = 28;
                this.state.sampler = 'DPM++ 2M';
                break;
            case 'Ultra':
                this.state.cfgScale = 8;
                this.state.steps = 30;
                this.state.sampler = 'DPM++ 2M Karras';
                break;
        }

        this.updateUI();
        this.saveState();
    }

    clearAll() {
        this.state.prompt = '';
        this.state.negativePrompt = '';
        this.state.seed = '';
        this.state.cfgScale = 7;
        this.state.steps = 28;
        this.state.sampler = 'Euler a';
        this.state.aspectRatio = '1:1';
        this.state.quality = 'High';
        this.state.batchMode = false;
        this.state.batchSize = 1;
        this.state.stylePreset = 'realistic';
        this.state.template = null;

        this.updateUI();
        this.saveState();
    }

    generateImage() {
        if (!this.state.prompt.trim()) {
            this.showError('Please enter a prompt');
            return;
        }

        if (!this.isConnected) {
            this.showError('Not connected to server');
            return;
        }

        if (this.isGenerating) {
            this.showError('Generation already in progress');
            return;
        }

        const batchSize = this.state.batchMode ? Math.max(1, Math.min(this.state.batchSize, 10)) : 1;

        for (let i = 0; i < batchSize; i++) {
            const settings = {
                prompt: this.state.prompt,
                negative_prompt: this.state.negativePrompt,
                seed: this.state.seed
                    ? (parseInt(this.state.seed) + i).toString()
                    : Math.floor(Math.random() * 4294967295).toString(),
                cfg_scale: this.state.cfgScale,
                steps: this.state.steps,
                sampler: this.state.sampler,
                aspect_ratio: this.state.aspectRatio,
                quality: this.state.quality,
                batch_mode: this.state.batchMode,
                batch_size: batchSize,
                batch_index: i
            };

            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'generate',
                    settings: settings
                }));
            }
        }

        if (batchSize > 1) {
            this.showInfo(`Batch generation started: ${batchSize} images`);
        }
    }

    stopGeneration() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'stop',
                generationId: this.currentGenerationId
            }));
        }
    }

    saveCurrentConfig() {
        const configName = prompt('Enter a name for this configuration:', `Config ${new Date().toLocaleString()}`);
        if (configName) {
            const config = {
                name: configName,
                timestamp: new Date().toISOString(),
                state: { ...this.state }
            };

            this.state.savedConfigs.push(config);
            this.saveState();
            this.showInfo(`Configuration saved as "${configName}"`);
        }
    }

    loadConfigFromStorage() {
        if (this.state.savedConfigs.length === 0) {
            this.showError('No saved configurations found');
            return;
        }

        const configNames = this.state.savedConfigs.map(c => c.name).join('\n');
        const selectedName = prompt(`Saved configurations:\n${configNames}\n\nEnter the name of the configuration to load:`, '');

        if (selectedName) {
            const config = this.state.savedConfigs.find(c => c.name === selectedName);
            if (config) {
                this.state = { ...this.state, ...config.state };
                this.updateUI();
                this.showInfo(`Configuration "${selectedName}" loaded`);
            } else {
                this.showError('Configuration not found');
            }
        }
    }

    exportConfig() {
        const configData = {
            timestamp: new Date().toISOString(),
            state: this.state
        };

        const dataStr = JSON.stringify(configData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `vpe_config_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showInfo('Configuration exported successfully');
    }

    importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const configData = JSON.parse(text);

                    if (configData.state) {
                        this.state = { ...this.state, ...configData.state };
                        this.updateUI();
                        this.saveState();
                        this.showInfo('Configuration imported successfully');
                    } else {
                        this.showError('Invalid configuration file format');
                    }
                } catch (error) {
                    this.showError('Failed to import configuration: ' + error.message);
                }
            }
        };

        input.click();
    }

    showHistory() {
        const historyContainer = document.getElementById('history-container');
        if (historyContainer) {
            historyContainer.innerHTML = '';

            if (this.state.history.length === 0) {
                historyContainer.innerHTML = '<p class="text-muted">No generation history available.</p>';
                return;
            }

            this.state.history.forEach(entry => {
                const historyItem = document.createElement('div');
                historyItem.className = 'card mb-3';
                historyItem.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">${new Date(entry.timestamp).toLocaleString()}</h6>
                        <p class="card-text"><strong>Prompt:</strong> ${entry.prompt}</p>
                        <button class="btn btn-sm btn-primary" onclick="window.vpeClient.loadHistoryEntry('${entry.id}')">
                            <i class="fas fa-redo"></i> Use This
                        </button>
                    </div>
                `;
                historyContainer.appendChild(historyItem);
            });
        }
    }

    loadHistoryEntry(id) {
        const entry = this.state.history.find(h => h.id === id);
        if (entry) {
            this.state.prompt = entry.prompt;
            this.state.cfgScale = entry.settings.cfg_scale;
            this.state.steps = entry.settings.steps;
            this.state.sampler = entry.settings.sampler;
            this.state.aspectRatio = entry.settings.aspect_ratio;
            this.updateUI();
            this.showInfo('History entry loaded');
        }
    }

    setupAdditionalEventListeners() {
        // Template buttons
        const applyTemplateBtn = document.getElementById('apply-template');
        applyTemplateBtn?.addEventListener('click', () => {
            this.templateManager?.applySelectedTemplate();
        });

        // Style buttons
        const applyStyleBtn = document.getElementById('apply-style');
        applyStyleBtn?.addEventListener('click', () => {
            this.styleManager?.applySelectedStyle();
        });

        // Style button clicks
        const styleButtons = document.querySelectorAll('.style-btn');
        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.styleManager?.selectStyle(btn.dataset.style);
            });
        });

        // Template select
        const templateSelect = document.getElementById('template-select');
        templateSelect?.addEventListener('change', (e) => {
            this.templateManager?.selectTemplate(e.target.value);
        });

        // History buttons
        const historyBtn = document.getElementById('history');
        historyBtn?.addEventListener('click', () => {
            this.historyManager?.showHistory();
        });

        const clearHistoryBtn = document.getElementById('clear-history');
        clearHistoryBtn?.addEventListener('click', () => {
            this.historyManager?.clearHistory();
        });

        // Export/Import buttons
        const exportAllBtn = document.getElementById('export-all');
        exportAllBtn?.addEventListener('click', () => {
            this.exportImportManager?.exportAll();
        });

        const importAllBtn = document.getElementById('import-all');
        importAllBtn?.addEventListener('click', () => {
            this.exportImportManager?.importAll();
        });

        // Random seed button
        const randomSeedBtn = document.getElementById('random-seed');
        randomSeedBtn?.addEventListener('click', () => {
            this.generateRandomSeed();
        });

        // Clear button
        const clearBtn = document.getElementById('clear');
        clearBtn?.addEventListener('click', () => {
            this.clearAll();
        });

        // Save/Load buttons
        const saveBtn = document.getElementById('save');
        saveBtn?.addEventListener('click', () => {
            this.saveCurrentConfig();
        });

        const loadBtn = document.getElementById('load');
        loadBtn?.addEventListener('click', () => {
            this.loadConfigFromStorage();
        });

        // Export/Import buttons
        const exportBtn = document.getElementById('export');
        exportBtn?.addEventListener('click', () => {
            this.exportConfig();
        });

        const importBtn = document.getElementById('import');
        importBtn?.addEventListener('click', () => {
            this.importConfig();
        });
    }

    generateRandomSeed() {
        const randomSeed = Math.floor(Math.random() * 4294967295);
        this.state.seed = randomSeed.toString();
        this.updateUI();
        this.saveState();
        this.showInfo(`Random seed generated: ${randomSeed}`);
    }

    reRender() {
        if (!this.state.prompt.trim()) {
            this.showError('No prompt to re-render');
            return;
        }
        this.generateImage();
    }

    toggleQuality() {
        const qualities = ['Low', 'Medium', 'High', 'Ultra'];
        const currentIndex = qualities.indexOf(this.state.quality);
        const nextIndex = (currentIndex + 1) % qualities.length;
        this.state.quality = qualities[nextIndex];
        this.applyQualitySettings();
        this.showInfo(`Quality: ${this.state.quality}`);
    }

    toggleBatchMode() {
        this.state.batchMode = !this.state.batchMode;
        this.updateBatchUI();
        this.saveState();
        this.showInfo(`Batch mode: ${this.state.batchMode ? 'ON' : 'OFF'}`);
    }

    toggleTemplateMode() {
        const templatePanel = document.getElementById('template-panel');
        if (templatePanel) {
            const isVisible = templatePanel.style.display !== 'none';
            templatePanel.style.display = isVisible ? 'none' : 'block';
        }
    }

    toggleStyleMode() {
        const stylePanel = document.getElementById('style-panel');
        if (stylePanel) {
            const isVisible = stylePanel.style.display !== 'none';
            stylePanel.style.display = isVisible ? 'none' : 'block';
        }
    }

    clearReferenceImage() {
        this.state.referenceImage = null;
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.innerHTML = '';
        }
        this.showInfo('Reference image cleared');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vpeClient = new VPEClient();

    // Initialize additional modules
    window.vpeClient.templateManager = new TemplateManager(window.vpeClient);
    window.vpeClient.styleManager = new StyleManager(window.vpeClient);
    window.vpeClient.historyManager = new HistoryManager(window.vpeClient);
    window.vpeClient.exportImportManager = new ExportImportManager(window.vpeClient);
    window.vpeClient.eventHandlers = new EventHandlers(window.vpeClient);

    // Setup additional event listeners
    window.vpeClient.setupAdditionalEventListeners();

    // Register global action handlers for action-buttons.js
    window.uiActionHandlers = {
        resetAll: () => window.vpeClient.clearAll(),
        translateScene: async () => {
            const prompt = window.vpeClient.state.prompt;
            if (!prompt.trim()) return window.vpeClient.showError('No prompt to translate');
            try {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: prompt, to: 'en' })
                });
                const data = await res.json();
                if (data.text) {
                    window.vpeClient.state.prompt = data.text;
                    window.vpeClient.updateUI();
                    window.vpeClient.saveState();
                    window.vpeClient.showInfo('Prompt translated to English');
                }
            } catch (err) {
                window.vpeClient.showError('Translation failed: ' + err.message);
            }
        },
        enhancePrompt: async () => {
            const prompt = window.vpeClient.state.prompt;
            if (!prompt.trim()) return window.vpeClient.showError('No prompt to enhance');
            try {
                const res = await fetch('/api/enhance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: prompt })
                });
                const data = await res.json();
                if (data.text) {
                    window.vpeClient.state.prompt = data.text;
                    window.vpeClient.updateUI();
                    window.vpeClient.saveState();
                    window.vpeClient.showInfo('Prompt enhanced');
                }
            } catch (err) {
                window.vpeClient.showError('Enhancement failed: ' + err.message);
            }
        },
        setPromptFormat: (format) => {
            window.vpeClient.state.promptFormat = format;
            window.vpeClient.saveState();
            // Highlight active format button
            document.querySelectorAll('[data-format]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.format === format);
            });
            window.vpeClient.showInfo(`Prompt format: ${format}`);
        }
    };
});
