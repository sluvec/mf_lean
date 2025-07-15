
-----

### **Technical Specification: CRM for UK Office Relocations**

**Document Version:** 1.1
**Date:** 15.07.2025
**Author:** Gemini AI

-----

#### **0. Introduction & Project Goals**

This document provides a complete technical specification for the ground-up development of a new, modular CRM application. The project's purpose is to replace a legacy, single-file application with a modern, maintainable, and scalable web application tailored for an **office relocations company operating in the United Kingdom**.

The core objective is to build a robust system for managing the entire client engagement lifecycle, from initial job creation to quoting, operational scheduling, and resource management.

**Key Goals:**

1.  **Modularity:** Implement a component-based architecture with a clean separation of concerns (data, logic, presentation).
2.  **Scalability & Reliability:** Utilize Supabase as a robust backend, ensuring data integrity and future API expansion capabilities.
3.  **Modern Development Workflow:** Establish a professional development pipeline using Git, GitHub, Vercel, Supabase CLI, and CI/CD principles for automation and consistency.
4.  **Clean Code:** Write efficient, readable, and maintainable code, avoiding the pitfalls of the legacy system.
5.  **No Login Requirement:** For this version, the application will be directly accessible without a user authentication system.

-----

#### **1. Technology Stack**

  * **Frontend:**
      * **Language:** JavaScript (ES6+).
      * **Build Tool:** **Vite**. Provides a fast development server with Hot Module Replacement (HMR) and an optimized production build.
      * **Framework:** The application will be built using a **"Vanilla JS" component-based approach**. This maintains simplicity while enforcing a modular structure, similar to modern frameworks.
      * **Styling:** **CSS** with Custom Properties (variables) for a themable and consistent design system.
  * **Backend as a Service (BaaS):**
      * **Database & API:** **Supabase** (PostgreSQL).
  * **Hosting:**
      * **Platform:** **Vercel**.
  * **Tooling & Automation:**
      * **Version Control:** **Git / GitHub**.
      * **CI/CD:** **Vercel + GitHub Actions**.
      * **Database Management:** **Supabase CLI** for "Database as Code".

-----

#### **2. Application Architecture**

The application will be a **Single Page Application (SPA)**. A modular architecture is mandatory.

##### **2.1. Project Structure**

The recommended project directory structure is as follows:

```
/
├── public/
│   └── (static assets, e.g., favicon.ico)
├── supabase/
│   ├── migrations/
│   │   └── V1__initial_schema.sql  <-- The 'database as code' file
│   └── config.toml
├── src/
│   ├── components/              <-- UI Modules (e.g., Navbar.js, Card.js, PCForm.js)
│   ├── services/                <-- API communication modules (e.g., supabaseService.js)
│   ├── state/                   <-- Application state management (store.js)
│   ├── styles/                  <-- CSS files (e.g., main.css, components.css)
│   ├── utils/                   <-- Helper functions (e.g., formatters.js, validators.js)
│   └── main.js                  <-- Main application entry point
├── .env.local                   <-- Environment variables (Supabase keys)
├── index.html                   <-- Root HTML file
├── package.json
└── vite.config.js
```

##### **2.2. State Management**

A central state object will be defined in `src/state/store.js`. This will be the single source of truth for the application's data.

  * **Reactivity:** A simple publish/subscribe pattern will be implemented. Changes to the state will trigger re-rendering of relevant UI components.
  * **State Structure:**
    ```javascript
    export const state = {
        currentPage: 'dashboard',
        pcs: [],
        quotes: [],
        activities: [],
        resources: [],
        priceLists: [],
        isLoading: false,
        error: null,
    };
    ```

-----

#### **3. Database Definition (Supabase)**

The database schema will be managed entirely through code using the **Supabase CLI**. This ensures consistency across environments.

##### **3.1. Table Schema**

The following SQL schema must be placed in a migration file (e.g., `supabase/migrations/V1__initial_schema.sql`). All monetary values are stored as `DECIMAL` for precision. All timestamps are stored with a time zone.

```sql
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
```

##### **3.2. Migration Management (Supabase CLI)**

The AI Developer must use the following workflow to manage the database schema:

1.  **Install Supabase CLI:** `npm i supabase --save-dev`
2.  **Login:** `npx supabase login`
3.  **Link Project:** `npx supabase link --project-ref <YOUR_PROJECT_REF>`
4.  **Create Migration File:** `npx supabase migration new "initial_schema"`
5.  **Add SQL:** Copy the schema above into the new migration file.
6.  **Push to Database:** `npx supabase db push`

-----

#### **4. Core Business Logic & Workflows**

This section details the required business logic inferred from the provided application files, tailored to the **UK office relocations industry**. All financial values are assumed to be in **Pounds Sterling (GBP)**.

