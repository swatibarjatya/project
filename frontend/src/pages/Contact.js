import React, { useState } from 'react';

import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    content: '',
    mail: '',
    active: false,
  });

  const handleSubmit = (e) => {
    if (formData.content !== '' && formData.mail !== '') {
      e.preventDefault();
      setFormData({
        ...formData,
        content: '',
        mail: '',
        active: !formData.active,
      });
    } else {
      alert('Your form is empty!');
    }
  };

  return (
    <>
      <form className='form' onSubmit={handleSubmit}>
        <label className='form_header' htmlFor='textarea'>
          {' '}
          Contact us:
        </label>
        <textarea
          className='form_textarea'
          name='textarea'
          id='textarea'
          cols='30'
          rows='10'
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        ></textarea>
        <label htmlFor='mail'>Type your e-mail address:</label>
        <input
          className='form_mail'
          placeholder='name@example.com'
          type='email'
          name='mail'
          id='mail'
          value={formData.mail}
          onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
        />
        <input className='form_button' type='submit' value='Send' />
        {formData.active ? (
          <p className='form_comment'>Form sent properly. Thank you!</p>
        ) : null}
      </form>
    </>
  );
}

export default Contact;
