
-- 1. Enable RLS for coworking_spaces table
ALTER TABLE coworking_spaces ENABLE ROW LEVEL SECURITY;

-- Only owner (or users assigned to the space as admin/employee/user via coworking_space_users) can view their coworking space
CREATE POLICY "View accessible coworking spaces"
  ON coworking_spaces
  FOR SELECT
  USING (
    owner_admin_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM coworking_space_users
      WHERE coworking_space_id = coworking_spaces.id
        AND user_id = auth.uid()
    )
  );

-- Allow only owner admin to update/delete their own coworking_space
CREATE POLICY "Owner admin can modify their coworking space"
  ON coworking_spaces
  FOR UPDATE
  USING (owner_admin_id = auth.uid());

CREATE POLICY "Owner admin can delete their coworking space"
  ON coworking_spaces
  FOR DELETE
  USING (owner_admin_id = auth.uid());

-- Any authenticated user can insert a new coworking space (becomes owner)
CREATE POLICY "Any user can create coworking space"
  ON coworking_spaces
  FOR INSERT
  WITH CHECK (owner_admin_id = auth.uid());

----------------------------------------------------------

-- 2. Enable RLS for coworking_space_users table
ALTER TABLE coworking_space_users ENABLE ROW LEVEL SECURITY;

-- Users can view coworking_space_users if they're involved (themselves) or assigned as admin to the space
CREATE POLICY "View own or managed space users"
  ON coworking_space_users
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR coworking_space_id IN (
      SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM coworking_space_users AS c2
      WHERE c2.coworking_space_id = coworking_space_users.coworking_space_id
        AND c2.user_id = auth.uid()
        AND c2.role = 'admin'
    )
  );

-- Only admin of the space or the owner can insert/assign users
CREATE POLICY "Admin or owner can assign users"
  ON coworking_space_users
  FOR INSERT
  WITH CHECK (
    assigned_by = auth.uid()
    AND (
      coworking_space_id IN (SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM coworking_space_users AS c2
        WHERE c2.coworking_space_id = coworking_space_users.coworking_space_id
          AND c2.user_id = auth.uid()
          AND c2.role = 'admin'
      )
    )
  );

-- Only admin or owner of space can update roles/assignments
CREATE POLICY "Admin or owner can update space roles"
  ON coworking_space_users
  FOR UPDATE
  USING (
    assigned_by = auth.uid()
    AND (
      coworking_space_id IN (SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM coworking_space_users AS c2
        WHERE c2.coworking_space_id = coworking_space_users.coworking_space_id
          AND c2.user_id = auth.uid()
          AND c2.role = 'admin'
      )
    )
  );

-- Only admin or owner of space can delete user assignments
CREATE POLICY "Admin or owner can remove users"
  ON coworking_space_users
  FOR DELETE
  USING (
    assigned_by = auth.uid()
    AND (
      coworking_space_id IN (SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM coworking_space_users AS c2
        WHERE c2.coworking_space_id = coworking_space_users.coworking_space_id
          AND c2.user_id = auth.uid()
          AND c2.role = 'admin'
      )
    )
  );

----------------------------------------------------------

-- 3. Enable RLS for payment_proofs table
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

-- Users can see their own proofs or if they're a space admin/owner
CREATE POLICY "Users see their own or managed payment proofs"
  ON payment_proofs
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR coworking_space_id IN (
      SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM coworking_space_users
      WHERE coworking_space_id = payment_proofs.coworking_space_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- User can insert payment proof for a space they're assigned to
CREATE POLICY "User inserts own payment proof"
  ON payment_proofs
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND (
      coworking_space_id IN (
        SELECT coworking_space_id FROM coworking_space_users
        WHERE user_id = auth.uid()
      )
    )
  );

-- Only admin or owner can update status of payment proof (approve/reject)
CREATE POLICY "Admin or owner can update payment proof"
  ON payment_proofs
  FOR UPDATE
  USING (
    coworking_space_id IN (
      SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM coworking_space_users
      WHERE coworking_space_id = payment_proofs.coworking_space_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Only admin or owner can delete payment proof
CREATE POLICY "Admin or owner can delete payment proof"
  ON payment_proofs
  FOR DELETE
  USING (
    coworking_space_id IN (
      SELECT id FROM coworking_spaces WHERE owner_admin_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM coworking_space_users
      WHERE coworking_space_id = payment_proofs.coworking_space_id
        AND user_id = auth.uid()
        AND role = 'admin'
    )
  );
