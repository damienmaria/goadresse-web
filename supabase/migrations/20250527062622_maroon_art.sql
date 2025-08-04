/*
  # Create search history table

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `code_postal` (text)
      - `commune` (text) 
      - `surface_min` (integer)
      - `surface_max` (integer)
      - `results_count` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `search_history` table
    - Add policies for users to read their own search history
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  code_postal text NOT NULL,
  commune text NOT NULL,
  surface_min integer NOT NULL,
  surface_max integer NOT NULL,
  results_count integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own search history"
  ON search_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);