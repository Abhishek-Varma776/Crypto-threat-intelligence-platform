-- Create trigger to auto-create government_officials profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_government_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.government_officials (
    id, 
    email, 
    full_name,
    is_verified
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_gov ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_gov
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_government_user();
