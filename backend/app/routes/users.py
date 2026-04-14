from fastapi import APIRouter, Depends
from app.database import supabase
from app.models.user import UserProfileUpdate
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
def get_my_profile(user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    res = supabase.table("user_profiles").select("*").eq("id", user_id).single().execute()
    return res.data

@router.put("/me")
def update_my_profile(body: UserProfileUpdate, user: dict = Depends(get_current_user)):
    user_id = user["sub"]
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    res = supabase.table("user_profiles").update(data).eq("id", user_id).execute()
    return res.data[0]
