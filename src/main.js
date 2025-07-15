// Trigger re-deployment
import { state, setState, subscribe } from './state/store.js';
import Dashboard from './components/Dashboard.js';
import PCForm from './components/PCForm.js';

const routes = {
  dashboard: Dashboard,
  'pc-new': PCForm,
};

const appElement = document.getElementById('app');

function render() {
  const page = state.currentPage;
  const component = routes[page] || Dashboard; // Default to Dashboard
  appElement.innerHTML = ''; // Clear previous content
  appElement.appendChild(component());
}

// Initial Render
render();

// Subscribe to state changes
subscribe(render);

// Handle navigation
document.querySelector('header nav').addEventListener('click', (e) => {
  if (e.target.matches('[data-page]')) {
    e.preventDefault();
    const newPage = e.target.dataset.page;
    setState({ currentPage: newPage });
  }
}); 