import React, { useRef } from "react";
import "./contact.css";

const ContactPage = () => {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct a mailto link so the user's default mail client opens with prefilled fields
    const form = formRef.current;
    const name = form.querySelector('input[type="text"]').value || '';
    const email = form.querySelector('input[type="email"]').value || '';
    // the second text input is the Subject
    const subject = form.querySelectorAll('input[type="text"]')[1]?.value || 'Contact from PrepMate AI';
    const message = form.querySelector('textarea')?.value || '';

    const fullSubject = `${subject}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailto = `mailto:khushishrivas82@gmail.com?subject=${encodeURIComponent(fullSubject)}&body=${body}`;

    // Open mail client. If popup blocked, show a fallback alert.
    try {
      window.location.href = mailto;
    } catch (err) {
      alert('Please send your message to khushishrivas82@gmail.com');
    }

    formRef.current.reset();
  };

  return (
    <section className="contact-section">
      <h1 className="contact-heading">Get in Touch with PrepMate AI</h1>
      <p className="contact-subtitle">
        Have questions or feedback? Reach out to us anytime.
      </p>

      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <input type="text" placeholder="Subject" />
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit" className="contact-btn">Send Message</button>
      </form>

      <div className="contact-details">
        <p>Email: <a href="mailto:khushishrivas82@gmail.com">khushishrivas82@gmail.com</a></p>
        <p>Instagram: <a href="https://instagram.com/prepmateai">@PrepMateAI</a></p>
      </div>
    </section>
  );
};

export default ContactPage;
