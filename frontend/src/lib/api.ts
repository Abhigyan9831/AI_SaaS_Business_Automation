const API_URL = '';

const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pont_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const api = {
  async register(data: any) {
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      return json;
    } else {
      const text = await res.text();
      throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}...`);
    }
  },

  async login(data: any) {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createTask(type: string, payload: any) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type, payload }),
    });
    return res.json();
  },

  async getTasks() {
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getUsage() {
    const res = await fetch(`${API_URL}/api/usage`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async ingestKB(filename: string, content: string) {
    const res = await fetch(`${API_URL}/api/kb/ingest`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ filename, content }),
    });
    return res.json();
  },

  async getCheckoutUrl(planId: string, period: string = 'quarterly') {
    const res = await fetch(`${API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId, period }),
    });
    return res.json();
  },

  async getPaymentHistory() {
    const res = await fetch(`${API_URL}/api/payments/history`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  }
};
