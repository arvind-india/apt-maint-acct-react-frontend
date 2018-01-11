// Module or Resource names

export const MODULE = {
  ACCOUNT: { name: 'accounts', isAdmin: false }, // isAdmin indicates whether it is visible only to Admin user
  ACCOUNT_SUMMARY: { name: 'account-summary', isAdmin: false },
  USER: { name: 'users', isAdmin: true },
  FLAT: { name: 'flats', isAdmin: true },
  RESIDENT: { name: 'residents', isAdmin: true },
  ROLE: { name: 'roles', isAdmin: true },
  PERMISSION: { name: 'permissions', isAdmin: true },
  FLAT_RESIDENT: { name: 'flats-residents', isAdmin: true },
  USER_ROLE: { name: 'users-roles', isAdmin: true },
  ROLE_PERMISSION: { name: 'roles-permissions', isAdmin: true },
  USER_PROFILE: { name: 'user-profile', isAdmin: false },
  BALANCE: { name: 'balance', isAdmin: false }
};

export const CATEGORIES: string[] = [
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
