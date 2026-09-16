export const NAV_BY_ROLE = {
  farmer: [
    { id: 'dashboard', icon: '🏠', key: 'nav.dashboard' },
    { id: 'registration', icon: '🧑‍🌾', key: 'nav.registration' },
    { id: 'crop', icon: '🌱', key: 'nav.crop' },
    { id: 'slot', icon: '📅', key: 'nav.slot' },
    { id: 'centres', icon: '📍', key: 'nav.centres' },
    { id: 'status', icon: '📦', key: 'nav.status' },
    { id: 'payment', icon: '💰', key: 'nav.payment' },
    { id: 'market', icon: '📊', key: 'nav.market' },
    { id: 'documents', icon: '📄', key: 'nav.documents' },
    { id: 'notifications', icon: '🔔', key: 'nav.notifications' },
    { id: 'help', icon: '🆘', key: 'nav.help' }
  ],
  operator: [
    { id: 'op-dashboard', icon: '🏠', key: 'nav.opdashboard' },
    { id: 'op-bookings', icon: '📋', key: 'nav.opbookings' },
    { id: 'op-quality', icon: '⚖️', key: 'nav.opquality' }
  ],
  officer: [
    { id: 'off-centres', icon: '🏬', key: 'nav.offcentres' },
    { id: 'off-alerts', icon: '🚨', key: 'nav.offalerts' },
    { id: 'off-reports', icon: '📈', key: 'nav.offreports' }
  ]
};

export const ROLE_LABEL_KEY = {
  farmer: 'role.farmer',
  operator: 'role.operator',
  officer: 'role.officer'
};
