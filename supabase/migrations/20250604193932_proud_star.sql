/*
  # Add profile creation policy

  1. Security Changes
    - Add RLS policy to allow authenticated users to create their own profile
    - This fixes the registration flow by allowing users to insert their profile
    after signup

  Note: The profiles table already has RLS enabled and other policies for
  select and update, but was missing the critical insert policy needed
  for registration.
*/

-- Policy to allow users to create their own profile
CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);