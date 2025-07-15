-- Table for primary job/client records (PC Numbers)
CREATE TABLE pcs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pc_number TEXT UNIQUE NOT NULL,
    company TEXT NOT NULL,
    project_name TEXT NOT NULL,
    account_manager TEXT,
    crown_branch TEXT,
    client_category TEXT,
    client_source TEXT,
    surveyor TEXT,
    property_type TEXT,
    -- Contact and Address data stored as JSONB for flexibility
    collection_contact JSONB,
    collection_address JSONB,
    delivery_contact JSONB,
    delivery_address JSONB
);

-- Table for Quotes
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pc_id UUID REFERENCES pcs(id) ON DELETE CASCADE NOT NULL,
    quote_number TEXT UNIQUE NOT NULL,
    name TEXT,
    description TEXT,
    status TEXT DEFAULT 'Draft' NOT NULL, -- e.g., Draft, Sent, Approved, Rejected
    version INT DEFAULT 1 NOT NULL,
    -- Financial data
    total_value DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 20.00, -- Standard UK VAT rate
    -- Complex data stored as JSONB
    items JSONB,             -- { human: [...], vehicles: [...], ... }
    other_costs JSONB,       -- [{ description: string, amount: decimal }]
    recycling_charges JSONB, -- { general: {...}, pops: {...} }
    rebates JSONB            -- { furniture: {...}, it: {...} }
);

-- Table for all company resources and their base costs
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL, -- 'human', 'vehicles', 'materials', 'equipment'
    unit TEXT NOT NULL, -- 'hour', 'day', 'each'
    net_cost DECIMAL(10, 2) NOT NULL,
    is_time_based BOOLEAN DEFAULT false,
    rate_standard DECIMAL(10, 2),
    rate_overtime DECIMAL(10, 2),
    rate_weekend DECIMAL(10, 2)
);

-- Table for customer-facing price lists
CREATE TABLE price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'inactive'
    -- Array of objects linking a resource to a client price
    items JSONB -- e.g., [{ "resource_id": "uuid", "client_price": 150.00 }, ...]
);

-- Table for operational activities
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pc_id UUID REFERENCES pcs(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    activity_date DATE NOT NULL,
    name TEXT NOT NULL,
    type TEXT, -- e.g., 'Survey', 'Move'
    status TEXT DEFAULT 'Pending' NOT NULL,
    resources_required JSONB,
    team_instructions TEXT,
    time_depot_start TIME,
    time_site_start TIME
);

-- Indexes for performance
CREATE INDEX idx_pcs_company ON pcs(company);
CREATE INDEX idx_quotes_pc_id ON quotes(pc_id);
CREATE INDEX idx_activities_date ON activities(activity_date);
