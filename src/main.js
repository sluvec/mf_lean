// Trigger re-deployment
import { state, setState, subscribe } from './state/store.js';
import { getAllPCs, createPC } from './services/dataService.js';
import Dashboard from './components/Dashboard.js';
import PCForm from './components/PCForm.js';

const routes = {
  dashboard: Dashboard,
  'pc-new': PCForm,
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

// Handle navigation events
document.querySelector('header nav').addEventListener('click', (e) => {
  if (e.target.matches('[data-page]')) {
    e.preventDefault();
    const newPage = e.target.dataset.page;
    setState({ currentPage: newPage });
  }
  // Handle test seed button
  if (e.target.matches('[data-test="seed"]')) {
    e.preventDefault();
    const testPC = {
      pc_number: `PC-${Math.floor(Math.random() * 9000) + 1000}`,
      company: 'Test Company Ltd',
      project_name: 'Seeding Test'
    };
    createPC(testPC).then(newPC => {
      if (newPC) {
        console.log('Test PC created:', newPC);
        // If we are already on the dashboard, just reload the data.
        // Otherwise, navigate to it, which will trigger the data load.
        if (state.currentPage === 'dashboard') {
          loadDashboardData();
        } else {
          setState({ currentPage: 'dashboard' });
        }
      }
    });
  }
});

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