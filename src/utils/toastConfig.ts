export const premiumToastOptions = {
  duration: 4000,
  style: {
    background: '#18181b',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase' as const,
    fontStyle: 'italic',
    letterSpacing: '0.1em',
    borderRadius: '16px',
    padding: '16px 24px',
    border: '1px solid #27272a',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  },
  success: {
    iconTheme: { primary: '#ca8a04', secondary: '#fff' },
  },
  error: {
    iconTheme: { primary: '#ef4444', secondary: '#fff' },
  },
};