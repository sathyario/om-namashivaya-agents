from fastapi import APIRouter, Depends, HTTPException
from app.database import supabase
from app.models.order import OrderCreate, OrderStatusUpdate
from app.middleware.auth import get_current_user, require_admin

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("")
def create_order(order: OrderCreate, user: dict = Depends(get_current_user)):
    user_id = user["sub"]

    # Insert order
    order_data = {
        "user_id": user_id,
        "order_type": order.order_type,
        "payment_method": order.payment_method,
        "delivery_address": order.delivery_address,
        "phone": order.phone,
        "notes": order.notes,
        "total_amount": order.total_amount,
        "status": "pending",
        "payment_status": "pending",
    }
    order_res = supabase.table("orders").insert(order_data).execute()
    order_id = order_res.data[0]["id"]

    # Insert order items
    items = [
        {
            "order_id": order_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "subtotal": item.subtotal,
        }
        for item in order.items
    ]
    supabase.table("order_items").insert(items).execute()

    # Decrement stock for each product
    for item in order.items:
        product = supabase.table("products").select("stock_quantity").eq("id", item.product_id).single().execute()
        new_qty = max(0, product.data["stock_quantity"] - item.quantity)
        supabase.table("products").update({"stock_quantity": new_qty}).eq("id", item.product_id).execute()

    return {"order_id": order_id, "message": "Order placed successfully"}

@router.get("")
def get_my_orders(user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    res = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data

@router.get("/all")
def get_all_orders(_: dict = Depends(require_admin)):
    res = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return res.data

@router.get("/{order_id}")
def get_order(order_id: int, user: dict = Depends(get_current_user)):
    res = supabase.table("orders").select("*, order_items(*, products(*))").eq("id", order_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Order not found")
    role = (user.get("user_metadata") or {}).get("role")
    if role != "admin" and res.data["user_id"] != user["sub"]:
        raise HTTPException(status_code=403, detail="Access denied")
    return res.data

@router.put("/{order_id}/status")
def update_order_status(order_id: int, body: OrderStatusUpdate, _: dict = Depends(require_admin)):
    valid = {"pending", "confirmed", "dispatched", "delivered", "cancelled"}
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid}")
    supabase.table("orders").update({"status": body.status}).eq("id", order_id).execute()
    return {"message": "Status updated"}
