-- Fix infinite recursion in RLS policies by creating security definer functions
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Create safe RLS policies using security definer functions
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin());

-- Update other table policies to use security definer functions
-- Orders policies
DROP POLICY IF EXISTS "All authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "All authenticated users can insert orders" ON orders;
DROP POLICY IF EXISTS "Users can update orders they created or admins can update all" ON orders;
DROP POLICY IF EXISTS "Users can view orders based on role" ON orders;

CREATE POLICY "All authenticated users can view orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "All authenticated users can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update orders they created or admins can update all" ON orders
  FOR UPDATE USING (created_by = auth.uid() OR is_admin());

-- Inventory policies  
DROP POLICY IF EXISTS "All authenticated users can view inventory" ON inventory;
DROP POLICY IF EXISTS "Purchase and admin can manage inventory" ON inventory;
DROP POLICY IF EXISTS "Users can view inventory based on role" ON inventory;

CREATE POLICY "All authenticated users can view inventory" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Purchase and admin can manage inventory" ON inventory
  FOR ALL USING (get_user_role() = ANY(ARRAY['purchase'::user_role, 'admin'::user_role]));

-- Payments policies
DROP POLICY IF EXISTS "All authenticated users can view payments" ON payments;
DROP POLICY IF EXISTS "Accounts and admin can manage payments" ON payments;

CREATE POLICY "All authenticated users can view payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Accounts and admin can manage payments" ON payments
  FOR ALL USING (get_user_role() = ANY(ARRAY['accounts'::user_role, 'admin'::user_role]));

-- Quality check reports policies
DROP POLICY IF EXISTS "All authenticated users can view QC reports" ON quality_check_reports;
DROP POLICY IF EXISTS "QC and admin can manage QC reports" ON quality_check_reports;

CREATE POLICY "All authenticated users can view QC reports" ON quality_check_reports
  FOR SELECT USING (true);

CREATE POLICY "QC and admin can manage QC reports" ON quality_check_reports
  FOR ALL USING (get_user_role() = ANY(ARRAY['qc'::user_role, 'admin'::user_role]));

-- Delivery challans policies
DROP POLICY IF EXISTS "All authenticated users can view delivery challans" ON delivery_challans;
DROP POLICY IF EXISTS "Dispatch and admin can manage delivery challans" ON delivery_challans;

CREATE POLICY "All authenticated users can view delivery challans" ON delivery_challans
  FOR SELECT USING (true);

CREATE POLICY "Dispatch and admin can manage delivery challans" ON delivery_challans
  FOR ALL USING (get_user_role() = ANY(ARRAY['dispatch'::user_role, 'admin'::user_role]));

-- Order stages policies
DROP POLICY IF EXISTS "All authenticated users can view order stages" ON order_stages;
DROP POLICY IF EXISTS "All authenticated users can insert order stages" ON order_stages;
DROP POLICY IF EXISTS "Users can update their assigned stages or admins can update all" ON order_stages;

CREATE POLICY "All authenticated users can view order stages" ON order_stages
  FOR SELECT USING (true);

CREATE POLICY "All authenticated users can insert order stages" ON order_stages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their assigned stages or admins can update all" ON order_stages
  FOR UPDATE USING (assigned_to = auth.uid() OR is_admin());

-- Inventory usage policies
DROP POLICY IF EXISTS "All authenticated users can view inventory usage" ON inventory_usage;
DROP POLICY IF EXISTS "All authenticated users can insert inventory usage" ON inventory_usage;

CREATE POLICY "All authenticated users can view inventory usage" ON inventory_usage
  FOR SELECT USING (true);

CREATE POLICY "All authenticated users can insert inventory usage" ON inventory_usage
  FOR INSERT WITH CHECK (true);