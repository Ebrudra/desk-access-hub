
-- 1. Table for coworking spaces
CREATE TABLE IF NOT EXISTS coworking_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  owner_admin_id UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  image_url TEXT,
  UNIQUE(name)
);

-- 2. Table to assign users to spaces and roles
CREATE TABLE IF NOT EXISTS coworking_space_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coworking_space_id UUID NOT NULL REFERENCES coworking_spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL CHECK (role IN ('admin', 'employee', 'user')),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES public.profiles(id)
);

-- 3. Superadmin policy: add user_roles entry for this email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super-admin'
FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.user_roles WHERE role = 'super-admin')
  AND id IN (
    SELECT id FROM public.profiles
    WHERE EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = public.profiles.id
          AND (SELECT email FROM auth.users WHERE id = public.profiles.id) = 'benhaddouch.elmehdi@gmail.com'
    )
  );

-- 4. Table for payment proofs for bank transfers
CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coworking_space_id UUID NOT NULL REFERENCES coworking_spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payment_purpose TEXT NOT NULL, -- membership/event/space/etc
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  bank_reference TEXT,
  proof_file_url TEXT, -- will store uploaded receipt
  status TEXT DEFAULT 'pending', -- pending|approved|rejected
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ
);

-- 5. RLS policies will be needed for coworking_spaces, coworking_space_users, payment_proofs
-- (These will be proposed after you confirm these core tables.)
