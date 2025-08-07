import { useEffect, useState, useRef, RefObject } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface ScrollAnimationReturn {
  ref: RefObject<HTMLDivElement>;
  isInView: boolean;
  hasBeenInView: boolean;
  progress: number;
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): ScrollAnimationReturn => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting;
          
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(inView);
              if (inView && !hasBeenInView) {
                setHasBeenInView(true);
              }
              setProgress(entry.intersectionRatio);
            }, delay);
          } else {
            setIsInView(inView);
            if (inView && !hasBeenInView) {
              setHasBeenInView(true);
            }
            setProgress(entry.intersectionRatio);
          }

          if (triggerOnce && inView) {
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasBeenInView]);

  return {
    ref,
    isInView: triggerOnce ? hasBeenInView : isInView,
    hasBeenInView,
    progress
  };
};

// Hook for staggered animations
export const useStaggeredAnimation = (count: number, delay: number = 0.1) => {
  const [triggeredItems, setTriggeredItems] = useState<boolean[]>(
    new Array(count).fill(false)
  );

  const triggerItem = (index: number) => {
    setTimeout(() => {
      setTriggeredItems(prev => {
        const newItems = [...prev];
        newItems[index] = true;
        return newItems;
      });
    }, index * delay * 1000);
  };

  const triggerAll = () => {
    for (let i = 0; i < count; i++) {
      triggerItem(i);
    }
  };

  const reset = () => {
    setTriggeredItems(new Array(count).fill(false));
  };

  return {
    triggeredItems,
    triggerAll,
    triggerItem,
    reset
  };
};

// Hook for scroll progress
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

// Hook for mouse tracking with smooth interpolation
export const useMouseTracker = (smoothing: number = 0.1) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * smoothing,
        y: prev.y + (mousePosition.y - prev.y) * smoothing,
      }));
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mousePosition, smoothing]);

  return { mousePosition, smoothPosition };
};

// Hook for viewport dimensions with debouncing
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        setViewport({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewport;
};

// Hook for prefered color scheme
export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return colorScheme;
};

export default useScrollAnimation;
