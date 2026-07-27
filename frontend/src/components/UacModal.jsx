import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal, Check, X } from 'lucide-react';
import BorderGlow from '../components/BorderGlow';
import './UacModal.css';

const UacModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-container"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <BorderGlow borderRadius={16} glowColor="59, 130, 246" glowRadius={150}>
              <div className="uac-card">
                <div className="uac-header">
                  <ShieldAlert className="warning-icon" size={32} />
                  <h3>User Account Control</h3>
                </div>
                
                <div className="uac-body">
                  <p className="uac-main-text">
                    Do you want to allow this app to make changes to your device?
                  </p>
                  
                  <div className="app-info-block">
                    <p className="app-meta"><strong>Program name:</strong> Scapy Packet Capturing Engine</p>
                    <p className="app-meta"><strong>Publisher:</strong> Verified Local Administrator</p>
                    <p className="app-meta"><strong>File origin:</strong> Hard drive on this computer</p>
                  </div>

                  <div className="command-callout">
                    <Terminal size={14} className="terminal-icon" />
                    <span className="font-mono">scapy.all.sniff(prn=process, store=0)</span>
                  </div>

                  <p className="uac-note">
                    *Note: Active network packet capture interfaces require elevated physical sockets. Granting admin access will launch the sniffer thread immediately on your local computer.
                  </p>
                </div>

                <div className="uac-actions">
                  <button className="btn-confirm" onClick={onConfirm}>
                    <Check size={16} />
                    <span>Yes (Allow)</span>
                  </button>
                  <button className="btn-cancel" onClick={onClose}>
                    <X size={16} />
                    <span>No (Deny)</span>
                  </button>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UacModal;