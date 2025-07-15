import { createPC } from '../services/dataService.js';
import { setState } from '../state/store.js';

function PCForm() {
    const element = document.createElement('div');
    
    element.innerHTML = `
        <h2>Create New PC</h2>
        <form id="pc-form">
            <div>
                <label for="company">Company Name *</label>
                <input type="text" id="company" name="company" required>
            </div>
            <div>
                <label for="project_name">Project Name *</label>
                <input type="text" id="project_name" name="project_name" required>
            </div>
            <div>
                <label for="account_manager">Account Manager</label>
                <input type="text" id="account_manager" name="account_manager">
            </div>
            <div>
                <button type="submit">Create PC</button>
                <button type="button" id="cancel-btn">Cancel</button>
            </div>
        </form>
    `;

    // Handle form submission
    const form = element.querySelector('#pc-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const pcData = {
            pc_number: `PC-${String(Date.now()).slice(-6)}`, // Generate unique PC number
            company: formData.get('company'),
            project_name: formData.get('project_name'),
            account_manager: formData.get('account_manager') || null
        };

        try {
            const newPC = await createPC(pcData);
            if (newPC) {
                // Success: navigate back to dashboard
                setState({ currentPage: 'dashboard' });
            } else {
                alert('Failed to create PC. Please try again.');
            }
        } catch (error) {
            console.error('Error creating PC:', error);
            alert('An error occurred. Please try again.');
        }
    });

    // Handle cancel button
    const cancelBtn = element.querySelector('#cancel-btn');
    cancelBtn.addEventListener('click', () => {
        setState({ currentPage: 'dashboard' });
    });

    return element;
}

export default PCForm; 