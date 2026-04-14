from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.database import supabase
from app.models.product import ProductCreate, ProductUpdate
from app.middleware.auth import get_current_user, require_admin
from jose import jwt, JWTError
from app.config import settings

router = APIRouter(prefix="/products", tags=["products"])

security = HTTPBearer(auto_error=False)

def get_caller_role(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Returns role from JWT payload — no DB lookup needed."""
    if not credentials:
        return "guest"
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        role = (payload.get("user_metadata") or {}).get("role")
        return role if role in ("shop", "admin") else "consumer"
    except JWTError:
        return "guest"

def strip_wholesale(products: list, role: str) -> list:
    if role in ("shop", "admin"):
        return products
    return [{k: v for k, v in p.items() if k != "price_wholesale"} for p in products]

@router.get("")
def list_products(
    category_id: Optional[int] = None,
    in_stock: bool = False,
    role: str = Depends(get_caller_role),
):
    query = supabase.table("products").select("*, categories(*)").eq("is_active", True)
    if category_id:
        query = query.eq("category_id", category_id)
    if in_stock:
        query = query.gt("stock_quantity", 0)
    res = query.order("name").execute()
    return strip_wholesale(res.data, role)

@router.get("/{product_id}")
def get_product(product_id: int, role: str = Depends(get_caller_role)):
    res = supabase.table("products").select("*, categories(*)").eq("id", product_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return strip_wholesale([res.data], role)[0]


@router.post("")
def create_product(product: ProductCreate, _: dict = Depends(require_admin)):
    res = supabase.table("products").insert(product.model_dump()).execute()
    return res.data[0]

@router.put("/{product_id}")
def update_product(product_id: int, product: ProductUpdate, _: dict = Depends(require_admin)):
    data = {k: v for k, v in product.model_dump().items() if v is not None}
    res = supabase.table("products").update(data).eq("id", product_id).execute()
    return res.data[0]

@router.delete("/{product_id}")
def delete_product(product_id: int, _: dict = Depends(require_admin)):
    supabase.table("products").update({"is_active": False}).eq("id", product_id).execute()
    return {"message": "Product deleted"}
