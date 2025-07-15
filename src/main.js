// Trigger re-deployment
import { state, setState, subscribe } from './state/store.js';
import { getAllPCs, createPC } from './services/dataService.js';
import Dashboard from './components/Dashboard.js';
import PCForm from './components/PCForm.js';
import PCDetail from './components/PCDetail.js';
import QuoteList from './components/QuoteList.js';

const routes = {
  dashboard: Dashboard,
  'pc-new': PCForm,
  'pc-detail': PCDetail,
  'quote-list': QuoteList,
};

const appElement = document.getElementById('app');

function loadDashboardData() {
    setState({ isLoading: true });
    getAllPCs().then(pcs => {
        setState({ pcs: pcs, isLoading: false });
    });
}

function navigateTo(page) {
    appElement.innerHTML = '';
    const component = routes[page] || Dashboard;
    appElement.appendChild(component());

    if (page === 'dashboard') {
        loadDashboardData();
    }
}

// Listen for currentPage changes to navigate
let currentPage = state.currentPage;
subscribe(() => {
    if (state.currentPage !== currentPage) {
        currentPage = state.currentPage;
        navigateTo(currentPage);
    }
});

// Initial Page Load
navigateTo(state.currentPage);

// Handle navigation events - moved to after DOM is loaded
const navElement = document.querySelector('header nav');
if (navElement) {
    navElement.addEventListener('click', (e) => {
        if (e.target.matches('[data-page]')) {
            e.preventDefault();
            const newPage = e.target.dataset.page;
            setState({ currentPage: newPage });
        }
    });
} 