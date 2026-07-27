import React from 'react';
import { motion } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-backdrop" />
      <div className="loader-content">
        <motion.div 
          className="cyber-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
        <div className="loader-title">INITIALIZING SENTRY-IO</div>
        <div className="loader-subtitle">Securing local interface nodes...</div>
      </div>
    </div>
  );
};

export default Loader;