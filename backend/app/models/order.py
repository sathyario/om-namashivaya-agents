from pydantic import BaseModel
from typing import Optional, List

class OrderItemIn(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float

class OrderCreate(BaseModel):
    order_type: str = "retail"
    payment_method: str = "cod"
    delivery_address: str
    phone: str
    notes: Optional[str] = None
    total_amount: float
    items: List[OrderItemIn]

class OrderStatusUpdate(BaseModel):
    status: str
