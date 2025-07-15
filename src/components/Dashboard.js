import { state, subscribe } from '../state/store.js';

function Dashboard() {
    const element = document.createElement('div');

    const render = () => {
        if (state.isLoading) {
            element.innerHTML = `
                <h2>Dashboard</h2>
                <div class="loading">Loading PCs...</div>
            `;
            return;
        }
        if (!state.pcs || state.pcs.length === 0) {
            element.innerHTML = `
                <h2>Dashboard</h2>
                <p>No PCs found. Create one using the "New PC" button!</p>
            `;
            return;
        }
        
        const pcItems = state.pcs.map(pc => `
            <div class="pc-item">
                <div class="pc-info">
                    <h3>${pc.pc_number}</h3>
                    <p><strong>Company:</strong> ${pc.company}</p>
                    <p><strong>Project:</strong> ${pc.project_name}</p>
                    ${pc.account_manager ? `<p><strong>Account Manager:</strong> ${pc.account_manager}</p>` : ''}
                </div>
            </div>
        `).join('');
        
        element.innerHTML = `
            <h2>Dashboard</h2>
            <div class="pc-list">
                ${pcItems}
            </div>
        `;
    };

    // This component now subscribes to the store and re-renders its own content
    // when the state changes. This avoids a full page re-render from main.js.
    // In a larger app, we'd need to handle unsubscribing to prevent memory leaks.
    subscribe(render);
    render(); // Initial render

    return element;
}

export default Dashboard; 