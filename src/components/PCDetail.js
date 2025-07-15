import { updatePC } from '../services/dataService.js';
import { setState, state } from '../state/store.js';

function PCDetail() {
    const element = document.createElement('div');
    
    // Get PC ID from state (we'll need to modify state management for this)
    const currentPC = state.currentPC;
    
    if (!currentPC) {
        element.innerHTML = `
            <h2>PC Details</h2>
            <p>No PC selected. <a href="#" id="back-to-dashboard">Return to Dashboard</a></p>
        `;
        
        element.querySelector('#back-to-dashboard').addEventListener('click', (e) => {
            e.preventDefault();
            setState({ currentPage: 'dashboard', currentPC: null });
        });
        
        return element;
    }
    
    element.innerHTML = `
        <div class="pc-detail">
            <div class="pc-detail-header">
                <h2>PC Details: ${currentPC.pc_number}</h2>
                <div class="pc-actions">
                    <button id="edit-pc-btn">Edit PC</button>
                    <button id="back-btn">Back to Dashboard</button>
                </div>
            </div>
            
            <div id="pc-content">
                ${renderPCView(currentPC)}
            </div>
        </div>
    `;

    // Handle back button
    element.querySelector('#back-btn').addEventListener('click', () => {
        setState({ currentPage: 'dashboard', currentPC: null });
    });

    // Handle edit button
    element.querySelector('#edit-pc-btn').addEventListener('click', () => {
        const contentDiv = element.querySelector('#pc-content');
        contentDiv.innerHTML = renderPCEdit(currentPC);
        
        // Handle form submission
        const form = contentDiv.querySelector('#edit-pc-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const updatedData = {
                company: formData.get('company'),
                project_name: formData.get('project_name'),
                account_manager: formData.get('account_manager') || null,
                crown_branch: formData.get('crown_branch') || null,
                client_category: formData.get('client_category') || null,
                client_source: formData.get('client_source') || null,
                surveyor: formData.get('surveyor') || null,
                property_type: formData.get('property_type') || null
            };

            try {
                const updated = await updatePC(currentPC.id, updatedData);
                if (updated) {
                    // Update the current PC in state
                    setState({ currentPC: { ...currentPC, ...updatedData } });
                    // Switch back to view mode
                    contentDiv.innerHTML = renderPCView({ ...currentPC, ...updatedData });
                    
                    // Rebind edit button
                    element.querySelector('#edit-pc-btn').addEventListener('click', () => {
                        contentDiv.innerHTML = renderPCEdit({ ...currentPC, ...updatedData });
                        bindEditForm();
                    });
                } else {
                    alert('Failed to update PC. Please try again.');
                }
            } catch (error) {
                console.error('Error updating PC:', error);
                alert('An error occurred. Please try again.');
            }
        });
        
        // Handle cancel button
        contentDiv.querySelector('#cancel-edit-btn').addEventListener('click', () => {
            contentDiv.innerHTML = renderPCView(currentPC);
            bindEditButton();
        });
    });

    return element;
}

function renderPCView(pc) {
    return `
        <div class="pc-view">
            <div class="pc-section">
                <h3>Basic Information</h3>
                <div class="pc-field">
                    <label>PC Number:</label>
                    <span>${pc.pc_number}</span>
                </div>
                <div class="pc-field">
                    <label>Company:</label>
                    <span>${pc.company}</span>
                </div>
                <div class="pc-field">
                    <label>Project Name:</label>
                    <span>${pc.project_name}</span>
                </div>
                <div class="pc-field">
                    <label>Account Manager:</label>
                    <span>${pc.account_manager || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="pc-section">
                <h3>Additional Details</h3>
                <div class="pc-field">
                    <label>Crown Branch:</label>
                    <span>${pc.crown_branch || 'Not specified'}</span>
                </div>
                <div class="pc-field">
                    <label>Client Category:</label>
                    <span>${pc.client_category || 'Not specified'}</span>
                </div>
                <div class="pc-field">
                    <label>Client Source:</label>
                    <span>${pc.client_source || 'Not specified'}</span>
                </div>
                <div class="pc-field">
                    <label>Surveyor:</label>
                    <span>${pc.surveyor || 'Not specified'}</span>
                </div>
                <div class="pc-field">
                    <label>Property Type:</label>
                    <span>${pc.property_type || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="pc-section">
                <h3>Timestamps</h3>
                <div class="pc-field">
                    <label>Created:</label>
                    <span>${new Date(pc.created_at).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

function renderPCEdit(pc) {
    return `
        <form id="edit-pc-form" class="pc-edit-form">
            <div class="pc-section">
                <h3>Basic Information</h3>
                <div class="form-row">
                    <div class="form-field">
                        <label for="company">Company Name *</label>
                        <input type="text" id="company" name="company" value="${pc.company}" required>
                    </div>
                    <div class="form-field">
                        <label for="project_name">Project Name *</label>
                        <input type="text" id="project_name" name="project_name" value="${pc.project_name}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="account_manager">Account Manager</label>
                        <input type="text" id="account_manager" name="account_manager" value="${pc.account_manager || ''}">
                    </div>
                    <div class="form-field">
                        <label for="crown_branch">Crown Branch</label>
                        <input type="text" id="crown_branch" name="crown_branch" value="${pc.crown_branch || ''}">
                    </div>
                </div>
            </div>
            
            <div class="pc-section">
                <h3>Additional Details</h3>
                <div class="form-row">
                    <div class="form-field">
                        <label for="client_category">Client Category</label>
                        <input type="text" id="client_category" name="client_category" value="${pc.client_category || ''}">
                    </div>
                    <div class="form-field">
                        <label for="client_source">Client Source</label>
                        <input type="text" id="client_source" name="client_source" value="${pc.client_source || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="surveyor">Surveyor</label>
                        <input type="text" id="surveyor" name="surveyor" value="${pc.surveyor || ''}">
                    </div>
                    <div class="form-field">
                        <label for="property_type">Property Type</label>
                        <input type="text" id="property_type" name="property_type" value="${pc.property_type || ''}">
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit">Save Changes</button>
                <button type="button" id="cancel-edit-btn">Cancel</button>
            </div>
        </form>
    `;
}

export default PCDetail; 