import React, { ReactNode, useRef } from 'react';
import { motion, Variants, HTMLMotionProps, useInView } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useAnimations';

interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  distance?: number;
  stagger?: number;
  triggerOnce?: boolean;
  threshold?: number;
  className?: string;
}

// Pre-defined animation variants
const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  },
  slideDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  rotate: {
    hidden: { opacity: 0, rotate: -180 },
    visible: { opacity: 1, rotate: 0 }
  }
};

// Main animation wrapper component
export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  duration = 0.8,
  delay = 0,
  distance = 60,
  stagger = 0,
  triggerOnce = true,
  threshold = 0.1,
  className = '',
  ...motionProps
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Simplified margin approach to avoid type issues
  const marginOption = threshold > 0.5 ? "0px" : "0px 0px -20% 0px";
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    margin: marginOption
  });

  // Customize variants based on distance prop
  const customVariants = React.useMemo(() => {
    const baseVariant = animationVariants[animation];
    if (!baseVariant) return animationVariants.fadeIn;

    const customized = { ...baseVariant };
    
    if (animation.includes('slide')) {
      if (animation === 'slideUp' || animation === 'slideDown') {
        const yValue = animation === 'slideUp' ? distance : -distance;
        customized.hidden = { ...customized.hidden, y: yValue };
      } else if (animation === 'slideLeft' || animation === 'slideRight') {
        const xValue = animation === 'slideLeft' ? distance : -distance;
        customized.hidden = { ...customized.hidden, x: xValue };
      }
    }

    return customized;
  }, [animation, distance]);

  const transition = {
    duration,
    delay: stagger > 0 ? delay + stagger : delay,
    ease: [0.25, 0.25, 0.25, 0.75], // Custom easing
  };

  return (
    <motion.div
      ref={ref}
      variants={customVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={transition}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for multiple items
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  ...motionProps
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Item for staggered animations
interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'scale';
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  animation = 'slideUp',
  className = '',
  ...motionProps
}) => {
  const itemVariants: Variants = {
    hidden: animationVariants[animation].hidden,
    visible: {
      ...animationVariants[animation].visible,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Magnetic effect component
interface MagneticProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.3,
  className = '',
  ...motionProps
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// 3D Tilt effect component
interface Tilt3DProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  maxTilt?: number;
  perspective?: number;
  className?: string;
}

export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  maxTilt = 15,
  perspective = 1000,
  className = '',
  ...motionProps
}) => {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / rect.height * maxTilt;
    const y = (e.clientX - rect.left - rect.width / 2) / rect.width * -maxTilt;
    setTilt({ x, y });
  };

  return (
    <motion.div
      className={className}
      style={{ perspective }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Parallax component
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [offsetY, setOffsetY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <motion.div
      className={className}
      style={{ y: offsetY }}
    >
      {children}
    </motion.div>
  );
};

// Floating animation component
interface FloatingProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  intensity = 10,
  duration = 3,
  className = '',
  ...motionProps
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Typewriter effect component
interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  cursor = true,
  onComplete
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else if (onComplete) {
        onComplete();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, speed, onComplete]);

  React.useEffect(() => {
    if (cursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(cursorInterval);
    }
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          className="inline-block w-0.5 h-1em bg-current ml-1"
        />
      )}
    </span>
  );
};

// Glitch effect component
interface GlitchProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export const Glitch: React.FC<GlitchProps> = ({
  children,
  intensity = 2,
  className = ''
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        x: [0, -intensity, intensity, 0],
        filter: [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(0deg)',
        ],
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export {
  animationVariants
};
