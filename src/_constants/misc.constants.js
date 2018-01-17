// Modules or Resource names

export const MODULES = [
  { label: 'ACCOUNT', name: 'accounts', isAdmin: false }, // isAdmin indicates whether it is visible only to Admin user
  { label: 'ACCOUNT_SUMMARY', name: 'account-summary', isAdmin: false },
  { label: 'USER', name: 'users', isAdmin: true },
  { label: 'FLAT', name: 'flats', isAdmin: true },
  { label: 'RESIDENT', name: 'residents', isAdmin: true },
  { label: 'ROLE', name: 'roles', isAdmin: true },
  { label: 'PERMISSION', name: 'permissions', isAdmin: true },
  { label: 'FLAT_RESIDENT', name: 'flats-residents', isAdmin: true },
  { label: 'USER_ROLE', name: 'users-roles', isAdmin: true },
  { label: 'ROLE_PERMISSION', name: 'roles-permissions', isAdmin: true },
  { label: 'USER_PROFILE', name: 'user-profile', isAdmin: false },
  { label: 'BALANCE', name: 'balance', isAdmin: false }
];

export const CATEGORIES = [
  'Electrical',
  'Garbage',
  'Monthly Maintenance',
  'Major Maintenance',
  'Plumbing',
  'Seasonal Gift',
  'Septic Tank',
  'Sweeping',
  'Water Tank - Overhead',
  'Water Tank - Sump',
  'Others'
];
