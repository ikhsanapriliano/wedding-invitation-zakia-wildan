export interface RSVP {
  id?: string;
  name: string;
  attendance: 'hadir' | 'tidak_hadir';
  guestsCount: number;
  phoneNumber: string;
  createdAt: any; // Firestore Timestamp
  checkedIn?: boolean;
  checkInTime?: any; // Firestore Timestamp
}

export interface GuestMessage {
  id?: string;
  name: string;
  text: string;
  createdAt: any; // Firestore Timestamp
}
