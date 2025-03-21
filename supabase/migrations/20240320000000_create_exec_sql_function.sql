-- Create a function to execute SQL commands with proper permissions
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;

-- Grant execute permission to anon users (if needed)
-- GRANT EXECUTE ON FUNCTION exec_sql TO anon; 