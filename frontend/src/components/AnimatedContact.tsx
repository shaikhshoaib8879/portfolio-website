import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Linkedin, Github, CheckCircle, AlertCircle, Coffee } from 'lucide-react';
import { sendContactMessage } from '../utils/api';

interface AnimatedContactProps {
  developer: any;
  onSubmit?: (data: any) => Promise<void>;
}

const AnimatedContact: React.FC<AnimatedContactProps> = ({ developer, onSubmit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Your name helps me know who I\'m talking to! ✨';
    if (!formData.email.trim()) {
      newErrors.email = 'I need your email to get back to you! 📧';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Looks like there\'s a typo in that email 🤔';
    }
    if (!formData.subject.trim()) newErrors.subject = 'What\'s this message about? 💭';
    if (!formData.message.trim()) newErrors.message = 'Don\'t be shy, tell me what\'s on your mind! 💬';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Send email via API
        const response = await sendContactMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Failed to send contact form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen py-20 overflow-hidden flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #0e1628 75%, #0a0a0a 100%)
        `
      }}
    >
      {/* Main Container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            Let's Create Magic Together ✨
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Ready to turn your wildest ideas into extraordinary digital experiences? 
            Let's collaborate and build something that will blow minds! 🚀
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Contact Info & Visual */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Contact Cards */}
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email Me', value: developer?.email || 'shoaib@example.com', color: '#667eea' },
                { icon: Phone, label: 'Call Me', value: developer?.phone || '+1 (555) 123-4567', color: '#f093fb' },
                { icon: MapPin, label: 'Meet Me', value: developer?.location || 'San Francisco, CA', color: '#4facfe' },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="group relative p-6 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.2 }}
                    onClick={() => {
                      if (item.label === 'Email Me') window.open(`mailto:${item.value}`);
                      if (item.label === 'Call Me') window.open(`tel:${item.value}`);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="p-3 rounded-full"
                        style={{ backgroundColor: `${item.color}20` }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent size={24} style={{ color: item.color }} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.label}</h3>
                        <p className="text-gray-400">{item.value}</p>
                      </div>
                    </div>
                    
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"
                      style={{
                        background: `radial-gradient(circle at center, ${item.color} 0%, transparent 70%)`
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 }}
            >
              {[
                { icon: Github, url: developer?.github, color: '#667eea' },
                { icon: Linkedin, url: developer?.linkedin, color: '#4facfe' },
                { icon: Coffee, url: `mailto:${developer?.email}?subject=Let's grab coffee!`, color: '#f093fb' }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/20 hover:border-purple-400/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotateZ: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconComponent size={24} style={{ color: social.color }} />
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"
                      style={{
                        background: `radial-gradient(circle, ${social.color} 0%, transparent 70%)`
                      }}
                    />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Side - Revolutionary Contact Form */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {/* Form Container */}
            <motion.form
              onSubmit={handleSubmit}
              className="relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
            >
              {/* Magical glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)"
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10 space-y-6">
                {/* Form Fields */}
                {[
                  { name: 'name', label: 'Your Name', type: 'text', icon: '👋', placeholder: 'What should I call you?' },
                  { name: 'email', label: 'Email Address', type: 'email', icon: '📧', placeholder: 'your.awesome@email.com' },
                  { name: 'subject', label: 'Subject', type: 'text', icon: '💭', placeholder: 'What\'s this about?' },
                ].map((field) => (
                  <motion.div 
                    key={field.name}
                    className="relative"
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.label
                      className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        focusedField === field.name ? 'text-purple-400' : 'text-gray-300'
                      }`}
                    >
                      {field.icon} {field.label}
                    </motion.label>
                    
                    <motion.input
                      type={field.type}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      className={`w-full p-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent ${
                        errors[field.name] ? 'border-red-400/50' : focusedField === field.name ? 'border-purple-400/50' : 'border-white/20'
                      }`}
                      whileFocus={{ scale: 1.02 }}
                    />
                    
                    {errors[field.name] && (
                      <motion.p
                        className="mt-2 text-sm text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle size={16} />
                        {errors[field.name]}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                {/* Message Field */}
                <motion.div className="relative" whileTap={{ scale: 0.98 }}>
                  <motion.label
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                      focusedField === 'message' ? 'text-purple-400' : 'text-gray-300'
                    }`}
                  >
                    💬 Your Message
                  </motion.label>
                  
                  <motion.textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell me about your amazing project ideas! ✨"
                    rows={4}
                    className={`w-full p-4 bg-white/5 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-transparent resize-none ${
                      errors.message ? 'border-red-400/50' : focusedField === 'message' ? 'border-purple-400/50' : 'border-white/20'
                    }`}
                    whileFocus={{ scale: 1.02 }}
                  />
                  
                  {errors.message && (
                    <motion.p
                      className="mt-2 text-sm text-red-400 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={16} />
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative w-full p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl font-semibold text-white shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={status !== 'loading' ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                  whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  
                  <span className="relative flex items-center justify-center gap-2">
                    {status === 'loading' ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending Magic...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Send Message 🚀
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Status Messages */}
                {status === 'success' && (
                  <motion.div
                    className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-center backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Awesome! Your message is on its way! 🎉</p>
                    <p className="text-sm opacity-75 mt-1">I'll get back to you faster than you can say "React hooks"!</p>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl text-red-400 text-center backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">Oops! Something went wrong 🤔</p>
                    <p className="text-sm opacity-75 mt-1">No worries though - shoot me an email directly!</p>
                  </motion.div>
                )}
              </div>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default AnimatedContact;
