# Phase 4 placeholder — AI chatbot with LangChain + pgvector
# To activate: pip install langchain openai
# Then implement RAG over products table using pgvector embeddings

from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat")
def chat(message: dict):
    # TODO Phase 4: Query pgvector embeddings, use LangChain RAG pipeline
    return {
        "response": "AI chatbot coming soon! For now, browse our products at /products"
    }
