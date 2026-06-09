from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

# Junction table for Many-to-Many relationship between Orders and Products
order_items = Table(
    "order_items",
    Base.metadata,
    Column("order_id", Integer, ForeignKey("orders.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", Integer, ForeignKey("products.id", ondelete="RESTRICT"), primary_key=True),
    Column("quantity", Integer, nullable=False)
)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False) # SKU uniqueness constraint
    price = Column(Float, nullable=False)
    quantity_in_stock = Column(Integer, nullable=False, default=0)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False) # Email uniqueness constraint
    phone_number = Column(String, nullable=False)

    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Float, nullable=False, default=0.0)

    customer = relationship("Customer", back_populates="orders")
    products = relationship("Product", secondary=order_items, lazy="subquery")