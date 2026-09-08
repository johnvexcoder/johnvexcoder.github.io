/**
 * Smart Expense Visualizer - Main Application Logic
 *
 * Handles:
 * - Form submission and validation
 * - localStorage persistence
 * - Chart.js visualization updates
 * - Summary card calculations
 * - Transaction table rendering
 * - Theme toggle
 */

// Constants
const STORAGE_KEY = 'expenses';
const CATEGORIES_STORAGE_KEY = 'categories';
const CHART_COLORS = {
    'Hosting': '#3B82F6',      // Blue
    'Tools': '#10B981',        // Green
    'Software': '#F59E0B',     // Amber
    'Courses': '#8B5CF6',      // Purple
    'Other': '#EF4444'         // Red
};

// Default categories
const DEFAULT_CATEGORIES = ['Hosting', 'Tools', 'Software', 'Courses', 'Other'];

let expenseChart = null;
// Sorting state for transactions table
let sortState = { key: 'date', direction: 'desc' };

// ============================================================================
// Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();

    // Load and populate categories
    loadAndPopulateCategories();

    // Attach event listeners
    document.getElementById('expenseForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllExpenses);
    document.getElementById('addCategoryBtn').addEventListener('click', handleAddCategory);

    // Initialize chart
    initializeChart();

    // Load and render existing data
    loadAndRender();

    // Restore theme preference
    restoreTheme();
}

// ============================================================================
// Form Handling
// ============================================================================

function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Validation
    const error = validateExpense(description, amount, category, date);
    if (error) {
        showError(error);
        return;
    }

    clearError();

    // Create expense object
    const expense = {
        id: Date.now(),
        description,
        amount,
        category,
        date,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);

    // Reset form
    document.getElementById('expenseForm').reset();
    document.getElementById('date').valueAsDate = new Date();

    // Update UI
    loadAndRender();
}

function validateExpense(description, amount, category, date) {
    if (!description || description.length === 0) {
        return 'Please enter a description.';
    }

    if (isNaN(amount) || amount <= 0) {
        return 'Amount must be a positive number.';
    }

    if (!category || category.length === 0) {
        return 'Please select a category.';
    }

    if (!date || date.length === 0) {
        return 'Please select a date.';
    }

    return null;
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.classList.add('flex');

    setTimeout(() => {
        clearError();
    }, 5000);
}

function clearError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.add('hidden');
    errorDiv.classList.remove('flex');
}

// ============================================================================
// Category Management
// ============================================================================

function getCategories() {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
}

