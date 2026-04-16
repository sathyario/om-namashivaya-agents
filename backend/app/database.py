import httpx
from supabase import create_client, Client, ClientOptions
from app.config import settings

# HTTP/2 times out on Windows — pass a custom HTTP/1.1 client via ClientOptions
_http_client = httpx.Client(http2=False, timeout=httpx.Timeout(30.0))

supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
    options=ClientOptions(httpx_client=_http_client),
)
