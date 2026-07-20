'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function VisitorTracker() {
  useEffect(() => {
    const tracked = sessionStorage.getItem('visitor_tracked');
    if (tracked) return;

    const track = async () => {
      try {
        await getSupabase().from('visitors').insert({});
        sessionStorage.setItem('visitor_tracked', 'true');
      } catch {
        // silent
      }
    };
    track();
  }, []);

  return null;
}