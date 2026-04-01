// generateHash.js
import bcrypt from 'bcryptjs';

// Replace with the password you want for your admin
const password = 'Pakistan@1';

async function generateHash() {
  const hash = await bcrypt.hash(password, 10); // 10 is the salt rounds
  console.log('Your hashed password is:', hash);
}

generateHash();