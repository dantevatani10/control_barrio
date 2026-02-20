import { Profile, Worker, Invitation, AccessLog, Unit, Vehicle, Role, UnitStatus, InvitationType, InvitationStatus, WorkerRole } from '@/types';
import seedData from '@/data/seed.json';

// Extension for Demo Worker with Schedule
export interface DemoWorker extends Worker {
    days?: number[];
    access_start?: string;
    access_end?: string;
    status: 'approved' | 'pending' | 'rejected';
    insurance_expiry?: string;
}

class MockService {
    private static instance: MockService;

    private community!: { stats: { visits_today: number } } & Record<string, unknown>;
    private users: Profile[] = [];
    private units: Unit[] = [];
    private workers: DemoWorker[] = [];
    private invitations: Invitation[] = [];
    private logs: AccessLog[] = [];
    private vehicles: Vehicle[] = []; // Add vehicles property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emergencies: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private notifications: any[] = [];

    private financialMetrics = {
        totalCollected: 25977841.40,
        totalDebt: 27547493.11,
        baseExpense: 283339.45,
        unidentifiedDeposits: 0,
        totalExpenses: 25883872.78
    };

    private constructor() {
        this.initialize();
    }

    public static getInstance(): MockService {
        if (!MockService.instance) {
            MockService.instance = new MockService();
        }
        return MockService.instance;
    }

    private initialize() {
        console.log("Initializing Mock Service with Seed Data...");
        this.community = seedData.community;

        // Map seed users to Profile type
        const seedUsers = seedData.users as (Profile & { name?: string, phone?: string })[];
        this.users = seedUsers.map(u => ({
            id: u.id,
            user_id: u.id, // For demo, user_id = profile_id
            community_id: 'c1',
            role: u.role as Role,
            // Handle both name and first_name/last_name formats for compatibility
            first_name: u.first_name || (u.name ? u.name.split(' ')[0] : 'User'),
            last_name: u.last_name || (u.name ? u.name.split(' ').slice(1).join(' ') : 'Demo'),
            email: u.email,
            photo_url: u.photo_url,
            date_of_birth: u.date_of_birth,
            can_invite_guests: u.can_invite_guests,
            phone: u.phone, // Map phone
            unit_id: u.unit_id, // Map unit_id
            created_at: new Date().toISOString()
        }));

        // Real lots from Barrio Santa Clara
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const realUnits: any[] = [
            { id: '2', number: 'UF 2', type: 'house', status: 'occupied', residentName: 'Tornquist, María G', debt: 393289.02 },
            { id: '3', number: 'UF 3', type: 'house', status: 'occupied', residentName: 'Lago, German', debt: 393595.03 },
            { id: '15', number: 'UF 15', type: 'house', status: 'occupied', residentName: 'García, Roberto', debt: 0.00 },
            { id: '24', number: 'UF 24', type: 'house', status: 'occupied', residentName: 'Martínez, Florencia', debt: 0.00 },
            { id: '60', number: 'UF 60', type: 'house', status: 'occupied', residentName: 'Vizzoco, Santiago', debt: 393192.60 },
            { id: '61', number: 'UF 61', type: 'house', status: 'occupied', residentName: 'Candau, María José', debt: 393283.61 },
            { id: '62', number: 'UF 62', type: 'house', status: 'construction', residentName: 'Departamentos (Consorcio)', debt: 716286.05 }
        ];
        const existingIds = realUnits.map(u => u.id);
        for (let i = 1; i <= 62; i++) {
            if (!existingIds.includes(i.toString())) {
                realUnits.push({
                    id: i.toString(),
                    number: `UF ${i}`,
                    type: 'house',
                    status: 'occupied',
                    residentName: `Familia Lote ${i}`,
                    debt: 0
                });
            }
        }
        realUnits.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        // Map to Unit type for compatibility
        this.units = realUnits.map(u => ({
            id: u.id,
            community_id: 'c1',
            unit_number: u.number,
            status: u.debt > 0 ? 'overdue' as UnitStatus : 'up_to_date' as UnitStatus,
            owner_id: 'owner1',
            tenant_id: 'tenant1',
            // Extended fields for financial display
            residentName: u.residentName,
            debt: u.debt,
            type: u.type,
            lotStatus: u.status
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any));

        this.invitations = seedData.invitations.map(i => ({
            id: i.id,
            community_id: 'c1',
            unit_id: i.unit_id,
            guest_name: i.guest_name,
            guest_dni: i.guest_dni,
            type: i.type as InvitationType,
            status: i.status as InvitationStatus,
            valid_from: i.valid_from,
            valid_to: i.valid_to,
            created_by_profile_id: i.created_by
        }));

        this.workers = seedData.workers.map(w => ({
            id: w.id,
            community_id: 'c1',
            first_name: w.first_name,
            last_name: w.last_name,
            dni: w.dni,
            role: w.role as WorkerRole,
            days: w.days,
            access_start: w.access_start,
            access_end: w.access_end,
            status: w.status as 'approved' | 'pending' | 'rejected',
            insurance_expiry: w.insurance_expiry
        }));

        // Initial Logs
        this.logs = seedData.logs.map(l => ({
            id: l.id,
            community_id: 'c1',
            actor_name: 'System', // Default
            timestamp: l.timestamp === 'TODAY' ? new Date().toISOString() : l.timestamp,
            method: 'manual',
            is_forced_entry: false,
            details: {
                guest_name: l.visitor_name,
                guest_dni: l.visitor_dni,
                unit: 'Lote 101', // Default
                direction: l.action === 'entry' ? 'in' : 'out'
            }
        }));
    }

    // --- GETTERS ---
    getUsers() { return this.users; }
    getUserById(id: string) { return this.users.find(u => u.id === id); }

    getUnits() { return this.units; }

    getInvitations() { return this.invitations; }
    getActiveInvitations() {
        return this.invitations.filter(i => i.status === 'active');
    }



    getVehicles() { return this.vehicles; }

    getInsuranceDoc(workerId: string) {
        // Return dummy data or filter from a new mock list if desired.
        // For now returning null or a mock object based on ID
        if (workerId === 'w1' || workerId === 'w4') {
            return {
                id: `ins-${workerId}`,
                worker_id: workerId,
                community_id: 'c1',
                file_url: '#',
                status: 'approved' as const,
                expiry_date: '2026-01-01',
                last_updated: new Date().toISOString()
            };
        }
        if (workerId === 'w3') {
            return {
                id: `ins-${workerId}`,
                worker_id: workerId,
                community_id: 'c1',
                file_url: '#',
                status: 'rejected' as const,
                expiry_date: '2024-01-01',
                rejection_reason: 'Poliza Vencida',
                last_updated: new Date().toISOString()
            };
        }
        return null;
    }

    getLogs() { return this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); }

