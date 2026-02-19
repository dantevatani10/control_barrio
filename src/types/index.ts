export type Role = 'admin' | 'guard' | 'owner' | 'tenant' | 'resident';

export interface Profile {
  id: string;
  community_id: string;
  user_id: string;
  role: Role;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email?: string; // Added for UI display
  photo_url?: string; // Added for UI
  date_of_birth?: string; // Phase 10: Parent Control
  can_invite_guests?: boolean; // Phase 10: Computed from age
  unit_id?: string; // Added to link to unit
  check_in?: string; // For Guard: shift start
  shift?: 'Mañana' | 'Tarde' | 'Noche'; // For Guard
  created_at: string;
}

export type UnitStatus = 'up_to_date' | 'debt';

export interface Unit {
  id: string;
  community_id: string;
  unit_number: string;
  status: UnitStatus;
  owner_id?: string;
  tenant_id?: string;
  contacts?: {
    name: string;
    phone: string;
    priority: 'primary' | 'secondary' | 'emergency';
  }[];
  residents?: {
    name: string;
    role: Role;
    id?: string;
  }[];
}

export interface Vehicle {
  id: string;
  profile_id: string;
  unit_id?: string; // Easy lookup for admin
  community_id: string;
  brand: string;
  model: string;
  year?: string;
  color: string;
  license_plate: string;
  type?: 'car' | 'motorcycle' | 'truck';
}

export type WorkerRole = 'painter' | 'gardener' | 'mason' | 'plumber' | 'electrician' | 'other' | 'delivery';

export interface Worker {
  id: string;
  community_id: string;
  first_name: string;
  last_name: string;
  dni: string;
  role: WorkerRole;
  photo_url?: string;
}

export type InsuranceStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface InsuranceDoc {
  id: string;
  worker_id: string;
  community_id: string;
  file_url: string;
  status: InsuranceStatus;
  expiry_date: string;
  rejection_reason?: string; // Added for Admin flow
  last_updated: string;
}

export interface WorkAuthorization {
  id: string;
  worker_id: string;
  unit_id: string;
  community_id: string;
  start_date: string;
  end_date: string;
  start_time?: string; // HH:mm
  end_time?: string;   // HH:mm
  access_type: 'single' | 'range';
  status: 'active' | 'expired' | 'revoked';
}

export type InvitationType = 'single' | 'range' | 'event';
export type InvitationStatus = 'active' | 'used' | 'expired';

export interface Invitation {
  id: string;
  unit_id?: string; // Made optional or we link via profile
  profile_id?: string; // Added to link to host directly
  community_id: string;
  guest_name: string;
  guest_dni?: string;
  type: InvitationType;
  plate?: string;
  valid_from: string;
  valid_to: string;
  status: InvitationStatus;
  qr_token?: string; // Made optional for manual invites
  created_by_profile_id?: string; // Phase 9: For targeted notifications
}

export interface AccessLog {
  id: string;
  community_id: string;
  actor_name: string; // Guard name
  timestamp: string;
  method: 'qr' | 'manual' | 'remote';
  is_forced_entry: boolean;
  forced_reason?: string;
  details: {
    guest_name: string;
    guest_dni?: string;
    unit: string;
    vehicle_plate?: string;
    direction: 'in' | 'out';
  };
  exit_time?: string | null; // Added for Exit Control logic
}
