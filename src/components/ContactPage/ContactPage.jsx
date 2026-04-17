import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    
    if (!name || !email || !subject || !message) return;

    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    
    const mailtoLink = `mailto:aiclub@oriental.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
  };
  return (
    <>
      <div className="contact-wrap">
        <div className="contact-container">
          <div className="contact-left">
            <h1 className="contact-title">Get in Touch</h1>
            <h3 className="contact-subtitle">Let’s build something amazing together</h3>
            <p className="contact-desc">
              Join the largest tech community at OIST. Whether you have a groundbreaking project idea, want to collaborate, or just want to say hi, we'd love to hear from you.
            </p>
            <div className="contact-email-box">
              <span className="email-label">Email Us</span>
              <a href="mailto:aiclub@oriental.ac.in" className="email-link">aiclub@oriental.ac.in</a>
            </div>
          </div>
          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="text" id="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="email" id="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <input type="text" id="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <textarea id="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
