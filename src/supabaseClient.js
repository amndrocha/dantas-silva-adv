import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtwcuvbgdswoatjnupgb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2N1dmJnZHN3b2F0am51cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDExOTYsImV4cCI6MjAyMzYxNzE5Nn0.dt8qknmzhpUN38Cp3WIJpJo17AxEcjIQCKOYWTciKjM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)