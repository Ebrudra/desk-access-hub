
-- Only update the enum right now.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('super-admin', 'admin', 'employee', 'user');
  ELSE
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super-admin';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'employee';
    ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'user';
  END IF;
END $$;
