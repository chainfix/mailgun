import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    apiKey: '',
    domain: '',
    from: '',
    to: '',
    subject: '',
    text: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('发送中...');

    try {
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('发送成功！');
      } else {
        setStatus(`发送失败：${data.message}\n${data.error || ''}`);
      }
    } catch (error) {
      setStatus('发送失败：' + error.message);
    }
  };

  return (
    <div className="App">
      <h1>Mailgun 邮件发送器</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mailgun API Key:</label>
          <input
            type="password"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Domain:</label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>发件人:</label>
          <input
            type="email"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>收件人:</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>主题:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>内容:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">发送邮件</button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default App; 