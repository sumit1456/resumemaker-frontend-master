import React from 'react';
import UIEditor from './UIEditor';

/**
 * EditorPage - Route-safe wrapper for UIEditor
 * This component prevents React Router DOM manipulation conflicts
 * Use THIS component in your routes, not UIEditor directly
 */
const EditorPage = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 100,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      isolation: 'isolate', // Creates new stacking context
      zIndex: 1
    }}>
      <UIEditor />
    </div>
  );
};

export default EditorPage;