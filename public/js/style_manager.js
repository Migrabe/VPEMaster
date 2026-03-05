// Style Manager Module for VPE Thin UI
// Handles style presets functionality

class StyleManager {
    constructor(client) {
        this.client = client;
        this.currentStyle = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedStyle();
    }

    setupEventListeners() {
        // Apply style button
        const applyStyleBtn = document.getElementById('apply-style');
        applyStyleBtn?.addEventListener('click', () => {
            this.applySelectedStyle();
        });

        // Style buttons
        const styleButtons = document.querySelectorAll('.style-btn');
        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectStyle(btn.dataset.style);
            });
        });

        // Style select (if exists)
        const styleSelect = document.getElementById('style-select');
        styleSelect?.addEventListener('change', (e) => {
            this.selectStyle(e.target.value);
        });
    }

    loadSavedStyle() {
        try {
            const savedStyle = localStorage.getItem('vpe_current_style');
            if (savedStyle) {
                this.selectStyle(savedStyle);
            } else {
                // Default to first available style
                if (this.client.config.styles && this.client.config.styles.length > 0) {
                    this.selectStyle(this.client.config.styles[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to load saved style:', error);
        }
    }

    saveCurrentStyle() {
        try {
            localStorage.setItem('vpe_current_style', this.currentStyle?.id || '');
        } catch (error) {
            console.error('Failed to save current style:', error);
        }
    }

    selectStyle(styleId) {
        if (!styleId) {
            this.currentStyle = null;
            this.client.showInfo('Style cleared');
            this.updateStyleUI();
            return;
        }

        const style = this.client.config.styles?.find(s => s.id === styleId);

        if (style) {
            this.currentStyle = style;
            this.saveCurrentStyle();
            this.updateStyleUI();
            this.client.showInfo(`Style selected: ${style.name}`);
        } else {
            this.client.showError('Style not found');
        }
    }

    updateStyleUI() {
        // Update style buttons
        const styleButtons = document.querySelectorAll('.style-btn');
        styleButtons.forEach(btn => {
            if (this.currentStyle && btn.dataset.style === this.currentStyle.id) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline-primary');
            } else {
                btn.classList.add('btn-outline-primary');
                btn.classList.remove('btn-primary');
            }
        });

        // Update style select if exists
        const styleSelect = document.getElementById('style-select');
        if (styleSelect && this.currentStyle) {
            styleSelect.value = this.currentStyle.id;
        }

        // Update style info display
        const styleInfo = document.getElementById('style-info');
        if (styleInfo && this.currentStyle) {
            styleInfo.innerHTML = `
                <div class="alert alert-info">
                    <strong>Current Style:</strong> ${this.currentStyle.name}<br>
                    <small>${this.currentStyle.description}</small>
                </div>
            `;
        }
    }

    applySelectedStyle() {
        if (!this.currentStyle) {
            this.client.showError('Please select a style first');
            return;
        }

        // Apply style to current prompt
        const currentPrompt = this.client.state.prompt;
        const styledPrompt = this.applyStyleToPrompt(this.currentStyle, currentPrompt);

        // Update client state
        this.client.state.prompt = styledPrompt;
        this.client.updateUI();
        this.client.saveState();

        this.client.showInfo(`Style "${this.currentStyle.name}" applied`);
    }

    applyStyleToPrompt(style, currentPrompt) {
        let prompt = currentPrompt;

        // Add style suffix if it exists
        if (style.prompt_suffix) {
            // Remove any existing style suffixes first
            prompt = this.removeExistingStyleSuffixes(prompt);

            // Add the new style suffix
            if (!prompt.endsWith(style.prompt_suffix)) {
                prompt = prompt.trim();
                if (!prompt.endsWith(',')) {
                    prompt += ',';
                }
                prompt += ` ${style.prompt_suffix}`;
            }
        }

        // Apply negative prompt if style has one
        if (style.negative_prompt) {
            this.client.state.negativePrompt = style.negative_prompt;
        }

        // Apply settings if style has them
        if (style.cfg_scale) this.client.state.cfgScale = style.cfg_scale;
        if (style.steps) this.client.state.steps = style.steps;
        if (style.sampler) this.client.state.sampler = style.sampler;

        return prompt;
    }

    removeExistingStyleSuffixes(prompt) {
        // Common style-related terms to remove
        const styleTerms = [
            'ultra realistic', '8k resolution', 'professional photography', 'detailed textures', 'natural lighting',
            'anime style', 'vibrant colors', 'cel shading', 'digital painting', 'artistic', 'brush strokes',
            'concept art', 'highly detailed', 'professional', 'dramatic lighting', 'epic composition',
            'cinematic lighting', 'dramatic atmosphere', 'movie still', 'film grain', 'depth of field',
            'portrait photography', 'professional lighting', 'shallow depth of field', 'sharp focus',
            'landscape photography', 'wide angle', 'epic scenery', 'breathtaking landscape',
            'sci-fi', 'futuristic technology', 'neon lighting', 'cyberpunk elements',
            'fantasy art', 'magical atmosphere',
            'minimalist design', 'simple composition', 'clean lines', 'limited color palette',
            'vintage style', 'retro aesthetic', 'aged film', 'nostalgic atmosphere', 'warm tones',
            'cyberpunk city', 'neon lights', 'futuristic architecture', 'rain', 'night time',
            'gothic style', 'dark atmosphere', 'mysterious',
            'surreal art', 'dreamlike atmosphere', 'impossible geometry',
            'pixel art', '8-bit style', 'retro video game', 'blocky pixels'
        ];

        // Remove style terms anywhere in the comma-separated list (not just at the end)
        let cleanedPrompt = prompt;
        styleTerms.forEach(term => {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Match: ", term" or "term, " or "term" at end
            cleanedPrompt = cleanedPrompt.replace(new RegExp(`,\\s*${escaped}\\s*(?=,|$)`, 'gi'), '');
            cleanedPrompt = cleanedPrompt.replace(new RegExp(`^\\s*${escaped}\\s*,\\s*`, 'gi'), '');
            cleanedPrompt = cleanedPrompt.replace(new RegExp(`^\\s*${escaped}\\s*$`, 'gi'), '');
        });

        // Clean up double commas and trailing commas
        cleanedPrompt = cleanedPrompt.replace(/,\s*,/g, ',').replace(/,\s*$/, '').replace(/^\s*,\s*/, '');

        return cleanedPrompt.trim();
    }

    getAvailableStyles() {
        return this.client.config.styles || [];
    }

    getStyleById(styleId) {
        return this.client.config.styles?.find(s => s.id === styleId);
    }

    createCustomStyle() {
        const name = prompt('Enter a name for this custom style:', 'Custom Style');
        if (!name) return;

        const description = prompt('Enter a description for this style:', 'A custom style');
        const promptSuffix = prompt('Enter the style suffix to add to prompts:', 'highly detailed, professional quality');
        const negativePrompt = prompt('Enter negative prompt (optional):', '');
        const cfgScale = parseFloat(prompt('Enter CFG Scale (6-10):', '7'));
        const steps = parseInt(prompt('Enter Steps (20-50):', '28'));
        const sampler = prompt('Enter Sampler (Euler, DPM++, etc.):', 'Euler a');

        const customStyle = {
            id: 'custom_' + Date.now(),
            name: name,
            description: description,
            prompt_suffix: promptSuffix,
            negative_prompt: negativePrompt || undefined,
            cfg_scale: cfgScale,
            steps: steps,
            sampler: sampler
        };

        // Add to client config
        if (!this.client.config.styles) {
            this.client.config.styles = [];
        }
        this.client.config.styles.push(customStyle);

        // Select the new style
        this.selectStyle(customStyle.id);

        this.client.showInfo(`Custom style "${name}" created and applied`);
    }

    removeCustomStyle(styleId) {
        if (!styleId.startsWith('custom_')) {
            this.client.showError('Cannot remove system styles');
            return;
        }

        const style = this.getStyleById(styleId);
        if (!style) {
            this.client.showError('Style not found');
            return;
        }

        const confirmed = confirm(`Are you sure you want to delete the style "${style.name}"?`);
        if (!confirmed) return;

        this.client.config.styles = this.client.config.styles.filter(s => s.id !== styleId);

        // If current style was deleted, select first available style
        if (this.currentStyle && this.currentStyle.id === styleId) {
            if (this.client.config.styles.length > 0) {
                this.selectStyle(this.client.config.styles[0].id);
            } else {
                this.selectStyle(null);
            }
        }

        this.client.showInfo(`Style "${style.name}" deleted`);
    }

    exportStyles() {
        const stylesData = {
            timestamp: new Date().toISOString(),
            styles: this.client.config.styles || []
        };

        const dataStr = JSON.stringify(stylesData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `vpe_styles_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.client.showInfo('Styles exported successfully');
    }

    importStyles() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    const stylesData = JSON.parse(text);

                    if (stylesData.styles && Array.isArray(stylesData.styles)) {
                        // Merge styles, avoiding duplicates
                        const existingStyleIds = new Set((this.client.config.styles || []).map(s => s.id));
                        const newStyles = stylesData.styles.filter(s => !existingStyleIds.has(s.id));

                        if (newStyles.length > 0) {
                            this.client.config.styles = [...(this.client.config.styles || []), ...newStyles];
                            this.client.showInfo(`Imported ${newStyles.length} styles`);
                        } else {
                            this.client.showInfo('No new styles to import');
                        }
                    } else {
                        this.client.showError('Invalid styles file format');
                    }
                } catch (error) {
                    this.client.showError('Failed to import styles: ' + error.message);
                }
            }
        };

        input.click();
    }

    getStyleRecommendations() {
        const currentPrompt = this.client.state.prompt.toLowerCase();
        const recommendations = [];

        if (this.client.config.styles) {
            this.client.config.styles.forEach(style => {
                // Simple keyword matching for recommendations
                const keywords = {
                    'photography': ['photo', 'camera', 'lens', 'portrait', 'landscape'],
                    'anime': ['anime', 'manga', 'cartoon', 'character'],
                    'digital art': ['digital', 'painting', 'art', 'illustration'],
                    'concept art': ['concept', 'game', 'movie', 'character', 'environment'],
                    'cinematic': ['movie', 'film', 'cinema', 'scene'],
                    'portrait': ['portrait', 'face', 'person', 'character'],
                    'landscape': ['landscape', 'nature', 'scenery', 'outdoor'],
                    'sci-fi': ['sci-fi', 'science fiction', 'futuristic', 'space', 'robot'],
                    'fantasy': ['fantasy', 'magic', 'dragon', 'wizard', 'medieval'],
                    'minimalist': ['minimal', 'simple', 'clean', 'geometric'],
                    'vintage': ['vintage', 'retro', 'old', 'classic', 'antique'],
                    'cyberpunk': ['cyberpunk', 'neon', 'futuristic', 'city', 'tech'],
                    'gothic': ['gothic', 'dark', 'horror', 'mysterious'],
                    'surreal': ['surreal', 'dream', 'abstract', 'unreal'],
                    'pixel art': ['pixel', '8-bit', 'retro', 'game']
                };

                const styleKeywords = keywords[style.name.toLowerCase()];
                if (styleKeywords) {
                    const matches = styleKeywords.filter(keyword => currentPrompt.includes(keyword));
                    if (matches.length > 0) {
                        recommendations.push({
                            style: style,
                            matches: matches,
                            score: matches.length
                        });
                    }
                }
            });
        }

        // Sort by score and return top 3
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(r => r.style);
    }

    showStyleRecommendations() {
        const recommendations = this.getStyleRecommendations();

        if (recommendations.length === 0) {
            this.client.showInfo('No style recommendations available for current prompt');
            return;
        }

        const recommendationsContainer = document.getElementById('style-recommendations');
        if (recommendationsContainer) {
            recommendationsContainer.innerHTML = '';

            recommendations.forEach(style => {
                const card = document.createElement('div');
                card.className = 'card mb-2';
                card.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">${style.name}</h6>
                        <p class="card-text">${style.description}</p>
                        <button class="btn btn-sm btn-primary" onclick="window.vpeClient.styleManager.selectStyle('${style.id}')">
                            <i class="fas fa-palette"></i> Apply
                        </button>
                    </div>
                `;
                recommendationsContainer.appendChild(card);
            });
        }
    }
}

// Export for use in main client
window.StyleManager = StyleManager;