##### **4.1. The PC Number ("Job File") Lifecycle**

  * **Concept:** A "PC Number" is the **central record** for any client project or engagement. It must be created before any quotes or activities can be logged.
  * **Creation:** A new PC Number is assigned a unique, sequential identifier (e.g., `PC-000001`). It must contain, at a minimum, a **Company Name** and **Project Name**.
  * **Data:** It serves as the single source of truth for client details, project scope, and key contacts/addresses (both collection and delivery).
  * **Relation:** It is the parent record for all associated Quotes and Activities. The UI must reflect this hierarchy (e.g., viewing a PC Number shows a list of its quotes).

##### **4.2. The Quoting Workflow**

This is a multi-step process for generating a client-facing quote.

1.  **Prerequisite:** A Quote **must** be associated with an existing PC Number. The UI should prompt the user to select a PC Number before starting a new quote.
2.  **Price List Selection:** The user **must** select an *active* `Price List`. This list dictates the available resources and their `clientPrice`.
3.  **Line Item Addition:**
      * The user adds items to the quote from the resources available in the selected `Price List`.
      * Items are grouped by category (`human`, `vehicles`, `materials`, `other`).
      * The system calculates the total for each line (`clientPrice` x `quantity`).
4.  **Special Costs & Credits:**
      * **Other Costs:** The user can add arbitrary one-off costs with a description and amount.
      * **Recycling Charges:** The system must allow for calculating environmental charges based on weight (kg) for "General" and "POPS" materials, using a per-tonne rate.
      * **Rebates:** The system must allow for calculating credits for returned items (e.g., furniture, IT equipment) based on weight and a specified rate per tonne.
5.  **Financial Calculation:** The system **must** automatically calculate the final quote value in the following order:
      * `Subtotal` = (Sum of all line items) + (Sum of other costs) + (Sum of recycling charges) - (Sum of rebates).
      * `Net Total` = `Subtotal` - (`Discount %` of `Subtotal`).
      * `VAT Amount` = `VAT Rate %` of `Net Total`. The VAT rate should be configurable, defaulting to the UK standard (20%).
      * `Grand Total` = `Net Total` + `VAT Amount`.
6.  **Versioning & Status:**
      * Each quote has a version number, incrementing for each new quote created for the same PC Number.
      * Quotes have a status (`Draft`, `Sent`, `Approved`, `Rejected`) that can be updated.
7.  **PDF Generation:** The system must be able to generate a professional, client-facing PDF document of the final quote.

##### **4.3. The Activity & Scheduling Workflow**

1.  **Prerequisite:** An Activity (a schedulable task) **must** be linked to a specific `Quote`.
2.  **Data Inheritance:** When creating an activity, it should automatically inherit client and address information from its parent PC Number.
3.  **Resource Assignment:** The user assigns specific resources (e.g., "Porter x 2", "Van 3.5t x 1") required for the task. The UI should facilitate this by suggesting resources from the parent quote.
4.  **Scheduling:** Each activity has a specific date and set of times (Depot Start, On Site Start, etc.), which are used to populate the Calendar view.

##### **4.4. Resource & Pricing Logic**

  * The `resources` table defines the company's internal **costs** for every service or item.
  * The `price_lists` table defines the customer-facing **prices** for those resources. This separation is crucial for managing profitability and offering different rates to different clients.
  * **Workflow:** A quote is built using a `Price List`, not directly from base resource costs.

-----

#### **5. Development Workflow & CI/CD**

  * **Project Setup:** The developer will set up the project using `npm create vite@latest`.
  * **Environment Variables:** Supabase URL and Anon Key will be stored in a `.env.local` file (which is git-ignored) and configured in the Vercel project settings.
    ```
    VITE_SUPABASE_URL="https://your-project.supabase.co"
    VITE_SUPABASE_ANON_KEY="your-anon-key"
    ```
  * **Git Workflow:**
    1.  Create feature branches from `develop` (e.g., `feature/pc-form`).
    2.  Make commits on the feature branch.
    3.  Open a Pull Request (PR) from the feature branch to `develop`.
    4.  Vercel will create a Preview Deployment for the PR for testing.
    5.  After review, merge the PR into `develop`.
    6.  To release to production, create a PR from `develop` to `main`.
    7.  Merging into `main` will trigger a Production Deployment on Vercel.

-----

#### **6. Summary for the AI Developer**

Your task is to implement the CRM application as specified. You will build a modular frontend using Vanilla JS and Vite, connecting to a Supabase backend. The database schema must be managed via the Supabase CLI. The application must implement the detailed business logic and workflows described above. The development and deployment process will be automated through a Git workflow integrated with Vercel.

Proceed with the implementation following the sections of this document in order. This specification is designed to be your complete blueprint.