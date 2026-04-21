const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async register(data: any) {
    const res = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createTask(token: string, type: string, payload: any) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, payload }),
    });
    return res.json();
  },

  async getTasks(token: string) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  async getUsage(token: string) {
    const res = await fetch(`${API_URL}/api/usage`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  }
};
