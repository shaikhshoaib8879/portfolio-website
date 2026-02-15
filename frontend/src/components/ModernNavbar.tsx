import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Menu, X, Home, User, Code, Briefcase, Mail, Download, Github, Linkedin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ModernNavbarProps {
  developer?: any;
}

const ModernNavbar: React.FC<ModernNavbarProps> = ({ developer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const controls = useAnimation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'about', label: 'About', icon: User, path: '/about' },
    { id: 'skills', label: 'Skills', icon: Code, path: '/skills' },
    { id: 'projects', label: 'Projects', icon: Briefcase, path: '/projects' },
    { id: 'experience', label: 'Experience', icon: Briefcase, path: '/experience' },
    { id: 'contact', label: 'Contact', icon: Mail, path: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);

      // Update active section based on scroll position
      if (location.pathname === '/') {
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
          }
          return false;
        });
        
        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection);
          // Update URL without navigating
          window.history.replaceState(null, '', `/#${currentSection}`);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, location.pathname]);

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const handleNavigation = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false);
    
    if (location.pathname === '/' && item.id !== 'home') {
      // Smooth scroll to section on home page
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(item.id);
        window.history.replaceState(null, '', `/#${item.id}`);
      }
    } else if (item.path) {
      // Navigate to different route
      navigate(item.path);
      setActiveSection(item.id);
    }
  };

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-md border-b border-white/10 shadow-xl' 
            : 'bg-transparent'
        }`}
        variants={navbarVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              variants={logoVariants}
            >
              <motion.div
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 5,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
                }}
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-white font-bold text-lg lg:text-xl">
                  {developer?.name?.charAt(0) || 'S'}
                </span>
                
                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-transparent"
                  animate={{
                    borderColor: [
                      'transparent',
                      'rgba(59, 130, 246, 0.5)',
                      'rgba(139, 92, 246, 0.5)',
                      'rgba(16, 185, 129, 0.5)',
                      'transparent'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                className="hidden sm:block"
                whileHover={{ x: 5 }}
              >
                <h1 className="text-white font-bold text-lg lg:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {developer?.name || 'Shoaib Shaikh'}
                </h1>
                <p className="text-gray-400 text-sm">{developer?.title || 'Software Engineer'}</p>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              className="hidden lg:flex items-center space-x-1"
              variants={itemVariants}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id || 
                  (location.pathname !== '/' && location.pathname === item.path);
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavigation(item)}
                    className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'text-white bg-white/10 backdrop-blur-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        layoutId="activeIndicator"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Social Links & CTA (Desktop) */}
            <motion.div
              className="hidden lg:flex items-center gap-4"
              variants={itemVariants}
            >
              {/* Social Links */}
              <div className="flex items-center gap-2">
                <motion.a
                  href={developer?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href={developer?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>

              {/* Resume Download */}
              <motion.a
                href={developer?.resume_url || '#'}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Resume
              </motion.a>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`lg:hidden overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
          }`}
          initial={false}
          animate={{
            maxHeight: isMobileMenuOpen ? 400 : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-900/98 backdrop-blur-md border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Navigation Items */}
              <div className="space-y-2 mb-6">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id || 
                    (location.pathname !== '/' && location.pathname === item.path);
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: isMobileMenuOpen ? 1 : 0,
                        x: isMobileMenuOpen ? 0 : -20
                      }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                      
                      {isActive && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile Social Links & CTA */}
              <motion.div
                className="flex items-center justify-between pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isMobileMenuOpen ? 1 : 0,
                  y: isMobileMenuOpen ? 0 : 20
                }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <motion.a
                    href={developer?.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  
                  <motion.a
                    href={developer?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>

                <motion.a
                  href={developer?.resume_url || '#'}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Resume
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default ModernNavbar;
