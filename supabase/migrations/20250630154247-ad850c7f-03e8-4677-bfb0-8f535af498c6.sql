
-- Update the profiles table to ensure it has all necessary fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create a function to get user permissions based on role
CREATE OR REPLACE FUNCTION get_user_permissions(user_role user_role)
RETURNS JSONB
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT CASE user_role
    WHEN 'admin' THEN '{"orders": "full", "inventory": "full", "reports": "full", "users": "full", "settings": "full", "purchase": "full", "quality": "full", "dispatch": "full", "accounts": "full"}'::jsonb
    WHEN 'designer' THEN '{"orders": "read", "inventory": "read"}'::jsonb
    WHEN 'production' THEN '{"orders": "update", "inventory": "update", "quality": "read"}'::jsonb
    WHEN 'qc' THEN '{"orders": "read", "quality": "full", "inventory": "read"}'::jsonb
    WHEN 'purchase' THEN '{"orders": "read", "inventory": "full", "purchase": "full", "reports": "read"}'::jsonb
    WHEN 'accounts' THEN '{"orders": "read", "reports": "full", "accounts": "full"}'::jsonb
    WHEN 'sales' THEN '{"orders": "full", "reports": "read"}'::jsonb
    WHEN 'dispatch' THEN '{"orders": "read", "dispatch": "full", "inventory": "read"}'::jsonb
    WHEN 'viewer' THEN '{"orders": "read", "inventory": "read", "reports": "read"}'::jsonb
    ELSE '{}'::jsonb
  END;
$$;

-- Update existing profiles with permissions
UPDATE profiles 
SET permissions = get_user_permissions(role)
WHERE permissions = '{}' OR permissions IS NULL;

-- Create a trigger to automatically set permissions when role is updated
CREATE OR REPLACE FUNCTION update_user_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.permissions = get_user_permissions(NEW.role);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_permissions ON profiles;
CREATE TRIGGER trigger_update_permissions
  BEFORE UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_permissions();

-- Enable RLS on all tables if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_check_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_usage ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Orders policies
DROP POLICY IF EXISTS "Users can view orders based on role" ON orders;
CREATE POLICY "Users can view orders based on role" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND (
        p.role = 'admin' OR
        p.role IN ('sales', 'production', 'qc', 'purchase', 'accounts', 'dispatch', 'designer', 'viewer')
      )
    )
  );

-- Inventory policies
DROP POLICY IF EXISTS "Users can view inventory based on role" ON inventory;
CREATE POLICY "Users can view inventory based on role" ON inventory
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND (
        p.role = 'admin' OR
        p.role IN ('purchase', 'production', 'qc', 'dispatch', 'viewer')
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_priority ON orders(priority);
CREATE INDEX IF NOT EXISTS idx_inventory_current_stock ON inventory(current_stock);
