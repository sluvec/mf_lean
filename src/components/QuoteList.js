import { quoteService } from '../services/supabaseService.js';
import { setState, state } from '../state/store.js';

function QuoteList() {
    const element = document.createElement('div');
    
    const currentPC = state.currentPC;
    
    if (!currentPC) {
        element.innerHTML = `
            <h2>Quotes</h2>
            <p>No PC selected. <a href="#" id="back-to-dashboard">Return to Dashboard</a></p>
        `;
        
        element.querySelector('#back-to-dashboard').addEventListener('click', (e) => {
            e.preventDefault();
            setState({ currentPage: 'dashboard', currentPC: null });
        });
        
        return element;
    }

    element.innerHTML = `
        <div class="quote-list-container">
            <div class="quote-header">
                <div class="quote-header-info">
                    <h2>Quotes for ${currentPC.pc_number}</h2>
                    <p><strong>${currentPC.company}</strong> - ${currentPC.project_name}</p>
                </div>
                <div class="quote-actions">
                    <button id="new-quote-btn">New Quote</button>
                    <button id="back-to-pc-btn">Back to PC</button>
                </div>
            </div>
            
            <div id="quotes-content">
                <div class="loading">Loading quotes...</div>
            </div>
        </div>
    `;

    // Handle back to PC button
    element.querySelector('#back-to-pc-btn').addEventListener('click', () => {
        setState({ currentPage: 'pc-detail' });
    });

    // Handle new quote button
    element.querySelector('#new-quote-btn').addEventListener('click', () => {
        setState({ currentPage: 'quote-new' });
    });

    // Load quotes for this PC
    loadQuotes();

    async function loadQuotes() {
        try {
            const quotes = await quoteService.getByPCId(currentPC.id);
            renderQuotes(quotes);
        } catch (error) {
            console.error('Error loading quotes:', error);
            const contentDiv = element.querySelector('#quotes-content');
            contentDiv.innerHTML = `
                <div class="error">
                    Failed to load quotes. Please try again.
                </div>
            `;
        }
    }

    function renderQuotes(quotes) {
        const contentDiv = element.querySelector('#quotes-content');
        
        if (!quotes || quotes.length === 0) {
            contentDiv.innerHTML = `
                <div class="no-quotes">
                    <p>No quotes found for this PC.</p>
                    <p>Create your first quote using the "New Quote" button!</p>
                </div>
            `;
            return;
        }

        const quoteItems = quotes.map(quote => `
            <div class="quote-item" data-quote-id="${quote.id}">
                <div class="quote-info">
                    <h3>${quote.quote_number}</h3>
                    <p><strong>Name:</strong> ${quote.name || 'Untitled Quote'}</p>
                    <p><strong>Status:</strong> <span class="status-${quote.status.toLowerCase()}">${quote.status}</span></p>
                    <p><strong>Version:</strong> ${quote.version}</p>
                    ${quote.total_value ? `<p><strong>Total:</strong> £${parseFloat(quote.total_value).toFixed(2)}</p>` : ''}
                    ${quote.description ? `<p><strong>Description:</strong> ${quote.description}</p>` : ''}
                </div>
                <div class="quote-meta">
                    <p class="quote-date">Created: ${new Date(quote.created_at).toLocaleDateString()}</p>
                    <div class="quote-item-actions">
                        <button class="btn-secondary" onclick="viewQuote('${quote.id}')">View</button>
                        <button class="btn-primary" onclick="editQuote('${quote.id}')">Edit</button>
                    </div>
                </div>
            </div>
        `).join('');

        contentDiv.innerHTML = `
            <div class="quotes-grid">
                ${quoteItems}
            </div>
        `;
    }

    // Make functions available globally for onclick handlers
    window.viewQuote = (quoteId) => {
        const quote = state.quotes?.find(q => q.id === quoteId);
        setState({ 
            currentPage: 'quote-detail', 
            currentQuote: quote || { id: quoteId }
        });
    };

    window.editQuote = (quoteId) => {
        const quote = state.quotes?.find(q => q.id === quoteId);
        setState({ 
            currentPage: 'quote-edit', 
            currentQuote: quote || { id: quoteId }
        });
    };

    return element;
}

export default QuoteList; 