-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 
-- 1. Tablas Core
--

-- Communities
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles (Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'guard', 'owner', 'tenant')) NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units (Lotes/Departamentos)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    unit_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(community_id, unit_number)
);

-- Vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL, -- Denormalized for RLS performance
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    color TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--
-- 2. Gestión de Trabajadores
--

-- Workers (Uniques per community)
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dni TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g. 'painter', 'gardener'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(community_id, dni)
);

-- Insurance Documents (ART)
CREATE TABLE insurance_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL, -- Denormalized
    file_url TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'expired')) DEFAULT 'pending',
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Authorizations (Relation N-N)
CREATE TABLE work_authorizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL, -- Denormalized
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

--
-- 3. Invitaciones y Accesos
--

-- Invitations
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL, -- Denormalized
    guest_name TEXT NOT NULL,
    guest_dni TEXT,
    type TEXT CHECK (type IN ('single', 'range')) NOT NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('active', 'used', 'expired')) DEFAULT 'active',
    qr_token UUID DEFAULT uuid_generate_v4(), -- Token to be scanned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Logs
CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    actor_name TEXT NOT NULL, -- Guard name or system
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method TEXT NOT NULL, -- 'qr', 'manual', 'remote'
    is_forced_entry BOOLEAN DEFAULT FALSE,
    forced_reason TEXT,
    details JSONB DEFAULT '{}'::jsonb -- Store snapshots of entry data
);

--
-- ROW LEVEL SECURITY (RLS) POLICIES
--

-- Helper function to get the current user's community_id
CREATE OR REPLACE FUNCTION get_user_community_id()
RETURNS UUID AS $$
    SELECT community_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- 1. Communities
-- Users can view their own community
CREATE POLICY "Users can view their own community" ON communities
    FOR SELECT USING (id = get_user_community_id());

-- 2. Profiles
-- Users can view profiles in their community
CREATE POLICY "Users can view profiles in their community" ON profiles
    FOR SELECT USING (community_id = get_user_community_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- 3. Units
CREATE POLICY "Users can view units in their community" ON units
    FOR SELECT USING (community_id = get_user_community_id());

-- 4. Vehicles
CREATE POLICY "Users can view vehicles in their community" ON vehicles
    FOR SELECT USING (community_id = get_user_community_id());
    
CREATE POLICY "Owners can manage their vehicles" ON vehicles
    FOR ALL USING (profile_id = auth.uid());

-- 5. Workers
CREATE POLICY "Users can view workers in their community" ON workers
    FOR SELECT USING (community_id = get_user_community_id());
    
CREATE POLICY "Admins/Guards can manage workers" ON workers
    FOR ALL USING (
        community_id = get_user_community_id() AND 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guard'))
    );

-- 6. Insurance Docs
CREATE POLICY "Users can view insurance docs in their community" ON insurance_docs
    FOR SELECT USING (community_id = get_user_community_id());

CREATE POLICY "Admins/Owners can upload insurance docs" ON insurance_docs
    FOR INSERT WITH CHECK (
        community_id = get_user_community_id() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
    );

CREATE POLICY "Admins can update insurance docs" ON insurance_docs
    FOR UPDATE USING (
        community_id = get_user_community_id() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 7. Work Authorizations
CREATE POLICY "Users can view work auths in their community" ON work_authorizations
    FOR SELECT USING (community_id = get_user_community_id());
    
CREATE POLICY "Owners can create work auths for their units" ON work_authorizations
    FOR INSERT WITH CHECK (
        community_id = get_user_community_id() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'owner') 
        -- Optimization: check if owner owns the unit in application logic or trigger
    );

-- 8. Invitations
CREATE POLICY "Users can view invitations in their community" ON invitations
    FOR SELECT USING (community_id = get_user_community_id());

CREATE POLICY "Owners can manage invitations" ON invitations
    FOR ALL USING (
        community_id = get_user_community_id() AND
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
        -- Further check: ensure owner owns the unit_id
    );

-- 9. Access Logs
CREATE POLICY "Users can view logs in their community" ON access_logs
    FOR SELECT USING (community_id = get_user_community_id());

CREATE POLICY "Guards/System can insert logs" ON access_logs
    FOR INSERT WITH CHECK (
        community_id = get_user_community_id() AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guard'))
    );

--
-- TRIGGER: Auto-expire insurance
--
CREATE OR REPLACE FUNCTION check_insurance_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiry_date < CURRENT_DATE THEN
        NEW.status := 'expired';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_insurance_expiry
BEFORE INSERT OR UPDATE ON insurance_docs
FOR EACH ROW EXECUTE FUNCTION check_insurance_expiry();

--
-- FUNCTION: Verify Access (Simplified Logic for Edge Function)
--
CREATE OR REPLACE FUNCTION verify_access(
    p_qr_token UUID, 
    p_community_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_invitation invitations%ROWTYPE;
BEGIN
    SELECT * INTO v_invitation 
    FROM invitations 
    WHERE qr_token = p_qr_token AND community_id = p_community_id;

    IF v_invitation IS NULL THEN
        RETURN jsonb_build_object('allowed', false, 'reason', 'Invalid Token');
    END IF;

    IF v_invitation.status != 'active' THEN
        RETURN jsonb_build_object('allowed', false, 'reason', 'Invitation not active');
    END IF;

    IF NOW() < v_invitation.valid_from OR NOW() > v_invitation.valid_to THEN
        RETURN jsonb_build_object('allowed', false, 'reason', 'Outside valid timeframe');
    END IF;

    RETURN jsonb_build_object(
        'allowed', true, 
        'guest_name', v_invitation.guest_name,
        'unit_id', v_invitation.unit_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
