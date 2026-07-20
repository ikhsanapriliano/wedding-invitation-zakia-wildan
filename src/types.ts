export interface RSVP {
  id?: string;
  name: string;
  attendance: 'hadir' | 'tidak_hadir';
  guestsCount: number;
  phoneNumber: string;
  createdAt: string;
  checkedIn?: boolean;
  checkInTime?: string;
  waSent?: boolean;
  waSentCount?: number;
}

export interface GuestMessage {
  id?: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}