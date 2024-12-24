import express from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';




// Use import.meta.url to get the directory name of the current module
const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(3);
console.log(__dirname)
// Construct the path to the data.json file
const filePath = path.join(__dirname, 'data.json');  // Fix the path
console.log(filePath)
const app = express();
const PORT = 5000;


// Path to the log file
const logFilePath = path.join(__dirname, 'log.txt');

// Utility function to log actions with timestamp
const logAction = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  // Append the log message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

// JWT secret key
const JWT_SECRET = 'your_jwt_secret_key';  // Replace with your own secret key

// Enable CORS
app.use(cors());

// Body parser middleware to handle JSON payloads
app.use(bodyParser.json());

// Register route (already implemented)
app.post('/register', (req, res) => {
    const { username,lastname, email, password } = req.body;
  
    // Check if email already exists in the users list
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.log('Error reading file:', readErr);
        return res.status(500).json({ message: 'Error reading file' });
      }
  
      let users = [];
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        console.log('Error parsing data. Initializing empty array.');
      }
  
      // Initialize users as an empty array if parsing fails
      if (!Array.isArray(users)) {
        users = [];
      }
  
      // Check if the email already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // Hash password before saving to file
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'Error hashing password' });
        }
  
        const user = {
          username,
          email,
          password: hashedPassword,
        };
  
        // Add new user to the array
        users.push(user);
  
        // Write updated users to the file
        fs.writeFile(filePath, JSON.stringify(users, null, 2), (writeErr) => {
          if (writeErr) {
            console.log('Error writing to file:', writeErr);
            return res.status(500).json({ message: 'Error writing to file' });
          }

          logAction(`New user registered: ${username}, Email: ${email}`);
          res.status(200).json({ message: 'User registered successfully' });
        });
      });
    });
  });
  

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Read existing file contents
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.log('Error reading file:', readErr);
        return res.status(500).json({ message: 'Error reading file' });
      }
  
      let users = [];
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        console.log('Error parsing data.');
      }
  
      // Find user by email
      const user = users.find(u => u.email === email);
  
      if (!user) {
        logAction(`User tried to log in but email not found: ${email}`);
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare password with hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          logAction(`User tried to log in but error during compare: ${email}`);
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
  
        if (!isMatch) {
          logAction(`User tried to log in but passwords do not match: ${email}`);
          return res.status(400).json({ message: 'Invalid credentials' });
        }
  
        // Create JWT token
        const token = jwt.sign(
          { username: user.username, email: user.email },
          JWT_SECRET,
          { expiresIn: '1h' }  // Set token expiration time
        );
        const username = user.username
        // Send token in response

        logAction(`User logged in: ${username}, Email: ${email}`);
        res.status(200).json({
          message: 'Login successful',
          token,  // Send token to frontend
          username,
        });
      });
    });
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
