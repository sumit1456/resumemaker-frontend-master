import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const MessageOverlay = ({ message, type = 'info', onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      color: '#22c55e',
      title: 'Success'
    },
    error: {
      icon: XCircle,
      color: '#ef4444',
      title: 'Error'
    },
    info: {
      icon: Info,
      color: '#3b82f6',
      title: 'Info'
    },
    warning: {
      icon: AlertCircle,
      color: '#f59e0b',
      title: 'Warning'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.1s ease-out'
    }}>
      <div style={{
        background: '#1a1a1a',
        borderRadius: '16px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${config.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'scaleIn 0.4s ease-out'
        }}>
          <Icon style={{ 
            width: '40px', 
            height: '40px', 
            color: config.color,
            strokeWidth: 2.5
          }} />
        </div>
        
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h3 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>{config.title}</h3>
          
          <p style={{
            fontSize: '16px',
            color: '#b0b0b0',
            margin: 0,
            lineHeight: '1.5'
          }}>{message}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[0, 0.6, 0.9].map((delay, i) => (
            <span key={i} style={{
              width: '8px',
              height: '8px',
              background: config.color,
              borderRadius: '50%',
              animation: `bounce 1.2s ease-in-out infinite`,
              animationDelay: `${delay}s`,
              opacity: 0.7
            }}></span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            transform: translateY(30px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from { 
            transform: scale(0);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.3;
          }
          40% { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const MessageContainer = () => {
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    const showMessage = (message, type = 'info', duration = 2000) => {
      setCurrentMessage({ message, type });
      
      setTimeout(() => {
        setCurrentMessage(null);
      }, duration);
    };

    window.showMessage = showMessage;
    
    return () => {
      delete window.showMessage;
    };
  }, []);

  if (!currentMessage) return null;

  return (
    <MessageOverlay
      message={currentMessage.message}
      type={currentMessage.type}
      onClose={() => setCurrentMessage(null)}
    />
  );
};

export default MessageContainer;