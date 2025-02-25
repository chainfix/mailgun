const express = require('express');
const cors = require('cors');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};

module.exports = handler; 