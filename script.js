// Interview data structure
let allInterviews = [];
let filteredInterviews = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadInterviews();
    setupEventListeners();
    displayInterviews(allInterviews);
    updateStats();
});

// Load interviews from text files
async function loadInterviews() {
    // Since we're running as a static site, we'll need to manually define the interviews
    // In a real deployment, you'd fetch these from a server or use a static site generator
    const interviews = [
        {
            id: 'exl_aws_dataengineer_5y_oct_25',
            company: 'EXL',
            role: 'AWS Data Engineer',
            experience: '5 years',
            date: 'October 2025',
            file: 'E/exl_aws_dataengineer_5y_oct_25.txt',
            questions: [
                {
                    question: 'How do you connect spark with aws',
                    approach: 'Tell about initialising spark session with aws config.'
                },
                {
                    question: 'How do you convert spark df to pandas df; What are udfs in pyspark, How to write udfs',
                    approach: 'Prepare with all the important pyspark methods'
                },
                {
                    question: 'How do spark handles memory',
                    approach: 'Spark memory management'
                },
                {
                    question: 'Spark Transformations',
                    approach: 'Talk about narrow and wide transformations, give examples'
                },
                {
                    question: 'Transformations and actions',
                    approach: null
                },
                {
                    question: 'Lazy evaluation',
                    approach: null
                },
                {
                    question: 'Optimization techniques',
                    approach: 'Give practical examples that you have used.'
                },
                {
                    question: 'Different modes of reading a file in spark',
                    approach: 'Tell about PERMISSIVE, DROPMALFORMED, FAILFAST modes with examples.'
                },
                {
                    question: 'Lifecycle of a SQL query',
                    approach: 'Order of execution of any SQL query'
                }
            ],
            notes: 'The interview focused more on spark.'
        },
        {
            id: 'publicis_sapient_dataengineer_5y_jan_25',
            company: 'Publicis Sapient',
            role: 'Data Engineer',
            experience: '5 years',
            date: 'January 2025',
            file: 'P/publicis_sapient_dataengineer_5y_jan_25.txt',
            questions: [
                {
                    question: 'Second highest salary to find both in SQL and pyspark',
                    approach: 'Show window functions, and sub query both the methods'
                },
                {
                    question: 'Transformations and actions',
                    approach: null
                },
                {
                    question: 'Explode, collect_list, collect_set methods, examples',
                    approach: null
                },
                {
                    question: 'Multiple joins in sql and spark.',
                    approach: null
                },
                {
                    question: 'How to handle nulls in spark',
                    approach: 'tell about different read modes'
                },
                {
                    question: 'How to read json files in spark',
                    approach: null
                },
                {
                    question: 'Spark wordcount examples',
                    approach: null
                },
                {
                    question: 'What are the differnet airflow operators you have used for running spark applications. Write a simple dag',
                    approach: 'Tell about SparkSubmitOperator etc.'
                }
            ]
        }
    ];

    allInterviews = interviews;
    filteredInterviews = interviews;

    // Try to fetch actual files if running on a server
    try {
        for (let interview of allInterviews) {
            const response = await fetch(interview.file);
            if (response.ok) {
                const text = await response.text();
                interview.rawContent = text;
                // Parse the content if needed
            }
        }
    } catch (error) {
        console.log('Running in static mode - using predefined data');
    }
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const companyFilter = document.getElementById('companyFilter');
    const roleFilter = document.getElementById('roleFilter');

    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', handleClear);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Populate filters
    const companies = [...new Set(allInterviews.map(i => i.company))].sort();
    const roles = [...new Set(allInterviews.map(i => i.role))].sort();

    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });

    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });

    companyFilter.addEventListener('change', applyFilters);
    roleFilter.addEventListener('change', applyFilters);
}

// Handle search
function handleSearch() {
    applyFilters();
}

// Handle clear
function handleClear() {
    document.getElementById('searchInput').value = '';
    document.getElementById('companyFilter').value = '';
    document.getElementById('roleFilter').value = '';
    filteredInterviews = allInterviews;
    displayInterviews(filteredInterviews);
    updateStats();
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const companyFilter = document.getElementById('companyFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    filteredInterviews = allInterviews.filter(interview => {
        const matchesSearch = !searchTerm || 
            interview.company.toLowerCase().includes(searchTerm) ||
            interview.role.toLowerCase().includes(searchTerm) ||
            interview.questions.some(q => 
                q.question.toLowerCase().includes(searchTerm) ||
                (q.approach && q.approach.toLowerCase().includes(searchTerm))
            );

        const matchesCompany = !companyFilter || interview.company === companyFilter;
        const matchesRole = !roleFilter || interview.role === roleFilter;

        return matchesSearch && matchesCompany && matchesRole;
    });

    displayInterviews(filteredInterviews);
    updateStats();
}

// Display interviews
function displayInterviews(interviews) {
    const container = document.getElementById('interviewsList');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');

    loading.style.display = 'none';

    if (interviews.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    container.innerHTML = interviews.map(interview => createInterviewCard(interview)).join('');
}

// Create interview card HTML
function createInterviewCard(interview) {
    const questionsHtml = interview.questions.map((q, index) => `
        <div class="question-item">
            <div class="question-text">${index + 1}. ${escapeHtml(q.question)}</div>
            ${q.approach ? `
                <div class="approach-text">
                    <span class="approach-label">Approach:</span>
                    ${escapeHtml(q.approach)}
                </div>
            ` : ''}
        </div>
    `).join('');

    return `
        <div class="interview-card">
            <div class="interview-header">
                <div class="interview-title">
                    <div class="company-name">${escapeHtml(interview.company)}</div>
                    <div class="interview-meta">
                        <span class="meta-badge role-badge">${escapeHtml(interview.role)}</span>
                        <span class="meta-badge experience-badge">${escapeHtml(interview.experience)} experience</span>
                        <span class="meta-badge date-badge">${escapeHtml(interview.date)}</span>
                    </div>
                </div>
            </div>
            ${interview.notes ? `<p style="color: var(--text-secondary); margin-bottom: 1rem; font-style: italic;">${escapeHtml(interview.notes)}</p>` : ''}
            <div class="interview-content">
                ${questionsHtml}
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    document.getElementById('totalInterviews').textContent = filteredInterviews.length;
    const uniqueCompanies = new Set(filteredInterviews.map(i => i.company)).size;
    document.getElementById('totalCompanies').textContent = uniqueCompanies;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
}

