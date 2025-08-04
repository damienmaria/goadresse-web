/*
  # Add search limit for non-pro users

  1. Changes
    - Add `search_count` column to profiles table
    - Set default value to 0
    - Add check constraint to ensure non-negative values
*/

ALTER TABLE profiles 
ADD COLUMN search_count integer NOT NULL DEFAULT 0 CHECK (search_count >= 0);