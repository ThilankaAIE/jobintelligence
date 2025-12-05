from supabase import create_client
from core.config import SUPABASE_URL, SUPABASE_SERVICE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def test_connection():
    return supabase.table("jobs_raw").select("*").limit(1).execute()
