const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1, role: 'MAHASISWA' }, 'dialajar-lms-secret-key-telkom-2026', { expiresIn: '1d' });
console.log(token);