    getStats() {
        // Calculate dynamic stats
        const peopleInside = this.getAllActiveVisits().length;

        // Visits today = Unique people who entered today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const visitsToday = this.logs.filter(l =>
            new Date(l.timestamp) >= startOfDay &&
            l.details.direction === 'in'
        ).length;

        // Fallback to seed if 0 (for demo impression)
        // If logs are empty, use seed. But logs are initialized from seed.
        return {
            people_inside: peopleInside,
            visits_today: visitsToday > 0 ? visitsToday : this.community.stats.visits_today
        };
    }

    async getDirectory() {
        // Filtra solo dueños e inquilinos, y devuelve datos útiles para el guardia
        return this.users
            .filter((u: Profile) => u.role === 'owner' || u.role === 'tenant')
            .map((u: Profile) => ({
                name: u.first_name + ' ' + u.last_name,
                unit: u.unit_id,
                phone: u.phone_number || 'Sin número',
                role: u.role === 'owner' ? 'Propietario' : 'Inquilino'
            }))
            .sort((a: { unit?: string }, b: { unit?: string }) => (a.unit || "").localeCompare(b.unit || ""));
    }

    getVisitsForToday(query: string) {
        if (!query) return [];
        const q = query.toLowerCase();

        // Filter invitations
        const invs = this.invitations.filter(i =>
            (i.guest_name.toLowerCase().includes(q) || (i.guest_dni && i.guest_dni.includes(q)) || (i.plate && i.plate.toLowerCase().includes(q))) &&
            i.status === 'active' &&
            new Date(i.valid_from) <= new Date() &&
            new Date(i.valid_to) >= new Date()
        ).map(i => ({
            id: i.id,
            type: 'invitation',
            name: i.guest_name,
            dni: i.guest_dni,
            unit: i.unit_id,
            plate: i.plate,
            status: 'valid'
        }));

        // Filter workers (simple logic for demo)
        const workers = this.workers.filter(w =>
            (w.first_name.toLowerCase().includes(q) || w.last_name.toLowerCase().includes(q) || w.dni.includes(q)) &&
            w.status === 'approved'
        ).map(w => ({
            id: w.id,
            type: 'worker',
            name: `${w.first_name} ${w.last_name}`,
            dni: w.dni,
            unit: 'Mantenimiento',
            status: 'valid'
        }));

        return [...invs, ...workers];
    }

    getAllActiveVisits() {
        // Return logs where action is 'entry' and no corresponding 'exit' (or just check filtered list in real app)
        // For this demo, we can just filter logs that don't have an exit time if we track that, 
        // OR we can just return a subset of logs that are recent "entries".
        // The prompt implies we need state. Let's filter logs that are "in" and have no "exit_time" property? 
        // My AccessLog type in seed doesn't explicit have exit_time, but ActiveMonitor was doing `l.exit_time === null`.
        // I need to ensure AccessLog type supports this or I add it.
        // Let's assume effectively "People Inside".
        return this.logs.filter(l => l.details.direction === 'in' && !l.exit_time);
    }

    recordExit(logId: string) {
        const logIndex = this.logs.findIndex(l => l.id === logId);
        if (logIndex !== -1) {
            // Update the log to show exit time (simulated)
            const log = this.logs[logIndex];
            log.exit_time = new Date().toISOString();

            // Allow creating a corresponding "Exit" log if desired for audit
            this.logEntry({
                actor_name: 'Guardia',
                method: 'manual',
                details: {
                    ...log.details,
                    direction: 'out'
                }
            });
            return true;
        }
        return false;
    }

    // --- ACTIONS ---

    login(role: string) {
        // Simulates login by finding the first user with that role
        return this.users.find(u => u.role === role);
    }

    createInvitation(invitation: Partial<Invitation>) {
        const newInv: Invitation = {
            id: `inv-${Date.now()}`,
            community_id: 'c1',
            status: 'active',
            guest_dni: invitation.guest_dni || 'UNKNOWN',
            type: 'single',
            valid_from: new Date().toISOString(),
            valid_to: new Date(Date.now() + 86400000).toISOString(),
            ...invitation
        } as Invitation;

        this.invitations.push(newInv);
        return newInv;
    }

    addWorker(worker: Partial<DemoWorker>) {
        const newWorker = {
            id: `w-${Date.now()}`,
            community_id: 'c1',
            status: 'pending',
            ...worker
        } as DemoWorker;
        this.workers.push(newWorker);
        return newWorker;
    }

    logEntry(entry: Partial<AccessLog>) {
        const newLog: AccessLog = {
            id: `log-${Date.now()}`,
            community_id: 'c1',
            timestamp: new Date().toISOString(),
            method: 'qr',
            is_forced_entry: false,
            actor_name: 'Guardia',
            ...entry
        } as AccessLog;
        this.logs.unshift(newLog); // Add to top
        return newLog;
    }

    createUnit(data: { unitNumber: string; residents: { name: string, role: Role }[]; contacts: { name: string, phone: string, priority: 'primary' | 'secondary' | 'emergency' }[]; vehicles?: Partial<Vehicle>[] }) {
        const newUnit: Unit = {
            id: `u-${Date.now()}`,
            community_id: 'c1',
            unit_number: data.unitNumber,
            status: 'up_to_date',
            contacts: data.contacts
        };

        this.units.push(newUnit);

        // Create Residents (existing logic...)
        data.residents.forEach(r => {
            const newProfile: Profile = {
                id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                user_id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                community_id: 'c1',
                role: r.role,
                first_name: r.name.split(' ')[0],
                last_name: r.name.split(' ').slice(1).join(' ') || '',
                created_at: new Date().toISOString(),
                unit_id: newUnit.unit_number
            };
            this.users.push(newProfile);
        });

        // Add Vehicles
        if (data.vehicles) {
            data.vehicles.forEach((v: Partial<Vehicle>) => {
                this.vehicles.push({
                    id: v.id || `v-${Date.now()}-${Math.random()}`,
                    unit_id: newUnit.unit_number,
                    community_id: 'c1',
                    profile_id: 'owner',
                    brand: v.brand || '',
                    model: v.model || '',
                    color: v.color || '',
                    license_plate: v.license_plate || '',
                    year: v.year || ''
                } as Vehicle);
            });
        }

        return newUnit;
    }

    // Specially requested helpers
    createVisit(data: Partial<Invitation>) {
        // Creates an "instant" invitation/visit record
        return this.createInvitation({
            guest_name: data.guest_name,
            guest_dni: data.guest_dni,
            unit_id: data.unit_id,
            status: 'active',
            type: 'single',
            valid_from: new Date().toISOString(),
            valid_to: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24h
            plate: data.plate
        });
    }

    recordEntry(data: Partial<AccessLog>) {
        const log = this.logEntry({
            ...data,
            details: {
                guest_name: data.details?.guest_name || 'Desconocido',
                unit: data.details?.unit || 'Sin unidad',
                direction: 'in',
                guest_dni: data.details?.guest_dni,
                vehicle_plate: data.details?.vehicle_plate
            }
        });

        // Auto-generate notification for resident
        this.notifications.push({
            id: `notif-${Date.now()}`,
            type: 'entry',
            message: `✅ INGRESO AUTORIZADO: ${data.details?.guest_name || 'Visitante'} acaba de ingresar a tu lote.`,
            unit: data.details?.unit || 'Sin unidad',
            timestamp: new Date().toISOString(),
            read: false
        });

        return log;
    }

    // --- WORKER MANAGEMENT ---
    getWorkers() { return this.workers; }

    updateWorkerStatus(id: string, status: 'approved' | 'rejected') {
        const worker = this.workers.find(w => w.id === id);
        if (worker) {
            worker.status = status;
        }
    }

    updateUnit(id: string, data: { unitNumber: string; vehicles?: Partial<Vehicle>[] }) {
        const unit = this.units.find(u => u.id === id);
        if (unit) {
            unit.unit_number = data.unitNumber;
            // Update residents logic...
            const currentResidents = this.users.filter(u => u.unit_id === unit.unit_number);
            currentResidents.forEach(u => u.unit_id = data.unitNumber);

            // Update Vehicles
            if (data.vehicles) {
                // Remove old vehicles for this unit
                this.vehicles = this.vehicles.filter(v => v.unit_id !== unit.unit_number);
                // Add new vehicles
                data.vehicles.forEach((v: Partial<Vehicle>) => {
                    this.vehicles.push({
                        id: v.id || `v-${Date.now()}-${Math.random()}`,
                        unit_id: data.unitNumber,
                        community_id: 'c1',
                        profile_id: 'worker', // Default or passed
                        brand: v.brand || '',
                        model: v.model || '',
                        color: v.color || '',
                        license_plate: v.license_plate || '',
                        year: v.year || ''
                    } as Vehicle);
                });
            }
        }
    }

    getVehiclesByUnit(unitNumber: string) {
        return this.vehicles.filter(v => v.unit_id === unitNumber);
    }

    // --- GUARD MANAGEMENT ---
    getGuards() { return this.users.filter(u => u.role === 'guard'); }

    // --- EMERGENCIES (S.O.S) ---
    async triggerEmergency(unitId: string, residentName: string, type: 'MEDICAL' | 'SECURITY') {
        const newEmergency = {
            id: Date.now().toString(),
            unitId,
            residentName,
            type,
            status: 'ACTIVE',
            timestamp: new Date().toISOString()
        };
        this.emergencies.push(newEmergency);
        return newEmergency;
    }

    async getActiveEmergencies() {
        return this.emergencies.filter(e => e.status === 'ACTIVE');
    }

    async resolveEmergency(id: string) {
        const emergency = this.emergencies.find(e => e.id === id);
        if (emergency) {
            emergency.status = 'RESOLVED';
            emergency.resolvedAt = new Date().toISOString();
            return true;
        }
        return false;
    }

    // --- NOTIFICATIONS ---
    async addNotification(unitId: string, title: string, message: string, type: 'success' | 'warning' | 'info') {
        const notif = {
            id: Date.now().toString(),
            unitId,
            title,
            message,
            type,
            read: false,
            timestamp: new Date().toISOString()
        };
        this.notifications.push(notif);
        return notif;
    }

    getNotifications() {
        return this.notifications.sort((a: { timestamp: string }, b: { timestamp: string }) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    getUnreadNotificationCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    async getUnreadNotifications(unitId: string) {
        return this.notifications.filter(n => n.unitId === unitId && !n.read);
    }

    markNotificationAsRead(id: string) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) notif.read = true;
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    getFinancialMetrics() {
        return this.financialMetrics;
    }

    async registerPackage(unitId: string, company: string, trackingInfo: string = '') {
        const title = '📦 Nuevo Paquete en Guardia';
        const message = `Tienes un paquete de ${company} esperando ser retirado. ${trackingInfo ? 'Ref: ' + trackingInfo : ''}`;
        const notif = await this.addNotification(unitId, title, message, 'info');
        return notif;
    }

    createGuard(data: { first_name: string; last_name: string; email: string; shift?: 'Mañana' | 'Tarde' | 'Noche' }) {
        const newGuard: Profile = {
            id: `g-${Date.now()}`,
            user_id: `u-${Date.now()}`,
            community_id: 'c1',
            role: 'guard',
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            shift: data.shift || 'Mañana',
            created_at: new Date().toISOString()
        };
        this.users.push(newGuard);
        return newGuard;
    }

    updateGuardShift(id: string, shift: 'Mañana' | 'Tarde' | 'Noche') {
        const guard = this.users.find(u => u.id === id);
        if (guard) {
            guard.shift = shift;
        }
    }

    // --- EXPORT ---
    // Returns full log history for CSV export
    getAllLogs() {
        return this.logs;
    }

    validateAccess(identifier: string): { valid: boolean; reason?: string; entity?: Invitation | DemoWorker } {
        // 1. Check Invitations (QR or DNI)
        const invitation = this.invitations.find(i => i.id === identifier || i.guest_dni === identifier);
        if (invitation) {
            if (invitation.status !== 'active') return { valid: false, reason: 'Invitación vencida o usada' };
            // Check Date (Simple version)
            const now = new Date();
            if (now < new Date(invitation.valid_from) || now > new Date(invitation.valid_to)) {
                return { valid: false, reason: 'Fuera de horario' };
            }
            return { valid: true, entity: invitation };
        }

        // 2. Check Workers
        const worker = this.workers.find(w => w.dni === identifier);
        if (worker) {
            if (worker.status !== 'approved') return { valid: false, reason: 'Seguro/ART No Aprobado' };

            // Check Days
            const today = new Date().getDay(); // 0 = Sunday
            // Adjust js day (0-6) to maybe seed day (1-7)? Assuming seed uses 1=Mon, 7=Sun or 0=Sun. 
            // Let's assume standard JS: 0=Sun, 1=Mon.
            // Seed example: [1,2,3,4,5] -> Mon-Fri.
            if (worker.days && !worker.days.includes(today)) {
                return { valid: false, reason: 'Día no permitido' };
            }

            // Check Hours
            if (worker.access_start && worker.access_end) {
                const nowHour = new Date().getHours();
                const start = parseInt(worker.access_start.split(':')[0]);
                const end = parseInt(worker.access_end.split(':')[0]);
                if (nowHour < start || nowHour >= end) {
                    return { valid: false, reason: 'Fuera de horario laboral' };
                }
            }

            return { valid: true, entity: worker };
        }

        return { valid: false, reason: 'No encontrado' };
    }
}

export const mockService = MockService.getInstance();
