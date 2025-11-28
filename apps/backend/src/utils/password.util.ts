// Password Hashing Utility
// Reference: PROJECT_MASTER_PLAN.md Section 9.2 - "Data Encryption"

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 * Reference: PROJECT_MASTER_PLAN.md Section 9.2
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify password against hash
 * Reference: PROJECT_MASTER_PLAN.md Section 9.2
 * 
 * @param password - Plain text password to verify
 * @param hash - Stored password hash
 * @returns True if password matches
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
