// Privilege Categories
export const PRIVILEGE_CATEGORIES = {
  USER_ROLE: 'USER/ROLE',
  TEST_ORDER: 'TEST_ORDER',
  COMMENT: 'COMMENT',
  CONFIG: 'CONFIG',
  INSTRUMENT: 'INSTRUMENT',
  REAGENT: 'REAGENT'
} as const;

export const USER_ROLE_PRIVILEGES = {
  READ_ONLY: {
    code: 'READ_ONLY',
    name: 'Read Only',
    description: 'Have right to view patient test orders and patient test order results',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  CREATE_USER: {
    code: 'CREATE_USER',
    name: 'Create User',
    description: 'Have right to create a new user',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  MODIFY_USER: {
    code: 'MODIFY_USER',
    name: 'Modify User',
    description: 'Have right to modify a user',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  DELETE_USER: {
    code: 'DELETE_USER',
    name: 'Delete User',
    description: 'Have right to delete a user',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  LOCK_UNLOCK_USER: {
    code: 'LOCK_UNLOCK_USER',
    name: 'Lock and Unlock User',
    description: 'Have right to lock or unlock a user',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  VIEW_ROLE: {
    code: 'VIEW_ROLE',
    name: 'View Role',
    description: 'Have right to view all role privileges',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  CREATE_ROLE: {
    code: 'CREATE_ROLE',
    name: 'Create Role',
    description: 'Have right to create a new custom role',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  UPDATE_ROLE: {
    code: 'UPDATE_ROLE',
    name: 'Update Role',
    description: 'Have right to modify privileges of custom role',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  DELETE_ROLE: {
    code: 'DELETE_ROLE',
    name: 'Delete Role',
    description: 'Have right to delete a custom role',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  },

  VIEW_EVENT_LOGS: {
    code: 'VIEW_EVENT_LOGS',
    name: 'View Event Logs',
    description: 'Have right to view event logs',
    category: PRIVILEGE_CATEGORIES.USER_ROLE
  }
} as const;

export const TEST_ORDER_PRIVILEGES = {
  CREATE_TEST_ORDER: {
    code: 'CREATE_TEST_ORDER',
    name: 'Create Test Order',
    description: 'Have right to create a new patient test order',
    category: PRIVILEGE_CATEGORIES.TEST_ORDER
  },

  MODIFY_TEST_ORDER: {
    code: 'MODIFY_TEST_ORDER',
    name: 'Modify Test Order',
    description: 'Have right to modify information of a patient test order',
    category: PRIVILEGE_CATEGORIES.TEST_ORDER
  },

  DELETE_TEST_ORDER: {
    code: 'DELETE_TEST_ORDER',
    name: 'Delete Test Order',
    description: 'Have right to delete an existing test order',
    category: PRIVILEGE_CATEGORIES.TEST_ORDER
  },

  REVIEW_TEST_ORDER: {
    code: 'REVIEW_TEST_ORDER',
    name: 'Review Test Order',
    description: 'Have right to review, modify test result of test order',
    category: PRIVILEGE_CATEGORIES.TEST_ORDER
  },

  EXECUTE_BLOOD_TESTING: {
    code: 'EXECUTE_BLOOD_TESTING',
    name: 'Execute Blood Testing',
    description: 'Have right to execute a blood testing',
    category: PRIVILEGE_CATEGORIES.TEST_ORDER
  }
} as const;

export const COMMENT_PRIVILEGES = {
  ADD_COMMENT: {
    code: 'ADD_COMMENT',
    name: 'Add Comment',
    description: 'Have right to add a new comment for test result',
    category: PRIVILEGE_CATEGORIES.COMMENT
  },

  MODIFY_COMMENT: {
    code: 'MODIFY_COMMENT',
    name: 'Modify Comment',
    description: 'Have right to modify a comment',
    category: PRIVILEGE_CATEGORIES.COMMENT
  },

  DELETE_COMMENT: {
    code: 'DELETE_COMMENT',
    name: 'Delete Comment',
    description: 'Have right to delete a comment',
    category: PRIVILEGE_CATEGORIES.COMMENT
  }
} as const;

export const CONFIG_PRIVILEGES = {
  VIEW_CONFIGURATION: {
    code: 'VIEW_CONFIGURATION',
    name: 'View Configuration',
    description: 'Have right to view, add, modify and delete configurations',
    category: PRIVILEGE_CATEGORIES.CONFIG
  },

  CREATE_CONFIGURATION: {
    code: 'CREATE_CONFIGURATION',
    name: 'Create Configuration',
    description: 'Have right to add a new configuration',
    category: PRIVILEGE_CATEGORIES.CONFIG
  },

  MODIFY_CONFIGURATION: {
    code: 'MODIFY_CONFIGURATION',
    name: 'Modify Configuration',
    description: 'Have right to modify a configuration',
    category: PRIVILEGE_CATEGORIES.CONFIG
  },

  DELETE_CONFIGURATION: {
    code: 'DELETE_CONFIGURATION',
    name: 'Delete Configuration',
    description: 'Have right to delete a configuration',
    category: PRIVILEGE_CATEGORIES.CONFIG
  }
} as const;

export const INSTRUMENT_PRIVILEGES = {
  ADD_INSTRUMENT: {
    code: 'ADD_INSTRUMENT',
    name: 'Add Instrument',
    description: 'Have right to add a new instrument into system management',
    category: PRIVILEGE_CATEGORIES.INSTRUMENT
  },

  VIEW_INSTRUMENT: {
    code: 'VIEW_INSTRUMENT',
    name: 'View Instrument',
    description: 'Have right to view all instrument and check instrument status',
    category: PRIVILEGE_CATEGORIES.INSTRUMENT
  },

  ACTIVATE_DEACTIVATE_INSTRUMENT: {
    code: 'ACTIVATE_DEACTIVATE_INSTRUMENT',
    name: 'Activate or Deactivate Instrument',
    description: 'Have right to activate or deactivate instrument',
    category: PRIVILEGE_CATEGORIES.INSTRUMENT
  }
} as const;

export const REAGENT_PRIVILEGES = {
  VIEW_REAGENTS: {
    code: 'VIEW_REAGENTS',
    name: 'View Reagents',
    description: 'Have right to view all reagents',
    category: PRIVILEGE_CATEGORIES.REAGENT
  },

  ADD_REAGENTS: {
    code: 'ADD_REAGENTS',
    name: 'Add Reagents',
    description: 'Have right to add new reagents',
    category: PRIVILEGE_CATEGORIES.REAGENT
  },

  MODIFY_REAGENTS: {
    code: 'MODIFY_REAGENTS',
    name: 'Modify Reagents',
    description: 'Have right to modify reagent information',
    category: PRIVILEGE_CATEGORIES.REAGENT
  },

  DELETE_REAGENTS: {
    code: 'DELETE_REAGENTS',
    name: 'Delete Reagents',
    description: 'Have right to delete reagents',
    category: PRIVILEGE_CATEGORIES.REAGENT
  }
} as const;

export const ALL_PRIVILEGES = {
  ...USER_ROLE_PRIVILEGES,
  ...TEST_ORDER_PRIVILEGES,
  ...COMMENT_PRIVILEGES,
  ...CONFIG_PRIVILEGES,
  ...INSTRUMENT_PRIVILEGES,
  ...REAGENT_PRIVILEGES
} as const;

export const PRIVILEGES_BY_CATEGORY = {
  [PRIVILEGE_CATEGORIES.USER_ROLE]: Object.values(USER_ROLE_PRIVILEGES),
  [PRIVILEGE_CATEGORIES.TEST_ORDER]: Object.values(TEST_ORDER_PRIVILEGES),
  [PRIVILEGE_CATEGORIES.COMMENT]: Object.values(COMMENT_PRIVILEGES),
  [PRIVILEGE_CATEGORIES.CONFIG]: Object.values(CONFIG_PRIVILEGES),
  [PRIVILEGE_CATEGORIES.INSTRUMENT]: Object.values(INSTRUMENT_PRIVILEGES),
  [PRIVILEGE_CATEGORIES.REAGENT]: Object.values(REAGENT_PRIVILEGES)
} as const;

export type PrivilegeCode = keyof typeof ALL_PRIVILEGES;
export type PrivilegeCategory = typeof PRIVILEGE_CATEGORIES[keyof typeof PRIVILEGE_CATEGORIES];

// Utility Functions
export const getPrivilegeByCode = (code: PrivilegeCode) => {
  return ALL_PRIVILEGES[code];
};

export const getPrivilegesByCategory = (category: PrivilegeCategory) => {
  return PRIVILEGES_BY_CATEGORY[category] || [];
};

export const getAllPrivilegeCodes = (): PrivilegeCode[] => {
  return Object.keys(ALL_PRIVILEGES) as PrivilegeCode[];
};

export const isValidPrivilegeCode = (code: string): code is PrivilegeCode => {
  return code in ALL_PRIVILEGES;
};

// Default privileges for new roles
export const DEFAULT_ROLE_PRIVILEGES = {
    ADMIN: getAllPrivilegeCodes(),
    USER: [USER_ROLE_PRIVILEGES.READ_ONLY.code],
    LAB_TECH: [
        USER_ROLE_PRIVILEGES.READ_ONLY.code,
        TEST_ORDER_PRIVILEGES.CREATE_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.MODIFY_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.REVIEW_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.EXECUTE_BLOOD_TESTING.code,
        COMMENT_PRIVILEGES.ADD_COMMENT.code,
        COMMENT_PRIVILEGES.MODIFY_COMMENT.code,
        INSTRUMENT_PRIVILEGES.VIEW_INSTRUMENT.code,
        REAGENT_PRIVILEGES.VIEW_REAGENTS.code
    ],

    MANAGER: [
        USER_ROLE_PRIVILEGES.READ_ONLY.code,
        USER_ROLE_PRIVILEGES.CREATE_USER.code,
        USER_ROLE_PRIVILEGES.MODIFY_USER.code,
        USER_ROLE_PRIVILEGES.LOCK_UNLOCK_USER.code,
        USER_ROLE_PRIVILEGES.VIEW_ROLE.code,
        TEST_ORDER_PRIVILEGES.CREATE_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.MODIFY_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.DELETE_TEST_ORDER.code,
        TEST_ORDER_PRIVILEGES.REVIEW_TEST_ORDER.code,
        COMMENT_PRIVILEGES.ADD_COMMENT.code,
        COMMENT_PRIVILEGES.MODIFY_COMMENT.code,
        COMMENT_PRIVILEGES.DELETE_COMMENT.code,
        CONFIG_PRIVILEGES.VIEW_CONFIGURATION.code,
        INSTRUMENT_PRIVILEGES.ADD_INSTRUMENT.code,
        INSTRUMENT_PRIVILEGES.VIEW_INSTRUMENT.code,
        INSTRUMENT_PRIVILEGES.ACTIVATE_DEACTIVATE_INSTRUMENT.code,
        REAGENT_PRIVILEGES.ADD_REAGENTS.code,
        REAGENT_PRIVILEGES.MODIFY_REAGENTS.code,
        REAGENT_PRIVILEGES.DELETE_REAGENTS.code
    ]
} as const;