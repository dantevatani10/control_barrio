import { Worker, InsuranceDoc, AccessLog, Invitation, Unit, Profile, Vehicle } from '@/types';

export const MOCK_COMMUNITY = {
    id: 'c1',
    name: 'Barrio Santa Clara',
    stats: {
        people_inside: 142,
        pending_docs: 3,
        visits_today: 45,
    }
};

// -- PROFILES --
export const MOCK_PROFILES: Profile[] = [
    {
        id: 'p_pedro', user_id: 'u_pedro', community_id: 'c1', role: 'owner', // Simplified role for MVP
        first_name: 'Pedro', last_name: 'Pérez',
        phone_number: '5491187654321',
        email: 'pedro.son@email.com',
        photo_url: 'https://i.pravatar.cc/150?u=pedro',
        date_of_birth: '2015-05-05', // 11 years old roughly in 2026
        can_invite_guests: false, // Too young
        created_at: new Date().toISOString()
    },
    {
        id: 'p2', community_id: 'c1', user_id: 'u2', role: 'tenant',
        first_name: 'Ana', last_name: 'Martínez', email: 'ana@email.com',
        date_of_birth: '1990-05-15', // 34 years old
        can_invite_guests: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'p3', community_id: 'c1', user_id: 'u3', role: 'admin',
        first_name: 'Admin', last_name: 'General', email: 'admin@santaclara.com',
        created_at: new Date().toISOString()
    },
    {
        id: 'p4', community_id: 'c1', user_id: 'u4', role: 'guard',
        first_name: 'Carlos', last_name: 'Sánchez', email: 'guardia1@santaclara.com',
        created_at: new Date(Date.now() - 10000000).toISOString()
    },
    {
        id: 'p5', community_id: 'c1', user_id: 'u5', role: 'guard',
        first_name: 'Miguel', last_name: 'Torres', email: 'guardia2@santaclara.com',
        created_at: new Date(Date.now() - 5000000).toISOString()
    }
];

// -- UNITS --
export const MOCK_UNITS: Unit[] = [
    { id: 'u101', community_id: 'c1', unit_number: 'Lote 101', status: 'up_to_date', owner_id: 'p1', tenant_id: 'p2' },
    { id: 'u102', community_id: 'c1', unit_number: 'Lote 102', status: 'debt', owner_id: 'p1' }, // Roberto owns this too, but it has debt
    { id: 'u103', community_id: 'c1', unit_number: 'Lote 103', status: 'up_to_date' },
];

// -- VEHICLES --
export const MOCK_VEHICLES: Vehicle[] = [
    { id: 'v1', profile_id: 'p1', community_id: 'c1', brand: 'Toyota', model: 'Corolla', color: 'Gris', license_plate: 'AA 123 BB' },
    { id: 'v2', profile_id: 'p2', community_id: 'c1', brand: 'Honda', model: 'Civic', color: 'Blanco', license_plate: 'CC 456 DD' },
];

// -- WORKERS --
export const MOCK_WORKERS: Worker[] = [
    { id: 'w1', community_id: 'c1', first_name: 'Juan', last_name: 'Pérez', dni: '20.111.111', role: 'painter' },
    { id: 'w2', community_id: 'c1', first_name: 'Carlos', last_name: 'López', dni: '20.222.222', role: 'gardener' },
    { id: 'w3', community_id: 'c1', first_name: 'Luis', last_name: 'Díaz', dni: '20.333.333', role: 'mason' },
    // New Phase 7 Workers
    { id: 'w4', community_id: 'c1', first_name: 'Pedro', last_name: 'Pintor', dni: '20.444.444', role: 'painter' },
    { id: 'w5', community_id: 'c1', first_name: 'Mario', last_name: 'Plomero', dni: '20.555.555', role: 'plumber' },
];

// -- WORK AUTHORIZATIONS --
export const MOCK_WORK_AUTHORIZATIONS: import('@/types').WorkAuthorization[] = [
    // Pedro Pintor: Active Range (1st to 30th of current month)
    {
        id: 'wa1', worker_id: 'w4', unit_id: 'u101', community_id: 'c1',
        access_type: 'range',
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
        start_time: '08:00', end_time: '17:00',
        status: 'active'
    },
    // Mario Plomero: Single Day (Today)
    {
        id: 'wa2', worker_id: 'w5', unit_id: 'u101', community_id: 'c1',
        access_type: 'single',
        start_date: new Date().toISOString(), // Today
        end_date: new Date().toISOString(),   // Today
        start_time: '09:00', end_time: '18:00',
        status: 'active'
    }
];

