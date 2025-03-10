// create-admin.js
const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config(); // If you're using environment variables

async function createAdmin() {
  // Admin credentials
  const adminUser = {
    username: 'john_doe',
    email: 'john_doe@example.com',
    password: 'heyoo', // Change this to a secure password
    security_question: 'What is your favorite color?', // Customize as needed
    security_answer: 'blue' // Change this to your answer
  };

  // Create password and security answer hashes
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminUser.password, saltRounds);
  const securityAnswerHash = await bcrypt.hash(adminUser.security_answer, saltRounds);

  // Connect to the database
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'fashion_ecommerce'
  });

  try {
    // Insert the admin user
    console.log("Creating admin user...");
    const query = 
      "INSERT INTO administrator (username, email, password_hash, security_question, security_answer_hash) VALUES (?, ?, ?, ?, ?)";
    
    const [result] = await connection.query(query, [
      adminUser.username,
      adminUser.email,
      passwordHash,
      adminUser.security_question,
      securityAnswerHash
    ]);

    console.log('Admin user created successfully!');
    console.log('Admin ID:', result.insertId);
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('Please keep your password safe.');
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await connection.end();
  }
}

createAdmin().catch(console.error);