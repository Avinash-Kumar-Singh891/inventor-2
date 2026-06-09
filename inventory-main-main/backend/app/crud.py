from sqlalchemy.orm import Session
from sqlalchemy import select, func
from . import models, schemas
from fastapi import HTTPException, status

# --- Product Logic ---
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if db_product:
        raise HTTPException(status_code=400, detail="SKU code must be unique.")
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

def get_products(db: Session):
    return db.query(models.Product).all()

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def update_product(db: Session, product_id: int, product_data: schemas.ProductCreate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    # Check if SKU is changing and conflicts with another item
    sku_conflict = db.query(models.Product).filter(models.Product.sku == product_data.sku, models.Product.id != product_id).first()
    if sku_conflict:
        raise HTTPException(status_code=400, detail="SKU code must be unique.")
        
    for key, value in product_data.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True

# --- Customer Logic ---
def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="Customer email must be unique.")
    new_customer = models.Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

def get_customers(db: Session):
    return db.query(models.Customer).all()

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return False
    db.delete(db_customer)
    db.commit()
    return True

# --- Order Logic ---
def create_order(db: Session, order_data: schemas.OrderCreate):
    # Verify Customer Exists
    customer = db.query(models.Customer).filter(models.Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")

    total_amount = 0.0
    items_to_process = []

    # Validate and calculate first (Atomicity simulation)
    for item in order_data.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found.")
        
        # Check sufficient stock
        if product.quantity_in_stock < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient inventory for product '{product.name}'. Available: {product.quantity_in_stock}"
            )
        
        # Automatically calculate the price
        total_amount += product.price * item.quantity
        items_to_process.append((product, item.quantity))

    # Save order shell
    db_order = models.Order(customer_id=order_data.customer_id, total_amount=total_amount)
    db.add(db_order)
    db.flush()  # Gen ID

    # Deduct inventory & associate join entities
    for product, qty in items_to_process:
        product.quantity_in_stock -= qty  # Auto reduce inventory
        statement = models.order_items.insert().values(order_id=db_order.id, product_id=product.id, quantity=qty)
        db.execute(statement)

    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session):
    return db.query(models.Order).all()

def get_order_details(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        return None
        
    # Gather join details manually for structural uniformity
    items = db.execute(
        select(models.order_items.c.product_id, models.order_items.c.quantity)
        .where(models.order_items.c.order_id == order_id)
    ).fetchall()
    
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "total_amount": order.total_amount,
        "items": [{"product_id": i.product_id, "quantity": i.quantity} for i in items]
    }

def delete_order(db: Session, order_id: int):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        return False
    db.delete(db_order)
    db.commit()
    return True

# --- Dashboard Utility ---
def get_dashboard_summary(db: Session):
    total_products = db.query(func.count(models.Product.id)).scalar()
    total_customers = db.query(func.count(models.Customer.id)).scalar()
    total_orders = db.query(func.count(models.Order.id)).scalar()
    
    # Low stock thresholds are typically under 10 units
    low_stock_products = db.query(models.Product).filter(models.Product.quantity_in_stock <= 10).all()
    
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products
    }