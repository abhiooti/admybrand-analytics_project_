// Campaign data from the provided JSON
const campaignData = [
    {
        campaign: "Black Friday Sale 2024",
        status: "Active",
        budget: 25000,
        spent: 23456,
        impressions: 145632,
        clicks: 4567,
        conversions: 234,
        cost_per_click: 5.14,
        conversion_rate: 5.12,
        return_on_ad_spend: 3.2
    },
    {
        campaign: "Holiday Gift Guide",
        status: "Active",
        budget: 18000,
        spent: 16789,
        impressions: 98765,
        clicks: 3456,
        conversions: 178,
        cost_per_click: 4.86,
        conversion_rate: 5.15,
        return_on_ad_spend: 2.8
    },
    {
        campaign: "New Year Promotions",
        status: "Completed",
        budget: 30000,
        spent: 28934,
        impressions: 187654,
        clicks: 5432,
        conversions: 289,
        cost_per_click: 5.33,
        conversion_rate: 5.32,
        return_on_ad_spend: 4.1
    },
    {
        campaign: "Spring Collection Launch",
        status: "Paused",
        budget: 22000,
        spent: 19876,
        impressions: 123456,
        clicks: 4123,
        conversions: 201,
        cost_per_click: 4.82,
        conversion_rate: 4.87,
        return_on_ad_spend: 3.5
    },
    {
        campaign: "Summer Sale Campaign",
        status: "Active",
        budget: 35000,
        spent: 32145,
        impressions: 234567,
        clicks: 6789,
        conversions: 345,
        cost_per_click: 4.74,
        conversion_rate: 5.08,
        return_on_ad_spend: 3.8
    },
    {
        campaign: "Brand Awareness Q4",
        status: "Active",
        budget: 15000,
        spent: 13567,
        impressions: 89765,
        clicks: 2345,
        conversions: 98,
        cost_per_click: 5.78,
        conversion_rate: 4.18,
        return_on_ad_spend: 2.1
    },
    {
        campaign: "Retargeting Campaign",
        status: "Active",
        budget: 12000,
        spent: 11234,
        impressions: 67890,
        clicks: 3456,
        conversions: 167,
        cost_per_click: 3.25,
        conversion_rate: 4.83,
        return_on_ad_spend: 4.5
    },
    {
        campaign: "Lead Generation Drive",
        status: "Completed",
        budget: 28000,
        spent: 26789,
        impressions: 156789,
        clicks: 5234,
        conversions: 278,
        cost_per_click: 5.12,
        conversion_rate: 5.31,
        return_on_ad_spend: 3.9
    }
];

// Global variables
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...campaignData];
let sortColumn = '';
let sortDirection = 'asc';
let themeManager = null;
let tableManager = null;

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        // Check localStorage first, then system preference
        const stored = localStorage.getItem('dashboard-theme');
        if (stored) return stored;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.updateThemeToggleIcon();
        localStorage.setItem('dashboard-theme', this.currentTheme);
    }

    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Add rotation animation
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.style.transition = 'transform 0.3s ease';
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        }
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
    }
}

// Counter Animation
class CounterAnimation {
    static animateValue(element, start, end, duration, isRevenue = false, isGrowthRate = false) {
        if (!element) return;
        
        let startTimestamp = null;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            // Format based on type
            if (isGrowthRate) {
                element.textContent = current.toFixed(1) + '%';
            } else if (isRevenue) {
                element.textContent = '$' + Math.round(current).toLocaleString('en-US');
            } else {
                element.textContent = Math.round(current).toLocaleString('en-US');
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }

    static startCounters() {
        const metricValues = document.querySelectorAll('.metric-value[data-target]');
        
        metricValues.forEach((element, index) => {
            const target = parseFloat(element.dataset.target);
            
            // Stagger the animations
            setTimeout(() => {
                if (target === 487500) {
                    // Revenue
                    this.animateValue(element, 0, target, 2000, true, false);
                } else if (target === 145000) {
                    // Users
                    this.animateValue(element, 0, target, 2000, false, false);
                } else if (target === 8945) {
                    // Conversions
                    this.animateValue(element, 0, target, 2000, false, false);
                } else if (target === 4.5) {
                    // Growth rate
                    this.animateValue(element, 0, target, 2000, false, true);
                }
            }, index * 300);
        });
    }
}

// Table Management
class TableManager {
    constructor() {
        this.currentSearch = '';
        this.currentFilter = '';
        this.init();
    }

