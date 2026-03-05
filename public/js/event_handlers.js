// Event Handlers Module for VPE Thin UI
// Handles all user interactions and UI events

class EventHandlers {
    constructor(client) {
        this.client = client;
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupKeyboardShortcuts();
        this.setupDragAndDrop();
        this.setupResponsiveHandlers();
    }

    setupGlobalEventListeners() {
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Before unload handler
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });

        // Online/offline handlers
        window.addEventListener('online', () => {
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatusChange(false);
        });

        // Focus/blur handlers
        window.addEventListener('focus', () => {
            this.handleWindowFocus();
        });

        window.addEventListener('blur', () => {
            this.handleWindowBlur();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent shortcuts when typing in inputs
            if (this.isTypingInInput(e.target)) return;

            // Global shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'enter':
                        e.preventDefault();
                        this.client.generateImage();
                        break;
                    case 's':
                        e.preventDefault();
                        this.client.saveCurrentConfig();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.client.loadConfigFromStorage();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.client.exportConfig();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.client.importConfig();
                        break;
                    case 'z':
                        e.preventDefault();
                        this.client.clearAll();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.client.showHistory();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.client.reRender();
                        break;
                    case 'q':
                        e.preventDefault();
                        this.client.toggleQuality();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.client.toggleBatchMode();
                        break;
                    case 't':
                        e.preventDefault();
                        this.client.toggleTemplateMode();
                        break;
                    case 'y':
                        e.preventDefault();
                        this.client.toggleStyleMode();
                        break;
                }
            }

            // Function key shortcuts
            switch (e.key) {
                case 'F5':
                    e.preventDefault();
                    this.client.generateImage();
                    break;
                case 'F6':
                    e.preventDefault();
                    this.client.stopGeneration();
                    break;
                case 'F7':
                    e.preventDefault();
                    this.client.clearAll();
                    break;
                case 'F8':
                    e.preventDefault();
                    this.client.showHistory();
                    break;
                case 'F9':
                    e.preventDefault();
                    this.client.toggleQuality();
                    break;
                case 'F10':
                    e.preventDefault();
                    this.client.toggleBatchMode();
                    break;
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'F12':
                    e.preventDefault();
                    this.openDevTools();
                    break;
            }
        });
    }

    setupDragAndDrop() {
        const dropZone = document.body;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop zone when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.unhighlight, false);
        });

        // Handle dropped files
        dropZone.addEventListener('drop', this.handleDrop.bind(this), false);
    }

    setupResponsiveHandlers() {
        // Handle mobile-specific interactions
        if (this.isMobileDevice()) {
            this.setupMobileHandlers();
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        document.body.classList.add('drag-over');
    }

    unhighlight(e) {
        document.body.classList.remove('drag-over');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            this.handleFileDrop(files[0]);
        }
    }

    handleFileDrop(file) {
        if (file.type.startsWith('image/')) {
            this.handleImageDrop(file);
        } else if (file.name.endsWith('.json')) {
            this.handleConfigDrop(file);
        } else {
            this.client.showError('Unsupported file type. Please drop an image or JSON configuration file.');
        }
    }

    handleImageDrop(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            this.client.showInfo('Image dropped. You can use this as a reference for your prompt.');

            // Store the image for potential use in generation
            this.client.state.referenceImage = imageData;

            // Show the dropped image in a preview area if it exists
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h6>Reference Image</h6>
                            <img src="${imageData}" class="img-fluid" alt="Reference image">
                            <button class="btn btn-sm btn-outline-danger mt-2" onclick="window.vpeClient.clearReferenceImage()">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
            }
        };
        reader.onerror = () => {
            this.client.showError('Failed to read image file');
        };
        reader.readAsDataURL(file);
    }

    handleConfigDrop(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const configData = JSON.parse(e.target.result);
                if (configData.settings) {
                    this.client.state = { ...this.client.state, ...configData.settings };
                    this.client.updateUI();
                    this.client.saveState();
                    this.client.showInfo('Configuration loaded from dropped file');
                } else {
                    this.client.showError('Invalid configuration file format');
                }
            } catch (error) {
                this.client.showError('Failed to load configuration from file: ' + error.message);
            }
        };
        reader.onerror = () => {
            this.client.showError('Failed to read configuration file');
        };
        reader.readAsText(file);
    }

    isTypingInInput(target) {
        const tagName = target.tagName.toLowerCase();
        const type = target.type;

        return (tagName === 'input' && type !== 'checkbox' && type !== 'radio') ||
            tagName === 'textarea' ||
            target.isContentEditable;
    }

    handleWindowResize() {
        // Update UI layout for responsive design
        const container = document.querySelector('.container');
        if (container) {
            const width = window.innerWidth;
            if (width < 768) {
                container.classList.remove('container-lg');
                container.classList.add('container-fluid');
            } else {
                container.classList.remove('container-fluid');
                container.classList.add('container-lg');
            }
        }
    }

    handleBeforeUnload(e) {
        if (this.client.isGenerating) {
            e.preventDefault();
            e.returnValue = 'Generation is in progress. Are you sure you want to leave?';
        }
    }

    handleOnlineStatusChange(isOnline) {
        if (isOnline) {
            this.client.showInfo('Connection restored');
        } else {
            this.client.showError('Connection lost. Please check your internet connection.');
        }
    }

    handleWindowFocus() {
        // Resume any paused operations
        if (this.client.isGenerating) {
            this.client.showInfo('Window focused - generation continues');
        }
    }

    handleWindowBlur() {
        // Pause or warn about generation when window loses focus
        if (this.client.isGenerating) {
            this.client.showInfo('Window unfocused - generation continues in background');
        }
    }

    setupMobileHandlers() {
        // Touch-friendly event handlers for mobile devices
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                btn.classList.add('active');
            }, { passive: true });

            btn.addEventListener('touchend', (e) => {
                btn.classList.remove('active');
            }, { passive: true });
        });

        // Handle mobile keyboard show/hide
        const viewportHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            const newHeight = window.innerHeight;
            if (Math.abs(viewportHeight - newHeight) > 100) {
                // Keyboard likely opened/closed
                this.handleMobileKeyboard(newHeight < viewportHeight);
            }
        });
    }

    handleMobileKeyboard(isOpen) {
        if (isOpen) {
            // Adjust UI for mobile keyboard
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.position = 'static';
            }
        } else {
            // Restore normal UI
            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.position = 'fixed';
            }
        }
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.client.showError(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    openDevTools() {
        // This is mainly for development purposes
        if (window.devTools) {
            window.devTools.open();
        } else {
            this.client.showInfo('Developer tools not available in this environment');
        }
    }

    // Utility methods for common UI interactions
    showTooltip(element, text) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip fade show';
        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = 1000;
        tooltip.style.pointerEvents = 'none';
        tooltip.innerHTML = `<div class="tooltip-inner">${text}</div>`;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 30}px`;

        document.body.appendChild(tooltip);

        // Remove after delay
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    showLoadingSpinner(element) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner-border spinner-border-sm';
        spinner.style.marginRight = '5px';

        element.prepend(spinner);
        return spinner;
    }

    hideLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    animateElement(element, animation) {
        element.classList.add('animate__animated', `animate__${animation}`);
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', `animate__${animation}`);
        });
    }

    scrollToElement(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // Accessibility handlers
    setupAccessibility() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Handle focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        // Ensure logical tab order and focus trapping in modals
        const activeElement = document.activeElement;
        const modal = document.querySelector('.modal.show');

        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor generation performance
        let startTime = 0;

        this.client.ws?.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'generation_started') {
                startTime = performance.now();
            } else if (message.type === 'generation_completed') {
                const endTime = performance.now();
                const duration = endTime - startTime;
                console.log(`Generation completed in ${duration.toFixed(2)}ms`);

                // Log performance metrics
                if (window.performance && window.performance.mark) {
                    window.performance.mark('generation-complete');
                }
            }
        });
    }

    // Error boundary handler
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);

        // Show user-friendly error message
        this.client.showError(`An error occurred: ${error.message || 'Unknown error'}`);

        // Log error for debugging
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }
}

// Export for use in main client
window.EventHandlers = EventHandlers;