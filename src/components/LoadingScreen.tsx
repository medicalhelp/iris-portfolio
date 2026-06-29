'use client';
export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    }}>
      <div style={{
        width: '2px',
        height: '40px',
        background: 'rgba(255,255,255,0.15)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: scaleY(0.6); }
          50% { opacity: 0.6; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
