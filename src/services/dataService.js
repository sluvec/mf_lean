import { supabase } from './supabaseClient.js';

export async function getAllPCs() {
    const { data, error } = await supabase
        .from('pcs')
        .select('*');

    if (error) {
        console.error('Error fetching PCs:', error);
        return [];
    }

    return data;
}

export async function createPC(pcData) {
    const { data, error } = await supabase
        .from('pcs')
        .insert([pcData])
        .select();

    if (error) {
        console.error('Error creating PC:', error);
        return null;
    }

    return data[0];
}

export async function updatePC(id, updates) {
    const { data, error } = await supabase
        .from('pcs')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error updating PC:', error);
        return null;
    }

    return data[0];
}

export async function deletePC(id) {
    const { error } = await supabase
        .from('pcs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting PC:', error);
        return false;
    }

    return true;
} 