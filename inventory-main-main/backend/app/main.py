from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Fixed absolute imports so Windows Python can locate them cleanly
from app.database import engine, Base, get_db
from app import schemas, crud

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management API")

# Enable CORS for React integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dashboard Routing ---
@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def read_dashboard_summary(db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db)

# --- Product Routes ---
@app.post("/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.get("/products", response_model=List[schemas.ProductResponse])
def read_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.get("/products/{id}", response_model=schemas.ProductResponse)
def read_product(id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    updated = crud.update_product(db, id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@app.delete("/products/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(get_db)):
    if not crud.delete_product(db, id):
        raise HTTPException(status_code=404, detail="Product not found")
    return None

# --- Customer Routes ---
@app.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@app.get("/customers", response_model=List[schemas.CustomerResponse])
def read_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.get("/customers/{id}", response_model=schemas.CustomerResponse)
def read_customer(id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.delete("/customers/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(id: int, db: Session = Depends(get_db)):
    if not crud.delete_customer(db, id):
        raise HTTPException(status_code=404, detail="Customer not found")
    return None

# --- Order Routes ---
@app.post("/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@app.get("/orders", response_model=List[schemas.OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    orders = crud.get_orders(db)
    return [crud.get_order_details(db, o.id) for o in orders]

@app.get("/orders/{id}", response_model=schemas.OrderResponse)
def read_order(id: int, db: Session = Depends(get_db)):
    order_details = crud.get_order_details(db, id)
    if not order_details:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_details

@app.delete("/orders/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(id: int, db: Session = Depends(get_db)):
    if not crud.delete_order(db, id):
        raise HTTPException(status_code=404, detail="Order not found")
    return None