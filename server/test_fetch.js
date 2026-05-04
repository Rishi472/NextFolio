import fs from 'fs';

async function test() {
  try {
    const resAuth = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Demo User', email: `demo${Date.now()}@example.com`, password: 'password123' })
    });
    const authData = await resAuth.json();
    console.log('Auth:', authData);

    const token = authData.token;

    const fileBuffer = fs.readFileSync('./dummy.txt');
    const blob = new Blob([fileBuffer], { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('resume', blob, 'dummy.txt');

    const resParse = await fetch('http://localhost:5000/api/ai/parse', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const parseData = await resParse.json();
    console.log('Parse:', parseData);
  } catch (err) {
    console.error(err);
  }
}
test();
