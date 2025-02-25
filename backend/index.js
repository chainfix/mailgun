const express = require('express');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);

app.post('/api/send-email', async (req, res) => {
  const { apiKey, domain, from, to, subject, text } = req.body;
  
  const mg = mailgun.client({
    username: 'api',
    key: apiKey,
  });

  try {
    const result = await mg.messages.create(domain, {
      from,
      to,
      subject,
      text,
      'o:testmode': 'yes',
      'o:tag': ['test'],
      'h:X-Mailgun-Variables': JSON.stringify({
        test: true
      })
    });
    res.json({ success: true, message: '邮件发送成功！', result });
  } catch (error) {
    console.error('Mailgun error:', error);
    res.status(500).json({ 
      success: false, 
      message: '邮件发送失败！', 
      error: error.message,
      details: error.details || {}
    });
  }
});

// Vercel 需要导出 app
module.exports = app; 