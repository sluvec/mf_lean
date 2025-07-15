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