'use client';

import { useState, useEffect } from 'react';
import { MapPin, Check, Loader2, LogOut } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/constants';

const HQ_LATITUDE = 6.6313272;
const HQ_LONGITUDE = 3.3549024;
const GEOFENCE_RADIUS_METERS = 500;

function isWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radiusMeters: number): boolean {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= radiusMeters;
}

function getNigeriaHour(): number {
  const now = new Date();
  return new Date(now.getTime() + 1 * 60 * 60 * 1000).getUTCHours();
}

export function ClockInButton() {
  const [status, setStatus] = useState<'idle' | 'clocked_in' | 'clocked_out'>('idle');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [canClockOut, setCanClockOut] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = getToken();
        if (!token) { setChecking(false); return; }
        const res = await fetch(`${API_BASE_URL}/attendance/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.clockedOut) setStatus('clocked_out');
          else if (data.clockedIn) setStatus('clocked_in');
        }
      } catch {} finally { setChecking(false); }
    };
    checkStatus();

    const checkTime = () => setCanClockOut(getNigeriaHour() >= 13);
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = async () => {
    if (status !== 'idle' || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 0,
        });
      });
      const { latitude, longitude } = position.coords;

      if (!isWithinRadius(latitude, longitude, HQ_LATITUDE, HQ_LONGITUDE, GEOFENCE_RADIUS_METERS)) {
        setMessage("You're not at church");
        setTimeout(() => setMessage(null), 3000);
        setLoading(false);
        return;
      }

      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/attendance/clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (res.ok) {
        setStatus('clocked_in');
      } else {
        const data = await res.json();
        if (data.message?.includes('Already clocked in')) setStatus('clocked_in');
        else { setMessage(data.message || 'Clock-in failed'); setTimeout(() => setMessage(null), 3000); }
      }
    } catch (err: any) {
      if (err?.code === 1) setMessage('Location access denied');
      else if (err?.code === 2) setMessage('Location unavailable');
      else if (err?.code === 3) setMessage('Location timed out');
      else setMessage('Clock-in failed');
      setTimeout(() => setMessage(null), 3000);
    } finally { setLoading(false); }
  };

  const handleClockOut = async () => {
    if (status !== 'clocked_in' || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/attendance/clock-out`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatus('clocked_out');
      } else {
        const data = await res.json();
        setMessage(data.message || 'Clock-out failed');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setMessage('Clock-out failed');
      setTimeout(() => setMessage(null), 3000);
    } finally { setLoading(false); }
  };

  if (checking) return null;

  const handleClick = () => {
    if (status === 'idle') handleClockIn();
    else if (status === 'clocked_in' && canClockOut) handleClockOut();
  };

  const getButtonStyle = () => {
    if (status === 'clocked_out') return 'bg-surface text-text-tertiary cursor-default';
    if (status === 'clocked_in' && canClockOut) return 'bg-coral text-white hover:bg-coral/90 cursor-pointer';
    if (status === 'clocked_in') return 'bg-[#E6F7F1] text-[#0D9668] cursor-default';
    return 'bg-[#4A1572] text-white hover:bg-[#3B1060] cursor-pointer';
  };

  const getLabel = () => {
    if (loading) return 'Locating...';
    if (status === 'clocked_out') return 'Done';
    if (status === 'clocked_in' && canClockOut) return 'Clock out';
    if (status === 'clocked_in') return 'Clocked in';
    return 'Clock in';
  };

  const getIcon = () => {
    if (loading) return <Loader2 size={12} className="animate-spin" />;
    if (status === 'clocked_out') return <Check size={12} />;
    if (status === 'clocked_in' && canClockOut) return <LogOut size={12} />;
    if (status === 'clocked_in') return <Check size={12} />;
    return <MapPin size={12} />;
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={loading || status === 'clocked_out' || (status === 'clocked_in' && !canClockOut)}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${getButtonStyle()}`}
      >
        {getIcon()}
        {getLabel()}
      </button>
      {message && (
        <div className="absolute top-full right-0 mt-1 px-3 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg whitespace-nowrap z-50 shadow-lg">
          {message}
        </div>
      )}
    </div>
  );
}
