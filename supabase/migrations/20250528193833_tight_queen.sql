-- Add subscription information to profiles table
ALTER TABLE profiles 
ADD COLUMN subscription_start_date timestamptz,
ADD COLUMN subscription_end_date timestamptz,
ADD COLUMN subscription_status text CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'unpaid')) DEFAULT NULL;