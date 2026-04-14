from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price_retail: float
    price_wholesale: Optional[float] = None
    stock_quantity: int = 0
    unit: str = "piece"
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_retail: Optional[float] = None
    price_wholesale: Optional[float] = None
    stock_quantity: Optional[int] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
