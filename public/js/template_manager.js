// Template Manager Module for VPE Thin UI
// Handles prompt templates functionality

class TemplateManager {
    constructor(client) {
        this.client = client;
        this.currentTemplate = null;
        this.userTemplates = [];
        this.init();
    }

    init() {
        this.loadUserTemplates();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Apply template button
        const applyTemplateBtn = document.getElementById('apply-template');
        applyTemplateBtn?.addEventListener('click', () => {
            this.applySelectedTemplate();
        });

        // Template select change
        const templateSelect = document.getElementById('template-select');
        templateSelect?.addEventListener('change', (e) => {
            this.selectTemplate(e.target.value);
        });

        // Save template button
        const saveTemplateBtn = document.getElementById('save-template');
        saveTemplateBtn?.addEventListener('click', () => {
            this.saveUserTemplate();
        });

        // Delete template button
        const deleteTemplateBtn = document.getElementById('delete-template');
        deleteTemplateBtn?.addEventListener('click', () => {
            this.deleteUserTemplate();
        });
    }

    loadUserTemplates() {
        try {
            const saved = localStorage.getItem('vpe_user_templates');
            if (saved) {
                this.userTemplates = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load user templates:', error);
        }
    }

    saveUserTemplates() {
        try {
            localStorage.setItem('vpe_user_templates', JSON.stringify(this.userTemplates));
        } catch (error) {
            console.error('Failed to save user templates:', error);
        }
    }

    selectTemplate(templateId) {
        if (!templateId) {
            this.currentTemplate = null;
            this.client.showInfo('Template cleared');
            return;
        }

        // Check user templates first
        let template = this.userTemplates.find(t => t.id === templateId);

        // If not found, check system templates
        if (!template && this.client.config.templates) {
            template = this.client.config.templates.find(t => t.id === templateId);
        }

        if (template) {
            this.currentTemplate = template;
            this.client.showInfo(`Template selected: ${template.name}`);
        } else {
            this.client.showError('Template not found');
        }
    }

    applySelectedTemplate() {
        if (!this.currentTemplate) {
            this.client.showError('Please select a template first');
            return;
        }

        // Get current prompt
        const currentPrompt = this.client.state.prompt;

        // Apply template
        const appliedPrompt = this.applyTemplateToPrompt(this.currentTemplate, currentPrompt);

        // Update client state
        this.client.state.prompt = appliedPrompt;
        this.client.updateUI();
        this.client.saveState();

        this.client.showInfo(`Template "${this.currentTemplate.name}" applied`);
    }

    applyTemplateToPrompt(template, currentPrompt) {
        let prompt = template.prompt || '';

        // Replace placeholders with current values or defaults
        prompt = prompt.replace(/{subject}/g, this.extractSubject(currentPrompt) || 'subject');
        prompt = prompt.replace(/{style}/g, this.client.state.stylePreset || 'detailed');
        prompt = prompt.replace(/{lighting}/g, this.getLighting() || 'soft lighting');
        prompt = prompt.replace(/{camera}/g, this.getCamera() || 'DSLR');
        prompt = prompt.replace(/{lens}/g, this.getLens() || '50mm');
        prompt = prompt.replace(/{film_type}/g, this.getFilmType() || 'color film');
        prompt = prompt.replace(/{mood}/g, this.getMood() || 'epic');
        prompt = prompt.replace(/{time_of_day}/g, this.getTimeOfDay() || 'golden hour');
        prompt = prompt.replace(/{weather}/g, this.getWeather() || 'clear');
        prompt = prompt.replace(/{camera_angle}/g, this.getCameraAngle() || 'eye level');
        prompt = prompt.replace(/{film_grain}/g, this.getFilmGrain() || 'subtle film grain');
        prompt = prompt.replace(/{art_style}/g, this.getArtStyle() || 'digital painting');
        prompt = prompt.replace(/{color_palette}/g, this.getColorPalette() || 'vibrant colors');
        prompt = prompt.replace(/{background}/g, this.getBackground() || 'detailed background');
        prompt = prompt.replace(/{brush_style}/g, this.getBrushStyle() || 'smooth brush strokes');
        prompt = prompt.replace(/{medium}/g, this.getMedium() || 'digital');
        prompt = prompt.replace(/{time_period}/g, this.getTimePeriod() || 'modern');
        prompt = prompt.replace(/{technology_level}/g, this.getTechnologyLevel() || 'futuristic');
        prompt = prompt.replace(/{setting}/g, this.getSetting() || 'urban environment');
        prompt = prompt.replace(/{magic_level}/g, this.getMagicLevel() || 'high magic');
        prompt = prompt.replace(/{color_scheme}/g, this.getColorScheme() || 'monochrome');
        prompt = prompt.replace(/{composition}/g, this.getComposition() || 'rule of thirds');
        prompt = prompt.replace(/{effects}/g, this.getEffects() || 'vintage effects');
        prompt = prompt.replace(/{expression}/g, this.getExpression() || 'natural expression');
        prompt = prompt.replace(/{pose}/g, this.getPose() || 'natural pose');
        prompt = prompt.replace(/{season}/g, this.getSeason() || 'summer');
        prompt = prompt.replace(/{perspective}/g, this.getPerspective() || 'eye level perspective');
        prompt = prompt.replace(/{neon_colors}/g, this.getNeonColors() || 'neon blue and pink');
        prompt = prompt.replace(/{environment}/g, this.getEnvironment() || 'detailed environment');

        // Add negative prompt if template has one
        if (template.negative_prompt) {
            this.client.state.negativePrompt = template.negative_prompt;
        }

        // Apply settings if template has them
        if (template.settings) {
            this.applyTemplateSettings(template.settings);
        }

        return prompt;
    }

    applyTemplateSettings(settings) {
        if (settings.cfg_scale) this.client.state.cfgScale = settings.cfg_scale;
        if (settings.steps) this.client.state.steps = settings.steps;
        if (settings.sampler) this.client.state.sampler = settings.sampler;
        if (settings.quality) this.client.state.quality = settings.quality;

        this.client.updateUI();
    }

    // Helper methods to extract and generate values
    extractSubject(prompt) {
        // Simple heuristic to extract subject from prompt
        const subjectMatch = prompt.match(/(a|an|the)?\s*([A-Za-z\s]+?)(?:,|\s+(?:in|with|and|using)|$)/);
        return subjectMatch ? subjectMatch[2].trim() : null;
    }

    getLighting() {
        const options = ['soft lighting', 'dramatic lighting', 'natural lighting', 'studio lighting', 'rim lighting'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getCamera() {
        const options = ['DSLR', 'mirrorless', 'film camera', 'smartphone', 'professional camera'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getLens() {
        const options = ['50mm', '85mm', '24-70mm', '35mm', '70-200mm'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getFilmType() {
        const options = ['color film', 'black and white film', 'Kodak Portra', 'Fuji Velvia', 'Ilford HP5'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getMood() {
        const options = ['epic', 'serene', 'mysterious', 'dramatic', 'joyful', 'melancholic'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getTimeOfDay() {
        const options = ['golden hour', 'blue hour', 'midday', 'dawn', 'dusk', 'night'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getWeather() {
        const options = ['clear', 'cloudy', 'rainy', 'foggy', 'stormy', 'snowy'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getCameraAngle() {
        const options = ['eye level', 'bird\'s eye view', 'worm\'s eye view', 'Dutch angle', 'over the shoulder'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getFilmGrain() {
        const options = ['subtle film grain', 'heavy film grain', 'no film grain', 'vintage grain'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getArtStyle() {
        const options = ['digital painting', 'oil painting', 'watercolor', 'pencil sketch', 'ink drawing'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getColorPalette() {
        const options = ['vibrant colors', 'muted colors', 'pastel colors', 'monochrome', 'high contrast'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getBackground() {
        const options = ['detailed background', 'blurred background', 'simple background', 'gradient background'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getBrushStyle() {
        const options = ['smooth brush strokes', 'impasto technique', 'dry brush', 'wet brush'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getMedium() {
        const options = ['digital', 'oil on canvas', 'acrylic', 'watercolor', 'charcoal'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getTimePeriod() {
        const options = ['modern', 'victorian', 'medieval', 'futuristic', 'retro'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getTechnologyLevel() {
        const options = ['futuristic', 'cyberpunk', 'steampunk', 'retro-futuristic', 'high tech'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getSetting() {
        const options = ['urban environment', 'natural landscape', 'industrial setting', 'futuristic city', 'fantasy world'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getMagicLevel() {
        const options = ['high magic', 'low magic', 'no magic', 'ancient magic', 'dark magic'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getColorScheme() {
        const options = ['monochrome', 'complementary', 'analogous', 'triadic', 'split-complementary'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getComposition() {
        const options = ['rule of thirds', 'symmetrical', 'asymmetrical', 'leading lines', 'framing'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getEffects() {
        const options = ['vintage effects', 'glitch effects', 'light leaks', 'bokeh', 'motion blur'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getExpression() {
        const options = ['natural expression', 'smiling', 'serious', 'thoughtful', 'confident', 'peaceful'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getPose() {
        const options = ['natural pose', 'dynamic pose', 'relaxed pose', 'formal pose', 'candid', 'action pose'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getSeason() {
        const options = ['spring', 'summer', 'autumn', 'winter'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getPerspective() {
        const options = ['eye level perspective', 'aerial view', 'panoramic view', 'wide angle', 'close-up', 'macro'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getNeonColors() {
        const options = ['neon blue and pink', 'neon green and purple', 'neon red and cyan', 'neon orange and blue', 'neon yellow and magenta'];
        return options[Math.floor(Math.random() * options.length)];
    }

    getEnvironment() {
        const options = ['detailed environment', 'urban cityscape', 'lush forest', 'desert landscape', 'underwater scene', 'space station'];
        return options[Math.floor(Math.random() * options.length)];
    }

    saveUserTemplate() {
        const name = prompt('Enter a name for this template:', 'My Template');
        if (!name) return;

        const template = {
            id: 'user_' + Date.now(),
            name: name,
            description: 'User-created template',
            prompt: this.client.state.prompt,
            negative_prompt: this.client.state.negativePrompt,
            settings: {
                cfg_scale: this.client.state.cfgScale,
                steps: this.client.state.steps,
                sampler: this.client.state.sampler,
                quality: this.client.state.quality
            }
        };

        this.userTemplates.push(template);
        this.saveUserTemplates();

        // Update template select dropdown
        this.updateTemplateSelect();

        this.client.showInfo(`Template "${name}" saved`);
    }

    deleteUserTemplate() {
        const templateSelect = document.getElementById('template-select');
        const selectedValue = templateSelect?.value;

        if (!selectedValue || !selectedValue.startsWith('user_')) {
            this.client.showError('Please select a user template to delete');
            return;
        }

        const confirmed = confirm('Are you sure you want to delete this template?');
        if (!confirmed) return;

        this.userTemplates = this.userTemplates.filter(t => t.id !== selectedValue);
        this.saveUserTemplates();

        // Update template select dropdown
        this.updateTemplateSelect();

        this.client.showInfo('Template deleted');
    }

    updateTemplateSelect() {
        const templateSelect = document.getElementById('template-select');
        if (!templateSelect) return;

        // Save current selection
        const currentSelection = templateSelect.value;

        // Clear and rebuild options
        templateSelect.innerHTML = '<option value="">Select Template</option>';

        // Add system templates
        if (this.client.config.templates) {
            this.client.config.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                templateSelect.appendChild(option);
            });
        }

        // Add user templates
        this.userTemplates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = `${template.name} (User)`;
            templateSelect.appendChild(option);
        });

        // Restore selection if possible
        if (currentSelection && templateSelect.querySelector(`option[value="${currentSelection}"]`)) {
            templateSelect.value = currentSelection;
        }
    }

    getAvailableTemplates() {
        const systemTemplates = this.client.config.templates || [];
        return [...systemTemplates, ...this.userTemplates];
    }

    createTemplateFromCurrent() {
        const name = prompt('Enter a name for this template:', 'Current Settings');
        if (!name) return;

        const template = {
            id: 'user_' + Date.now(),
            name: name,
            description: 'Template created from current settings',
            prompt: this.client.state.prompt,
            negative_prompt: this.client.state.negativePrompt,
            settings: {
                cfg_scale: this.client.state.cfgScale,
                steps: this.client.state.steps,
                sampler: this.client.state.sampler,
                quality: this.client.state.quality
            }
        };

        this.userTemplates.push(template);
        this.saveUserTemplates();

        this.updateTemplateSelect();
        this.selectTemplate(template.id);

        this.client.showInfo(`Template "${name}" created from current settings`);
    }
}

// Export for use in main client
window.TemplateManager = TemplateManager;