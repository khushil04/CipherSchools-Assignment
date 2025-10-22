import React, { useState } from 'react';
import { X } from 'lucide-react';
import Login from './Login';
import Register from './Register';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button
          className="auth-modal-close"
          onClick={onClose}
          type="button"
        >
          <X size={24} />
        </button>
        
        {isLogin ? (
          <Login onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
