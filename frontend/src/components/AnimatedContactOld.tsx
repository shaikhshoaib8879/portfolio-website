import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Linkedin, Github, CheckCircle, AlertCircle, Coffee, MessageSquare, Sparkles, Zap, Heart, Star } from 'lucide-react';

interface AnimatedContactProps {
  developer: any;
  onSubmit?: (data: any) => Promise<void>;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  icon: React.ComponentType<any>;
}

const AnimatedContact: React.FC<AnimatedContactProps> = ({ developer, onSubmit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  // Floating particles
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Initialize floating particles
  useEffect(() => {
    const particleIcons = [Mail, Coffee, MessageSquare, Heart, Star, Sparkles, Zap];
    const newParticles: FloatingParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 16 + Math.random() * 16,
      speed: 0.5 + Math.random() * 1,
      color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'][Math.floor(Math.random() * 6)],
      icon: particleIcons[Math.floor(Math.random() * particleIcons.length)]
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => {
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const attraction = 30 / (distance + 1);
        
        return {
          ...particle,
          x: (particle.x + particle.speed + dx * attraction * 0.005) % window.innerWidth,
          y: (particle.y + particle.speed * 0.7 + dy * attraction * 0.005) % window.innerHeight,
        };
      }));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [mousePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [mouseX, mouseY]);

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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: developer?.email,
      href: `mailto:${developer?.email}`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: developer?.phone,
      href: `tel:${developer?.phone}`,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: developer?.location,
      href: '#',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: developer?.linkedin,
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'View my code',
      href: developer?.github,
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: Coffee,
      label: 'Coffee Chat',
      value: "Let's grab a coffee!",
      href: `mailto:${developer?.email}?subject=Coffee Chat`,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-black via-gray-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          y: [0, -80, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Let's Work Together
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Have a project in mind? Looking for a skilled developer to join your team? 
            Let's discuss how I can help bring your ideas to life.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Contact Information */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            <div className="space-y-6">
              <motion.h3 
                className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
                whileHover={{ x: 10 }}
              >
                <MessageSquare className="w-8 h-8 text-blue-400" />
                Get In Touch
              </motion.h3>

              {/* Contact Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      target={item.href?.startsWith('http') ? '_blank' : undefined}
                      rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 block`}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      animate={index % 2 === 0 ? floatingAnimation : { ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 3 } }}
                    >
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                          {item.label}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability Status */}
            <motion.div
              className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20"
              variants={itemVariants}
              animate={{
                borderColor: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.2)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="w-3 h-3 bg-emerald-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-emerald-400 font-semibold">Available for new opportunities</span>
              </div>
              <p className="text-gray-300 text-sm">
                Currently open to freelance projects and full-time positions. 
                Response time: Usually within 24 hours.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            variants={itemVariants}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Name Input */}
              <div>
                <label className="block text-white font-medium mb-2">Name *</label>
                <motion.input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Your full name"
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.name && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-white font-medium mb-2">Email *</label>
                <motion.input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="your.email@example.com"
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.email && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Subject Input */}
              <div>
                <label className="block text-white font-medium mb-2">Subject *</label>
                <motion.input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full p-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.subject 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="What's this about?"
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.subject && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.subject}
                  </motion.p>
                )}
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-white font-medium mb-2">Message *</label>
                <motion.textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={`w-full p-4 bg-white/10 backdrop-blur-sm border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Tell me about your project or how I can help..."
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.message && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  status === 'loading'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : status === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : status === 'error'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white`}
                whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
              >
                {status === 'loading' && (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
                {status === 'success' && <CheckCircle className="w-5 h-5" />}
                {status === 'error' && <AlertCircle className="w-5 h-5" />}
                {status === 'idle' && <Send className="w-5 h-5" />}
                
                {status === 'loading' && 'Sending Message...'}
                {status === 'success' && 'Message Sent!'}
                {status === 'error' && 'Failed to Send'}
                {status === 'idle' && 'Send Message'}
              </motion.button>

              {/* Success/Error Messages */}
              {status === 'success' && (
                <motion.div
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Thanks for reaching out! I'll get back to you soon.
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Something went wrong. Please try again or contact me directly.
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedContact;
