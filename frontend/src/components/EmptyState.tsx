import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Database, Folder, Code, User, Mail, Briefcase } from 'lucide-react';

interface EmptyStateProps {
  type: 'skills' | 'projects' | 'experience' | 'developer' | 'contact' | 'general';
  title?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  title, 
  description, 
  showRetry = false, 
  onRetry 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'skills':
        return Code;
      case 'projects':
        return Folder;
      case 'experience':
        return Briefcase;
      case 'developer':
        return User;
      case 'contact':
        return Mail;
      default:
        return Database;
    }
  };

  const getDefaultContent = () => {
    switch (type) {
      case 'skills':
        return {
          title: 'No Skills Found',
          description: 'No skills data is available at the moment.'
        };
      case 'projects':
        return {
          title: 'No Projects Found',
          description: 'No projects are available to display.'
        };
      case 'experience':
        return {
          title: 'No Experience Found',
          description: 'No work experience data is available.'
        };
      case 'developer':
        return {
          title: 'Developer Info Unavailable',
          description: 'Developer information could not be loaded.'
        };
      case 'contact':
        return {
          title: 'Contact Unavailable',
          description: 'Contact form is currently unavailable.'
        };
      default:
        return {
          title: 'No Data Available',
          description: 'The requested data is currently unavailable.'
        };
    }
  };

  const IconComponent = getIcon();
  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-4">
          <IconComponent className="w-10 h-10 text-gray-300" />
        </div>
        <motion.div
          className="absolute inset-0 w-20 h-20 border-2 border-gray-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-gray-200 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {displayTitle}
      </motion.h3>

      <motion.p
        className="text-gray-400 mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {displayDescription}
      </motion.p>

      {showRetry && onRetry && (
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          onClick={onRetry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      )}

      {/* Floating particles for visual appeal */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-600/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;
