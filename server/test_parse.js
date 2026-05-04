// Using global fetch


async function test() {
  const tokenRes = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: `test${Date.now()}@test.com`, password: 'password' })
  });
  const { token } = await tokenRes.json();

  const formData = new FormData();
  formData.append('resume', new Blob(['John Doe\nExperience\nDeveloper at Google\nEducation\nMIT\nSkills\nReact, Node.js'], { type: 'text/plain' }), 'resume.txt');

  const res = await fetch('http://localhost:5000/api/ai/parse', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  console.log(res.status);
  console.log(await res.text());
}
test();
