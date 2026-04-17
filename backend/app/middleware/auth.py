from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, jwk, JWTError
import httpx
import time
import logging
from app.config import settings

logger = logging.getLogger(__name__)
security = HTTPBearer()

_jwks_cache: dict[str, dict] = {}
_key_cache: dict[str, object] = {}


def _get_jwks() -> dict[str, dict]:
    global _jwks_cache
    if not _jwks_cache:
        url = f"{settings.supabase_url}/auth/v1/.well-known/jwks.json"
        last_exc = None
        for attempt in range(3):
            try:
                resp = httpx.get(url, timeout=30)
                resp.raise_for_status()
                _jwks_cache = {k["kid"]: k for k in resp.json()["keys"]}
                return _jwks_cache
            except Exception as exc:
                last_exc = exc
                if attempt < 2:
                    time.sleep(2)
        raise last_exc
    return _jwks_cache


def prefetch_jwks() -> None:
    try:
        _get_jwks()
        logger.info("JWKS pre-fetched and cached at startup")
    except Exception as exc:
        logger.warning("Could not pre-fetch JWKS at startup: %s", exc)


def _get_public_key(kid: str) -> object:
    if kid not in _key_cache:
        keys = _get_jwks()
        if kid not in keys:
            _jwks_cache.clear()
            _key_cache.clear()
            keys = _get_jwks()
        if kid not in keys:
            raise HTTPException(status_code=401, detail="Unknown JWT key ID")
        _key_cache[kid] = jwk.construct(keys[kid])
    return _key_cache[kid]


def decode_token(token: str) -> dict:
    header = jwt.get_unverified_header(token)
    alg = header.get("alg", "HS256")
    if alg == "ES256":
        public_key = _get_public_key(header.get("kid", ""))
        return jwt.decode(token, public_key, algorithms=["ES256"], options={"verify_aud": False})
    return jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"], options={"verify_aud": False})


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        return decode_token(credentials.credentials)
    except HTTPException:
        raise
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(user: dict = Depends(get_current_user)) -> dict:
    role = user.get("user_metadata", {}).get("role") or user.get("role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