// -- INSURANCE --
export const MOCK_INSURANCE_DOCS: InsuranceDoc[] = [
    { id: 'i1', worker_id: 'w1', community_id: 'c1', file_url: '#', status: 'pending', expiry_date: '2025-12-31', last_updated: new Date().toISOString() },
    { id: 'i2', worker_id: 'w2', community_id: 'c1', file_url: '#', status: 'approved', expiry_date: '2026-06-30', last_updated: new Date().toISOString() },
    { id: 'i3', worker_id: 'w3', community_id: 'c1', file_url: '#', status: 'rejected', expiry_date: '2024-01-01', rejection_reason: 'Poliza vencida', last_updated: new Date().toISOString() },
];

// -- INVITATIONS --
export const MOCK_INVITATIONS: Invitation[] = [
    {
        id: 'inv1', community_id: 'c1', profile_id: 'p1', unit_id: 'u101',
        guest_name: 'Laura Vivas', guest_dni: '30.111.222',
        type: 'single', valid_from: new Date().toISOString(), valid_to: new Date(Date.now() + 86400000).toISOString(),
        status: 'active', plate: 'KTY 888'
    },
    {
        id: 'inv2', community_id: 'c1', profile_id: 'p2', unit_id: 'u101',
        guest_name: 'Pablo Echarri', guest_dni: '25.333.444',
        type: 'single', valid_from: new Date().toISOString(), valid_to: new Date(Date.now() + 86400000).toISOString(),
        status: 'active'
    },
    {
        id: 'inv3', community_id: 'c1', profile_id: 'p1', unit_id: 'u101',
        guest_name: 'Invito Vencido', guest_dni: '10.000.000',
        type: 'single', valid_from: new Date(Date.now() - 100000000).toISOString(), valid_to: new Date(Date.now() - 90000000).toISOString(),
        status: 'expired'
    }
];

// -- ACCESS LOGS (AUDIT) --
export const MOCK_LOGS: AccessLog[] = [
    // Active Visit (No exit time)
    {
        id: 'l1', community_id: 'c1', actor_name: 'Guardia Turno Tarde', timestamp: new Date(Date.now() - 300000).toISOString(),
        method: 'qr', is_forced_entry: false,
        details: { guest_name: 'Juan Pérez', unit: 'Lote 101', direction: 'in', guest_dni: '20.111.111' },
        exit_time: null
    },
    // Forced Entry (No exit time)
    {
        id: 'l2', community_id: 'c1', actor_name: 'Guardia Turno Tarde', timestamp: new Date(Date.now() - 3600000).toISOString(),
        method: 'manual', is_forced_entry: true, forced_reason: 'Scanner roto',
        details: { guest_name: 'Pedro (Delivery)', unit: 'Lote 102', direction: 'in', vehicle_plate: 'MOTO-123' },
        exit_time: null
    },
    // Active Resident Entry (Remote)
    {
        id: 'l3', community_id: 'c1', actor_name: 'Sistema', timestamp: new Date(Date.now() - 7200000).toISOString(),
        method: 'remote', is_forced_entry: false,
        details: { guest_name: 'Ana Martínez', unit: 'Lote 101', direction: 'in', vehicle_plate: 'CC 456 DD' },
        exit_time: null
    },
    // Closed Visit (Has exit time)
    {
        id: 'l4', community_id: 'c1', actor_name: 'Guardia Turno Mañana', timestamp: new Date(Date.now() - 10800000).toISOString(),
        method: 'qr', is_forced_entry: false,
        details: { guest_name: 'Carlos López', unit: 'Lote 103', direction: 'in' },
        exit_time: new Date(Date.now() - 9000000).toISOString()
    }
];

// Helper to get mock data tailored for the demo views
export const getAdminStats = () => MOCK_COMMUNITY.stats;
export const getPendingDocs = () => MOCK_INSURANCE_DOCS.filter(d => d.status === 'pending');
export const getLogHistory = () => MOCK_LOGS;
export const getUnits = () => MOCK_UNITS;
export const getGuards = () => MOCK_PROFILES.filter(p => p.role === 'guard');
