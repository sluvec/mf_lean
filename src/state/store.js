const listeners = new Set();

export const state = {
    currentPage: 'dashboard',
    currentPC: null,
    pcs: [],
    quotes: [],
    activities: [],
    resources: [],
    priceLists: [],
    isLoading: false,
    error: null,
};

export function setState(newState) {
    Object.assign(state, newState);
    listeners.forEach(listener => listener());
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener); // Return an unsubscribe function
} 