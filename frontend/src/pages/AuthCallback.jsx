import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const match = location.hash.match(/session_id=([^&]+)/);
    if (!match) { navigate('/'); return; }
    const session_id = match[1];
    (async () => {
      try {
        const { data } = await api.post('/auth/session', { session_id });
        setUser(data.user);
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/library', { state: { user: data.user } });
      } catch (e) {
        navigate('/');
      }
    })();
  }, [location.hash, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-neutral-500 text-[14px]">Signing you in...</div>
    </div>
  );
}
