// Modules or Resource names as array
export const MODULES = [
  { label: 'ACCOUNT', name: 'accounts', isAdmin: false }, // isAdmin indicates whether it is visible only to Admin user
  { label: 'MY_ACCOUNT', name: 'my-accounts', isAdmin: false },
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
  { label: 'BALANCE', name: 'balance', isAdmin: false },
  { label: 'DURATION', name: 'durations', isAdmin: true }
];

// Resident Types as array
export const RESIDENT_TYPES = [
  { label: 'Owner', name: 'owner' },
  { label: 'Tenant', name: 'tenant' },
  { label: 'Not Applicable', name: 'NA'}
]

export const CATEGORIES = [
  { name: 'Electrical' },
  { name: 'Garbage' },
  { name: 'Monthly Maintenance' },
  { name: 'Major Maintenance' },
  { name: 'Plumbing' },
  { name: 'Seasonal Gift' },
  { name: 'Septic Tank' },
  { name: 'Sweeping' },
  { name: 'Water Tank - Overhead' },
  { name: 'Water Tank - Sump' },
  { name: 'Others' }
];

export const MONTHS = [
  { name: 'Jan', number: 1 },
  { name: 'Feb', number: 2 },
  { name: 'Mar', number: 3 },
  { name: 'Apr', number: 4 },
  { name: 'May', number: 5 },
  { name: 'Jun', number: 6 },
  { name: 'Jul', number: 7 },
  { name: 'Aug', number: 8 },
  { name: 'Sep', number: 9 },
  { name: 'Oct', number: 10 },
  { name: 'Nov', number: 11 },
  { name: 'Dec', number: 12 }
]

export const DEFAULTS = {
  AccountsInMonths: 2,
  AccountsMinYear: 2010,
  AccountsMaxYear: 2030
}