function saveCategories(categories) {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

function loadAndPopulateCategories() {
    const categories = getCategories();
    const select = document.getElementById('category');

    // Keep the default option
    const defaultOption = select.querySelector('option[value=""]');
    select.innerHTML = '';
    select.appendChild(defaultOption);

    // Add all categories
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

function handleAddCategory() {
    const input = document.getElementById('newCategory');
    const categoryName = input.value.trim();
    const messageDiv = document.getElementById('categoryMessage');

    if (!categoryName) {
        showCategoryMessage('Please enter a category name', 'error');
        return;
    }

    if (categoryName.length > 20) {
        showCategoryMessage('Category name must be 20 characters or less', 'error');
        return;
    }

    const categories = getCategories();

    if (categories.includes(categoryName)) {
        showCategoryMessage('This category already exists', 'warning');
        return;
    }

    // Add new category
    categories.push(categoryName);
    saveCategories(categories);

    // Generate and save color for new category
    const color = generateCategoryColor();
    CHART_COLORS[categoryName] = color;

    // Update dropdown
    loadAndPopulateCategories();

    // Set the new category as selected
    document.getElementById('category').value = categoryName;

    // Clear input and show success message
    input.value = '';
    showCategoryMessage(`Category "${categoryName}" added successfully!`, 'success');
}

function showCategoryMessage(message, type) {
    const messageDiv = document.getElementById('categoryMessage');
    messageDiv.textContent = message;
    messageDiv.className = `text-xs mt-1`;

    if (type === 'error') {
        messageDiv.className += ' text-red-600 dark:text-red-400';
    } else if (type === 'warning') {
        messageDiv.className += ' text-yellow-600 dark:text-yellow-400';
    } else if (type === 'success') {
        messageDiv.className += ' text-green-600 dark:text-green-400';
    }

    messageDiv.classList.remove('hidden');

    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}

function generateCategoryColor() {
    const colors = ['#EC4899', '#06B6D4', '#14B8A6', '#A855F7', '#F97316', '#6366F1', '#D946EF', '#0EA5E9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ============================================================================
// localStorage Operations
// ============================================================================

// ============================================================================
// Number formatting
// ============================================================================
/**
 * Format number with thousands separators and two decimal places.
 * Returns a string like "1,234.56".
 */
function formatNumber(value) {
    if (typeof value !== 'number') value = parseFloat(value) || 0;
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function getExpenses() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveExpenses(expenses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// ============================================================================
// Chart Management
// ============================================================================

function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderColor: ['white'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = '₱' + formatNumber(context.parsed);
                            const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    const expenses = getExpenses();
    const categoryTotals = aggregateByCategory(expenses);

    if (Object.keys(categoryTotals).length === 0) {
        expenseChart.data.labels = [];
        expenseChart.data.datasets[0].data = [];
        expenseChart.data.datasets[0].backgroundColor = [];
        expenseChart.update();
        document.getElementById('noDataMessage').classList.remove('hidden');
        return;
    }

    document.getElementById('noDataMessage').classList.add('hidden');

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const colors = categories.map(cat => CHART_COLORS[cat] || '#6B7280');

    expenseChart.data.labels = categories;
    expenseChart.data.datasets[0].data = amounts;
    expenseChart.data.datasets[0].backgroundColor = colors;
    expenseChart.update();
}

// ============================================================================
// Summary Cards
// ============================================================================

function updateSummaryCards() {
    const expenses = getExpenses();

    // Total Spent
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    document.getElementById('totalSpent').textContent = formatNumber(total);

    // Highest Category
    const categoryTotals = aggregateByCategory(expenses);
    if (Object.keys(categoryTotals).length > 0) {
        const highestCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
        document.getElementById('highestCategory').textContent = highestCategory[0];
        document.getElementById('highestAmount').textContent = formatNumber(highestCategory[1]);
    } else {
        document.getElementById('highestCategory').textContent = '—';
        document.getElementById('highestAmount').textContent = '0.00';
    }

    // Transaction Count
    document.getElementById('transactionCount').textContent = expenses.length;
}

function aggregateByCategory(expenses) {
    return expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
}

// ============================================================================
// Transaction Table
// ============================================================================

function updateTransactionTable() {
    const expenses = getExpenses();
    const tbody = document.getElementById('transactionTableBody');

    if (expenses.length === 0) {
        tbody.innerHTML = `
            <tr class="text-center text-gray-500 dark:text-gray-400">
                <td colspan="5" class="py-8">
                    <i class="fas fa-inbox text-2xl mb-2"></i>
                    <p>No transactions yet</p>
                </td>
            </tr>
        `;
        document.getElementById('clearAllBtn').classList.add('hidden');
        return;
    }

    // Sort according to sortState and show full list (scrollable container handles overflow)
    const sorted = expenses.slice().sort((a, b) => {
        const key = sortState.key;
        const dir = sortState.direction === 'asc' ? 1 : -1;
        if (key === 'date') {
            return (new Date(a.date) - new Date(b.date)) * dir;
        }
        if (key === 'amount') {
            return (a.amount - b.amount) * dir;
        }
        // string comparison
        const va = (a[key] || '').toString().toLowerCase();
        const vb = (b[key] || '').toString().toLowerCase();
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
    });

    // Update sort indicators in headers
    updateSortIndicators();

    tbody.innerHTML = sorted.map(exp => `
        <tr class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="py-4 px-4 text-gray-600 dark:text-gray-400">${formatDate(exp.date)}</td>
            <td class="py-4 px-4 text-gray-900 dark:text-white font-medium">${escapeHtml(exp.description)}</td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    ${exp.category}
                </span>
            </td>
            <td class="py-4 px-4 text-gray-900 dark:text-white font-semibold">₱${formatNumber(exp.amount)}</td>
            <td class="py-4 px-4">
                <button
                    onclick="deleteExpense(${exp.id})"
                    class="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition"
                    title="Delete"
                >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');

    document.getElementById('clearAllBtn').classList.remove('hidden');
}

/**
 * Set sorting key and toggle direction when header clicked
 */
function setSort(key) {
    if (sortState.key === key) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.key = key;
        // sensible defaults: dates and amounts default to desc, strings to asc
        sortState.direction = (key === 'date' || key === 'amount') ? 'desc' : 'asc';
    }
    updateTransactionTable();
}

function updateSortIndicators() {
    const headers = ['date', 'description', 'category', 'amount'];
    headers.forEach(h => {
        const el = document.getElementById('th-' + h);
        if (!el) return;
        // base label
        let label = '';
        if (h === 'date') label = 'Date';
        if (h === 'description') label = 'Description';
        if (h === 'category') label = 'Category';
        if (h === 'amount') label = 'Amount';

        if (sortState.key === h) {
            const arrow = sortState.direction === 'asc' ? ' ▲' : ' ▼';
            el.textContent = label + arrow;
        } else {
            el.textContent = label;
        }
    });
}

// ============================================================================
// Delete Operations
// ============================================================================

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        const expenses = getExpenses();
        const filtered = expenses.filter(exp => exp.id !== id);
        saveExpenses(filtered);
        loadAndRender();
    }
}

function clearAllExpenses() {
    if (confirm('Are you sure you want to delete all expenses? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        loadAndRender();
    }
}

// ============================================================================
// Theme Toggle
// ============================================================================

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');

    // Save preference
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function restoreTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;

    if (savedTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

// ============================================================================
// Utilities
// ============================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================================================
// Main Render Function
// ============================================================================

function loadAndRender() {
    updateSummaryCards();
    updateChart();
    updateTransactionTable();
}
