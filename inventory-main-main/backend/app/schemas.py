from pydantic import BaseModel, EmailStr, Field
from typing import List

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1)
    sku: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    quantity_in_stock: int = Field(..., ge=0) # Prevents negative inventory inputs

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    phone_number: str = Field(..., min_length=1)

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemSchema(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemSchema] = Field(..., min_items=1)

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemSchema] = []
    class Config:
        from_attributes = True

# --- Dashboard Summary Schema ---
class DashboardSummary(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[ProductResponse]