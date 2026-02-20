import { Mail, Instagram, Linkedin, Send } from 'lucide-react';
import { useState } from 'react';
import { submitContactMessage } from '../lib/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSending(true);

    try {
      await submitContactMessage(formData);
      setStatusMessage('Message sent successfully. I will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Failed to send message';
      setStatusMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-24 bg-beige dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-dark dark:text-slate-100 mb-4">
            Get in Touch
          </h2>
          <div className="w-16 h-1 bg-sage mx-auto rounded-full mb-6"></div>
          <p className="text-text-dark/70 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            Ready to bring your vision to life? Let's create something amazing together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-display font-bold text-text-dark dark:text-slate-100 mb-8">Connect With Me</h3>

            <div className="space-y-6">
              <a
                href="mailto:samidires12@gmail.com"
                className="flex items-center gap-4 text-text-dark dark:text-slate-100 hover:text-sage transition-colors group"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-sage transition-colors shadow-elegant">
                  <Mail className="w-6 h-6 text-taupe group-hover:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark dark:text-slate-100">Email</p>
                  <p className="text-sm text-text-dark/60 dark:text-slate-400">samidires12@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/samuel-dires/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B4jFec5d%2BTKGppkZtaRzt7g%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-text-dark dark:text-slate-100 hover:text-sage transition-colors group"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-sage transition-colors shadow-elegant">
                  <Linkedin className="w-6 h-6 text-taupe group-hover:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark dark:text-slate-100">LinkedIn</p>
                  <p className="text-sm text-text-dark/60 dark:text-slate-400">Samuel Dires</p>
                </div>
              </a>

              <a
                href="https://instagram.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-text-dark dark:text-slate-100 hover:text-sage transition-colors group"
              >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-sage transition-colors shadow-elegant">
                  <Instagram className="w-6 h-6 text-taupe group-hover:text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark dark:text-slate-100">Instagram</p>
                  <p className="text-sm text-text-dark/60 dark:text-slate-400">@yourusername</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-display font-bold text-text-dark dark:text-slate-100 mb-8">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {statusMessage && (
                <p className="text-sm font-semibold text-taupe">{statusMessage}</p>
              )}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-light dark:border-slate-700 rounded-lg text-text-dark dark:text-slate-100 placeholder-text-dark/40 dark:placeholder-slate-400 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
                  required
                  disabled={isSending}
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-light dark:border-slate-700 rounded-lg text-text-dark dark:text-slate-100 placeholder-text-dark/40 dark:placeholder-slate-400 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
                  required
                  disabled={isSending}
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-light dark:border-slate-700 rounded-lg text-text-dark dark:text-slate-100 placeholder-text-dark/40 dark:placeholder-slate-400 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors resize-none"
                  required
                  disabled={isSending}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-sage text-text-dark rounded-lg font-semibold hover:bg-taupe hover:text-white transition-all shadow-elegant hover:shadow-elevated flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
