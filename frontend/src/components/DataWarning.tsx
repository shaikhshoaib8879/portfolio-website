import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DataWarningProps {
  missingData: string[];
  onDismiss: () => void;
}

const DataWarning: React.FC<DataWarningProps> = ({ missingData, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 bg-yellow-500/10 backdrop-blur-lg border border-yellow-500/20 rounded-lg p-4 max-w-sm"
      initial={{ opacity: 0, x: 100, y: -50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-yellow-200 font-medium mb-1">Some Data Unavailable</h4>
          <p className="text-yellow-300/80 text-sm mb-2">
            Some sections may have limited content:
          </p>
          <ul className="text-yellow-300/70 text-xs space-y-1">
            {missingData.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleDismiss}
          className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default DataWarning;
