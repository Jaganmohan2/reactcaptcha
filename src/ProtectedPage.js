import React, { useState } from 'react';
import API_BASE_URL from "./config";

function ProtectedPage() {
  const [message, setMessage] = useState('');

  async function callProtected() {
    setMessage('Calling protected API...');

    try {
      const res = await fetch(`${API_BASE_URL}/api/protected`, {
        credentials: 'include'
      });

      if (res.ok) {
        const text = await res.text();
        setMessage(text);
        return;
      }

    
    } catch (e) {
      setMessage('Error: ' + e.message);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Protected Page</h2>

      <button onClick={callProtected}>
        Call Protected API
      </button>

      {message && (
        <p style={{ marginTop: 12 }}>{message}</p>
      )}
    </div>
  );
}

export default ProtectedPage;
