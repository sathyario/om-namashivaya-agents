from fastapi import APIRouter
from app.database import supabase

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("")
def list_categories():
    res = supabase.table("categories").select("*").order("id").execute()
    return res.data
