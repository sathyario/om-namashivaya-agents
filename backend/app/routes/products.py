from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.database import supabase
from app.models.product import ProductCreate, ProductUpdate
from app.middleware.auth import get_current_user, require_admin

router = APIRouter(prefix="/products", tags=["products"])

@router.get("")
def list_products(category_id: Optional[int] = None, in_stock: bool = False):
    query = supabase.table("products").select("*, categories(*)").eq("is_active", True)
    if category_id:
        query = query.eq("category_id", category_id)
    if in_stock:
        query = query.gt("stock_quantity", 0)
    res = query.order("name").execute()
    return res.data

@router.get("/{product_id}")
def get_product(product_id: int):
    res = supabase.table("products").select("*, categories(*)").eq("id", product_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return res.data

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