    init() {
        this.renderTable();
        this.setupEventListeners();
        this.updatePagination();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.handleSearch(e.target.value);
            });
        }

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.handleFilter(e.target.value);
            });
        }

        // Sorting
        document.querySelectorAll('[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                this.handleSort(th.dataset.sort);
            });
        });

        // Pagination
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredData.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    this.renderTable();
                    this.updatePagination();
                }
            });
        }
    }

    applyFilters() {
        filteredData = campaignData.filter(campaign => {
            const matchesSearch = !this.currentSearch || 
                campaign.campaign.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                campaign.status.toLowerCase().includes(this.currentSearch.toLowerCase());
            
            const matchesFilter = !this.currentFilter || campaign.status === this.currentFilter;
            
            return matchesSearch && matchesFilter;
        });
    }

    handleSearch(searchTerm) {
        this.currentSearch = searchTerm;
        this.applyFilters();
        currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    handleFilter(status) {
        this.currentFilter = status;
        this.applyFilters();
        currentPage = 1;
        this.renderTable();
        this.updatePagination();
    }

    handleSort(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        // Update sort icons
        document.querySelectorAll('[data-sort] i').forEach(icon => {
            icon.className = 'fas fa-sort';
        });

        const currentHeader = document.querySelector(`[data-sort="${column}"] i`);
        if (currentHeader) {
            currentHeader.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        }

        // Sort the data
        filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        this.renderTable();
    }

    renderTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        pageData.forEach((campaign, index) => {
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 50}ms`;
            row.className = 'table-row-fade-in';
            
            row.innerHTML = `
                <td>${campaign.campaign}</td>
                <td><span class="status-badge status-${campaign.status.toLowerCase()}">${campaign.status}</span></td>
                <td>$${campaign.budget.toLocaleString()}</td>
                <td>$${campaign.spent.toLocaleString()}</td>
                <td>${campaign.conversions.toLocaleString()}</td>
                <td>$${campaign.cost_per_click.toFixed(2)}</td>
                <td>${campaign.conversion_rate.toFixed(2)}%</td>
                <td>${campaign.return_on_ad_spend.toFixed(1)}</td>
            `;
            
            tableBody.appendChild(row);
        });

        // Add fade-in animation styles if not already present
        if (!document.querySelector('#table-animation-style')) {
            const style = document.createElement('style');
            style.id = 'table-animation-style';
            style.textContent = `
                .table-row-fade-in {
                    animation: slideInRight 0.3s ease-out forwards;
                    opacity: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (pageInfo) {
            pageInfo.textContent = `Page ${currentPage} of ${Math.max(1, totalPages)}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }
    }
}

// Loading Manager
class LoadingManager {
    static show() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
    }

    static hide() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    static simulate(duration = 1000) {
        this.show();
        setTimeout(() => {
            this.hide();
        }, duration);
    }
}

// Chart hover effects
class ChartEffects {
    static init() {
        const chartCards = document.querySelectorAll('.chart-card');
        
        chartCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('.chart-image');
                if (image) {
                    image.style.transform = 'scale(1.02)';
                    image.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.chart-image');
                if (image) {
                    image.style.transform = 'scale(1)';
                }
            });
        });
    }
}

// Metric card hover effects
class MetricEffects {
    static init() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach(card => {
            card.addEventListener('click', () => {
                // Add a subtle pulse effect
                card.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    card.style.animation = '';
                }, 600);
            });
        });
    }
}

// Intersection Observer for scroll animations
class ScrollAnimations {
    static init() {
        if (!window.IntersectionObserver) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        const sections = document.querySelectorAll('.charts-section, .table-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
}

// Keyboard shortcuts
class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search focus
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Ctrl/Cmd + D for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                if (themeManager) {
                    themeManager.toggle();
                }
            }
        });
    }
}

// Real-time updates simulation
class RealTimeUpdates {
    static init() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);
    }

    static updateMetrics() {
        const metrics = document.querySelectorAll('.metric-value');
        
        metrics.forEach(metric => {
            const currentValue = parseFloat(metric.dataset.target);
            // Simulate small random changes
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            const newValue = Math.max(0, currentValue * (1 + change));
            
            metric.dataset.target = newValue.toString();
            
            // Animate to new value with proper formatting
            if (currentValue === 4.5) {
                CounterAnimation.animateValue(metric, currentValue, newValue, 1000, false, true);
            } else if (currentValue === 487500) {
                CounterAnimation.animateValue(metric, currentValue, newValue, 1000, true, false);
            } else {
                CounterAnimation.animateValue(metric, currentValue, newValue, 1000, false, false);
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading initially
    LoadingManager.simulate(1200);
    
    // Initialize all components
    setTimeout(() => {
        try {
            // Initialize theme manager first
            themeManager = new ThemeManager();
            
            // Initialize table manager
            tableManager = new TableManager();
            
            // Start counter animations after a short delay
            setTimeout(() => {
                CounterAnimation.startCounters();
            }, 300);
            
            // Initialize effects
            ChartEffects.init();
            MetricEffects.init();
            ScrollAnimations.init();
            KeyboardShortcuts.init();
            
            // Start real-time updates
            RealTimeUpdates.init();
            
            // Add welcome message in console
            console.log('%c🚀 ADmyBRAND Insights Dashboard Loaded!', 
                'color: #3b82f6; font-size: 16px; font-weight: bold;');
            console.log('%cKeyboard shortcuts: Ctrl+K (Search), Ctrl+D (Theme Toggle)', 
                'color: #6b7280;');
                
        } catch (error) {
            console.error('Initialization error:', error);
            LoadingManager.hide();
        }
    }, 600);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Dashboard Error:', e.error);
    LoadingManager.hide();
});

// Resize handler for responsive behavior
window.addEventListener('resize', () => {
    if (tableManager) {
        tableManager.renderTable();
    }
});

// Export for potential external use
window.DashboardAPI = {
    themeManager: () => themeManager,
    tableManager: () => tableManager,
    refreshData: () => {
        LoadingManager.simulate(800);
        setTimeout(() => {
            if (tableManager) {
                tableManager.renderTable();
                tableManager.updatePagination();
            }
        }, 500);
    },
    toggleTheme: () => {
        if (themeManager) {
            themeManager.toggle();
        }
    }
};