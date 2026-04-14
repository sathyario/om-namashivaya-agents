from pydantic import BaseModel
from typing import Optional

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    shop_name: Optional[str] = None
