const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost/orders-app/server' : 
   (typeof window !== 'undefined' && window.location.host !== 'localhost:3000' ? 'https://artisbay.com/orders-app' : 'http://localhost/orders-app/server'));

export const fetchAdmins = async () => {
  const res = await fetch(`${API_BASE}/api.php?action=fetch`);
  if (!res.ok) throw new Error('Failed to fetch admins');
  return res.json();
};

export const addAdmin = async (name) => {
  const res = await fetch(`${API_BASE}/api.php?action=add_admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to add admin');
  return res.json();
};

export const addOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/api.php?action=add_order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error('Failed to add order');
  return res.json();
};
