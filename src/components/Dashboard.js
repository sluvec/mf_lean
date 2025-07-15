import { getAllPCs } from '../services/dataService.js';
import { state, setState, subscribe } from '../state/store.js';

function renderPCList(element) {
    if (state.isLoading) {
        element.innerHTML = '<h2>Dashboard</h2><p>Loading PCs...</p>';
        return;
    }

    if (state.pcs.length === 0) {
        element.innerHTML = '<h2>Dashboard</h2><p>No PCs found. Create one!</p>';
        return;
    }

    const pcItems = state.pcs.map(pc => `<li>${pc.pc_number} - ${pc.company}</li>`).join('');
    element.innerHTML = `<h2>Dashboard</h2><ul>${pcItems}</ul>`;
}


function Dashboard() {
    const element = document.createElement('div');

    // Initial render
    renderPCList(element);

    // Subscribe to changes for future re-renders
    const unsubscribe = subscribe(() => renderPCList(element));
    
    // Fetch data when the component is created
    setState({ isLoading: true });
    getAllPCs().then(pcs => {
        setState({ pcs: pcs, isLoading: false });
    });
    
    // Cleanup subscription when the component is "destroyed" (not really, but good practice)
    // In a real framework, this would be in a lifecycle method. Here we just return it.
    // This is a bit of a conceptual leak, but ok for this simple SPA.
    // element.cleanup = unsubscribe; 

    return element;
}

export default Dashboard; 