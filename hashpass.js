const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "pakistan@1"; // 🔥 change this anytime

  const hashed = await bcrypt.hash(password, 10);

  console.log("Plain Password:", password);
  console.log("Hashed Password:", hashed);
}

hashPassword();