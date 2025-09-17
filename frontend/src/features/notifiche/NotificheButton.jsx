import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { requestNotificationPermissionAndToken } from './notifications';
import { postTokenNotifiche } from '../../api/notifiche';

export default function NotificheButton({ uid, ruolo, initialChecked = false, onChange }) {
  const [enabled, setEnabled] = useState(!!initialChecked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEnabled(!!initialChecked);
  }, [initialChecked]);

  const handleToggle = useCallback(async (e) => {
    const next = e.target.checked;

    try {
      if (next) {
        if (!uid || !ruolo) {
          console.warn('uid e ruolo mancanti');
          e.preventDefault();
          return;
        }

        setLoading(true);

        const token = await requestNotificationPermissionAndToken();

        if (!token) {
          setEnabled(false);
          onChange?.(false, null);
          console.log("Errore nell'abilitazione del token");
          return;
        }

        await postTokenNotifiche(uid, ruolo, token);

        setEnabled(true);
        onChange?.(true, token);
      } else {
        setEnabled(false);
        onChange?.(false, null);
      }
    } finally {
      setLoading(false);
    }
  }, [uid, ruolo, onChange]);

  return (
    <Form.Check
      type="switch"
      id="id-notifiche"
      className="switch-lg"
      checked={enabled}
      onChange={handleToggle}
      disabled={loading}
    />
  );
}
