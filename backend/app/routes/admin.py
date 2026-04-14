from fastapi import APIRouter, Depends
from app.database import supabase
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/stats")
def get_stats(_: dict = Depends(require_admin)):
    orders_res = supabase.table("orders").select("id, status, total_amount").execute()
    orders = orders_res.data

    low_stock_res = supabase.table("products").select("id").eq("is_active", True).lte("stock_quantity", 5).execute()

    total_revenue = sum(o["total_amount"] or 0 for o in orders if o["status"] == "delivered")
    pending = sum(1 for o in orders if o["status"] == "pending")

    return {
        "total_orders": len(orders),
        "pending_orders": pending,
        "total_revenue": total_revenue,
        "low_stock_products": len(low_stock_res.data),
    }
