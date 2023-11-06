import mysql2 from 'mysql2';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'demo2',
});

function generateUniqueVerificationToken() {
  const tokenLength = 16; 
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'naseefnaseefvkd2@gmail.com', 
    pass: 'qyzy isyk ynnr wyyd', 
  },
});

function sendVerificationEmail(toEmail, verificationLink) {
  const mailOptions = {
    from: 'naseefnaseefvkd2@gmail.com',
    to: toEmail,
    subject: 'Email Verification',
    html: `<p>You have created an account in Edumetrix.<br> Click the following link to verify your email address:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email verification error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.post('/login', (req, res) => {
  const sql = "Select * from login where username = ? and password = ? and verified = 1";
  db.query(sql, [req.body.username, req.body.password], (err, data) => {
    console.log('Data from DB:', data); 
    if (err)
        return res.json({ Message: "server side error" })
    if (data.length > 0) {
        const name = data[0].username;
        return res.json({ Status: 'success' })
    } else {
        return res.json({ Message: "No record Existed" })
    }
  });
});

app.post('/verify-email', (req, res) => {
  const userEmail = req.body.email;

  const verificationToken = generateUniqueVerificationToken(); 
  const verificationLink = 'http://localhost:3000/verify/' + verificationToken; 

  const sql = "INSERT INTO login (`username`, `password`, `email`, `verification_token`) VALUES (?, ?, ?, ?)";
  const values = [req.body.username, req.body.password, req.body.email, verificationToken];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "An error occurred while inserting data" });
    }

    sendVerificationEmail(userEmail, verificationLink);
    res.status(200).json({ message: 'Verification email sent' });
  });
});

app.get('/verify/:token', (req, res) => {
  const token = req.params.token;
  const sql = "SELECT * FROM login WHERE verification_token = ?";
  db.query(sql, [token], (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (data.length === 0) {
      res.status(404).json({ message: 'Verification failed' });
    } else {
      const updateSql = "UPDATE login SET verified = 1 WHERE verification_token = ?";
      db.query(updateSql, [token], (updateErr) => {
        if (updateErr) {
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'Verification successful' });
        }
      });
    }
  });
});

app.listen(8081, () => {
  console.log('Server is running on port 8081');
});
