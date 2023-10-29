from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)
    active =  db.Column(db.Boolean, nullable=False)
    
    def __init__(self, name, username, email, password, active):
        self.name = name
        self.username = username
        self.email = email
        self.password = password
        self.active = active

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "password": self.password,
        }

   
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(80), unique=True)
    phone = db.Column(db.String(40), unique=True)

    def __init__(self, name, email, phone):
        self.name = name
        self.email = email
        self.phone = phone
    
    def __repr__(self):
        return f'<Customer {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone
        }


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f'<Category {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "subcategories": [subcat.serialize() for subcat in self.subcategories]
        }


class Subcategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    category = db.relationship("Category", backref="subcategories")
    name = db.Column(db.String(40), unique=True, nullable=False)

    def __init__(self, name, category):
        self.name = name
        self.category = category

    def __repr__(self):
        return f'<Subcategory {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category.name,
            "name": self.name
        }


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    category = db.relationship("Category")
    subcategory_id = db.Column(db.Integer, db.ForeignKey("subcategory.id"))
    subcategory = db.relationship("Subcategory")
    unit_price = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    sold = db.Column(db.Integer, nullable=False)
    sku = db.Column(db.String(15), nullable=False)
    image = db.Column(db.String(400), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    for_sale = db.Column(db.Boolean, nullable=False)

    def __init__(self, name, category, subcategory, unit_price, stock, sold, sku, image, description, for_sale):
        self.name = name
        self.category = category
        self.subcategory = subcategory
        self.unit_price = unit_price
        self.stock = stock
        self.sold = sold
        self.sku = sku
        self.image = image
        self.description = description
        self.for_sale = for_sale

    def __repr__(self):
        return f'<Product {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category.name,
            "subcategory": self.subcategory.name if self.subcategory else None,
            "name": self.name,
            "unit_price": self.unit_price,
            "stock": self.stock,
            "sold": self.sold,
            "sku": self.sku,
            "image": self.image,
            "description": self.description,
            "for_sale": self.for_sale,
        }
    

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    icon = db.Column(db.String(400), nullable=False)

    def __init__(self, name, icon):
        self.name = name
        self.icon = icon

    def __repr__(self):
        return f'<Payment {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    customer = db.relationship("Customer")
    payment_id = db.Column(db.Integer, db.ForeignKey("payment.id"), nullable=False)
    payment = db.relationship("Payment")
    date = db.Column(db.String(50), nullable=False)

    def __init__(self, name, customer, payment, date):
        self.name = name
        self.customer = customer
        self.payment = payment
        self.date = date

    def __repr__(self):
        return f'<Order {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "customer": self.customer.serialize(),
            "payment": self.payment.serialize(),
            "items": [itm.serialize() for itm in self.items],
            "date": self.date
        }
    

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    order = db.relationship("Order", backref="items")
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=False)
    product = db.relationship("Product")
    quantity = db.Column(db.Integer, nullable=False)

    def __init__(self, order, product, quantity):
        self.order = order
        self.product = product
        self.quantity = quantity

    def __repr__(self):
        return f'<Item {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "product": self.product.serialize(),
            "quantity": self.quantity,
        }