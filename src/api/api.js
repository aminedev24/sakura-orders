const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost/orders-app/server' : 
   (typeof window !== 'undefined' && window.location.host !== 'localhost:3000' ? 'https://artisbay.com/orders-app' : 'http://localhost/orders-app/server'));

export const fetchAdmins = async () => {
  try {
    const res = await fetch(`${API_BASE}/api.php?action=fetch`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

export const addAdmin = async (name) => {
  const res = await fetch(`${API_BASE}/api.php?action=add_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add admin');
  }
  return res.json();
};

export const addOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/api.php?action=add_order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add order');
  }
  return res.json();
};

export const updateAdmin = async (id, name) => {
  const res = await fetch(`${API_BASE}/api.php?action=update_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update admin');
  }
  return res.json();
};

export const deleteAdmin = async (id) => {
  const res = await fetch(`${API_BASE}/api.php?action=delete_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete admin');
  }
  return res.json();
};

export const updateOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/api.php?action=update_order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update order');
  }
  return res.json();
};

export const deleteOrder = async (id) => {
  const res = await fetch(`${API_BASE}/api.php?action=delete_order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete order');
  }
  return res.json();
};

export const addReturn = async (returnData) => {
  const res = await fetch(`${API_BASE}/api.php?action=add_return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(returnData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to add return');
  }
  return res.json();
};
