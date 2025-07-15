import { state, subscribe } from '../state/store.js';

function Dashboard() {
    const element = document.createElement('div');

    const render = () => {
        if (state.isLoading) {
            element.innerHTML = `<h2>Dashboard</h2><p>Loading PCs...</p>`;
            return;
        }
        if (!state.pcs || state.pcs.length === 0) {
            element.innerHTML = `<h2>Dashboard</h2><p>No PCs found. Create one!</p>`;
            return;
        }
        const pcItems = state.pcs.map(pc => `<li>${pc.pc_number} - ${pc.company}</li>`).join('');
        element.innerHTML = `<h2>Dashboard</h2><ul>${pcItems}</ul>`;
    };

    // This component now subscribes to the store and re-renders its own content
    // when the state changes. This avoids a full page re-render from main.js.
    // In a larger app, we'd need to handle unsubscribing to prevent memory leaks.
    subscribe(render);
    render(); // Initial render

    return element;
}

export default Dashboard; 