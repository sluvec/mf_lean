import { supabase } from './supabaseClient.js';

/**
 * Universal Supabase Service for all database interactions
 * Provides CRUD operations for all tables in the CRM system
 */

// ===== PC (Job File) Operations =====
export const pcService = {
    async getAll() {
        const { data, error } = await supabase
            .from('pcs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching PCs:', error);
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('pcs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching PC:', error);
            throw error;
        }
        return data;
    },

    async create(pcData) {
        const { data, error } = await supabase
            .from('pcs')
            .insert([pcData])
            .select()
            .single();

        if (error) {
            console.error('Error creating PC:', error);
            throw error;
        }
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('pcs')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating PC:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('pcs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting PC:', error);
            throw error;
        }
        return true;
    }
};

// ===== Quote Operations =====
export const quoteService = {
    async getAll() {
        const { data, error } = await supabase
            .from('quotes')
            .select(`
                *,
                pc:pcs(pc_number, company, project_name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes:', error);
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('quotes')
            .select(`
                *,
                pc:pcs(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching quote:', error);
            throw error;
        }
        return data;
    },

    async getByPCId(pcId) {
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .eq('pc_id', pcId)
            .order('version', { ascending: false });

        if (error) {
            console.error('Error fetching quotes for PC:', error);
            throw error;
        }
        return data;
    },

    async create(quoteData) {
        const { data, error } = await supabase
            .from('quotes')
            .insert([quoteData])
            .select()
            .single();

        if (error) {
            console.error('Error creating quote:', error);
            throw error;
        }
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('quotes')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating quote:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('quotes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quote:', error);
            throw error;
        }
        return true;
    },

    async getNextVersion(pcId) {
        const { data, error } = await supabase
            .from('quotes')
            .select('version')
            .eq('pc_id', pcId)
            .order('version', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error getting next version:', error);
            return 1;
        }

        return data.length > 0 ? data[0].version + 1 : 1;
    }
};

// ===== Resource Operations =====
export const resourceService = {
    async getAll() {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching resources:', error);
            throw error;
        }
        return data;
    },

    async getByCategory(category) {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('category', category)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching resources by category:', error);
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching resource:', error);
            throw error;
        }
        return data;
    },

    async create(resourceData) {
        const { data, error } = await supabase
            .from('resources')
            .insert([resourceData])
            .select()
            .single();

        if (error) {
            console.error('Error creating resource:', error);
            throw error;
        }
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('resources')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
        return true;
    }
};

// ===== Price List Operations =====
export const priceListService = {
    async getAll() {
        const { data, error } = await supabase
            .from('price_lists')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching price lists:', error);
            throw error;
        }
        return data;
    },

    async getActive() {
        const { data, error } = await supabase
            .from('price_lists')
            .select('*')
            .eq('status', 'active')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching active price lists:', error);
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('price_lists')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching price list:', error);
            throw error;
        }
        return data;
    },

    async create(priceListData) {
        const { data, error } = await supabase
            .from('price_lists')
            .insert([priceListData])
            .select()
            .single();

        if (error) {
            console.error('Error creating price list:', error);
            throw error;
        }
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('price_lists')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating price list:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('price_lists')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting price list:', error);
            throw error;
        }
        return true;
    }
};

// ===== Activity Operations =====
export const activityService = {
    async getAll() {
        const { data, error } = await supabase
            .from('activities')
            .select(`
                *,
                pc:pcs(pc_number, company, project_name),
                quote:quotes(quote_number, name)
            `)
            .order('activity_date', { ascending: true });

        if (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
        return data;
    },

    async getByDateRange(startDate, endDate) {
        const { data, error } = await supabase
            .from('activities')
            .select(`
                *,
                pc:pcs(pc_number, company, project_name),
                quote:quotes(quote_number, name)
            `)
            .gte('activity_date', startDate)
            .lte('activity_date', endDate)
            .order('activity_date', { ascending: true });

        if (error) {
            console.error('Error fetching activities by date range:', error);
            throw error;
        }
        return data;
    },

    async getByPCId(pcId) {
        const { data, error } = await supabase
            .from('activities')
            .select(`
                *,
                quote:quotes(quote_number, name)
            `)
            .eq('pc_id', pcId)
            .order('activity_date', { ascending: true });

        if (error) {
            console.error('Error fetching activities for PC:', error);
            throw error;
        }
        return data;
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('activities')
            .select(`
                *,
                pc:pcs(*),
                quote:quotes(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching activity:', error);
            throw error;
        }
        return data;
    },

    async create(activityData) {
        const { data, error } = await supabase
            .from('activities')
            .insert([activityData])
            .select()
            .single();

        if (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('activities')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting activity:', error);
            throw error;
        }
        return true;
    }
};

// ===== Utility Functions =====
export const utilityService = {
    async testConnection() {
        try {
            const { data, error } = await supabase
                .from('pcs')
                .select('count(*)')
                .limit(1);

            if (error) throw error;
            return { success: true, message: 'Database connection successful' };
        } catch (error) {
            console.error('Database connection test failed:', error);
            return { success: false, message: error.message };
        }
    },

    async getTableStats() {
        try {
            const [pcsCount, quotesCount, resourcesCount, priceListsCount, activitiesCount] = await Promise.all([
                supabase.from('pcs').select('count(*)'),
                supabase.from('quotes').select('count(*)'),
                supabase.from('resources').select('count(*)'),
                supabase.from('price_lists').select('count(*)'),
                supabase.from('activities').select('count(*)')
            ]);

            return {
                pcs: pcsCount.count || 0,
                quotes: quotesCount.count || 0,
                resources: resourcesCount.count || 0,
                priceLists: priceListsCount.count || 0,
                activities: activitiesCount.count || 0
            };
        } catch (error) {
            console.error('Error getting table stats:', error);
            return null;
        }
    }
}; 