import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  developer?: {
    name?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const Footer: React.FC<FooterProps> = ({ developer }) => {
  const currentYear = new Date().getFullYear();
  const name = developer?.name || 'Shoaib Shaikh';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 border-t border-white/10 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-300">
              Made with <Heart className="text-red-500" size={16} /> by {name}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {developer?.github && (
              <a
                href={developer.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {developer?.linkedin && (
              <a
                href={developer.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Linkedin size={20} />
              </a>
            )}
            {developer?.email && (
              <a
                href={`mailto:${developer.email}`}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Mail size={20} />
              </a>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors duration-200"
          >
            <ArrowUp size={20} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
