import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const loaderVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  exit: { scale: 0.8, opacity: 0 }
};

const Loader = () => {
  return (
    <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000bb]"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="relative w-20 h-20"
            variants={loaderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-white" />
            </motion.div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
