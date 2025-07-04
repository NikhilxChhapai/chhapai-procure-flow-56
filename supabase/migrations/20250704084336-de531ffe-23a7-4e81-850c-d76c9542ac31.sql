-- Fix user role assignment and add vendor management tables

-- Update profiles table trigger to handle role from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'designer')::user_role
  );
  RETURN NEW;
END;
$$;

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  gst_number TEXT,
  credit_limit_amount NUMERIC DEFAULT 0,
  credit_limit_days INTEGER DEFAULT 30,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  product_types TEXT[],
  typical_quantities TEXT[],
  typical_sizes TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS on vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Vendors policies
CREATE POLICY "All authenticated users can view vendors" ON vendors
  FOR SELECT USING (true);

CREATE POLICY "Purchase and admin can manage vendors" ON vendors
  FOR ALL USING (get_user_role() = ANY(ARRAY['purchase'::user_role, 'admin'::user_role]));

-- Create custom stages table for order management
CREATE TABLE public.custom_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  department TEXT,
  estimated_hours NUMERIC DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on custom_stages
ALTER TABLE public.custom_stages ENABLE ROW LEVEL SECURITY;

-- Custom stages policies
CREATE POLICY "All authenticated users can view custom stages" ON custom_stages
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage custom stages" ON custom_stages
  FOR ALL USING (is_admin());

-- Insert default stages
INSERT INTO public.custom_stages (stage_name, display_order, department, estimated_hours) VALUES
('Design', 1, 'design', 4),
('Proofing', 2, 'design', 2),
('Printing', 3, 'production', 6),
('Finishing', 4, 'production', 4),
('Quality Check', 5, 'qc', 2),
('Packing', 6, 'production', 2),
('Dispatch', 7, 'dispatch', 1);

-- Add vendor_id to inventory table
ALTER TABLE public.inventory ADD COLUMN vendor_id UUID REFERENCES public.vendors(id);

-- Add stage attachments table
CREATE TABLE public.stage_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_stage_id UUID NOT NULL REFERENCES public.order_stages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stage_attachments
ALTER TABLE public.stage_attachments ENABLE ROW LEVEL SECURITY;

-- Stage attachments policies
CREATE POLICY "All authenticated users can view stage attachments" ON stage_attachments
  FOR SELECT USING (true);

CREATE POLICY "All authenticated users can upload stage attachments" ON stage_attachments
  FOR INSERT WITH CHECK (true);

-- Update vendors updated_at trigger
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update custom_stages updated_at trigger
CREATE TRIGGER update_custom_stages_updated_at
  BEFORE UPDATE ON public.custom_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();