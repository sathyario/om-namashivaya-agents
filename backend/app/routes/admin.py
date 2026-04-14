from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.database import supabase
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

class RoleUpdate(BaseModel):
    role: str

@router.get("/stats")
def get_stats(_: dict = Depends(require_admin)):
    orders_res = supabase.table("orders").select("id, status, total_amount").execute()
    orders = orders_res.data

    low_stock_res = supabase.table("products").select("id").eq("is_active", True).lte("stock_quantity", 5).execute()

    total_revenue = sum(o["total_amount"] or 0 for o in orders if o["status"] == "delivered")
    pending_orders = sum(1 for o in orders if o["status"] == "pending")

    return {
        "total_orders": len(orders),
        "pending_orders": pending_orders,
        "total_revenue": total_revenue,
        "low_stock_products": len(low_stock_res.data),
    }

@router.get("/users")
def get_all_users(_: dict = Depends(require_admin)):
    """Get all users with their profiles for admin management."""
    res = supabase.table("user_profiles").select("*").order("created_at", desc=True).execute()
    return res.data

@router.get("/shop-requests")
def get_shop_requests(_: dict = Depends(require_admin)):
    """Get users who requested shop access but are not yet approved."""
    res = supabase.auth.admin.list_users()

    # Filter to only users who requested shop access
    shop_requesters = [u for u in res.users if (u.user_metadata or {}).get("shop_request")]
    if not shop_requesters:
        return []

    # Single batch query instead of one query per user
    requester_ids = [str(u.id) for u in shop_requesters]
    profiles = supabase.table("user_profiles").select("id, role").in_("id", requester_ids).execute()
    profile_roles = {p["id"]: p["role"] for p in profiles.data}

    return [
        {
            "id": str(u.id),
            "email": u.email,
            "full_name": (u.user_metadata or {}).get("full_name"),
            "phone": (u.user_metadata or {}).get("phone"),
            "shop_name": (u.user_metadata or {}).get("shop_name"),
            "shop_address": (u.user_metadata or {}).get("shop_address"),
            "shop_phone": (u.user_metadata or {}).get("shop_phone"),
            "gstin": (u.user_metadata or {}).get("gstin"),
        }
        for u in shop_requesters
        if profile_roles.get(str(u.id), "consumer") == "consumer"
    ]

@router.put("/users/{user_id}/role")
def update_user_role(user_id: str, body: RoleUpdate, _: dict = Depends(require_admin)):
    """Approve or change a user's role. Used to activate shop wholesale access."""
    valid_roles = {"consumer", "shop", "admin"}
    if body.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    profile_res = supabase.table("user_profiles").select("id").eq("id", user_id).single().execute()
    if not profile_res.data:
        raise HTTPException(status_code=404, detail="User not found")

    # If approving as shop, also copy shop details from auth metadata to profile
    if body.role == "shop":
        user_res = supabase.auth.admin.get_user_by_id(user_id)
        meta = user_res.user.user_metadata or {}
        supabase.table("user_profiles").update({
            "role": "shop",
            "shop_name": meta.get("shop_name"),
            "shop_address": meta.get("shop_address"),
            "shop_phone": meta.get("shop_phone"),
        }).eq("id", user_id).execute()
    else:
        supabase.table("user_profiles").update({"role": body.role}).eq("id", user_id).execute()

    return {"message": f"User role updated to {body.role}"}
