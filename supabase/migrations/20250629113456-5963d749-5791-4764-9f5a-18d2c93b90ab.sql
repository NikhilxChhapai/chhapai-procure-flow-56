
-- Step 1: Add the new enum value first
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'viewer';
