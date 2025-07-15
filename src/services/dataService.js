import { pcService } from './supabaseService.js';

// Legacy functions for backward compatibility
// New code should use supabaseService.js directly

export async function getAllPCs() {
    return await pcService.getAll();
}

export async function createPC(pcData) {
    return await pcService.create(pcData);
}

export async function updatePC(id, updates) {
    return await pcService.update(id, updates);
}

export async function getPCById(id) {
    return await pcService.getById(id);
} 