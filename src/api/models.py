from flask_sqlalchemy import SQLAlchemy
import copy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)
    active =  db.Column(db.Boolean, nullable=False)
    admin = db.Column(db.Boolean, nullable=False)
    
    def __init__(self, name, username, email, password, active, admin):
        self.name: name
        self.username = username
        self.email = email
        self.password = password
        self.active = active
        self.admin = admin

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "admin": self.admin,
            "password": self.password,
        }

   
class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(80))
    phone = db.Column(db.String(40))

    def __init__(self, name, email, phone):
        self.name = name
        self.email = email
        self.phone = phone
    
    def __repr__(self):
        return f'<Customer {self.name}>'

    def serialize(self):
        info = {
            "orders": 0,
            "spent": 0,
            "quantity": 0,
        }
        orders = Order.query.all()
        for order in orders:
            if order.customer == self:
                for itm in order.items:
                    info["orders"] += 1
                    info["spent"] += itm.product.unit_price*itm.quantity
                    info["quantity"] += itm.quantity 

        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "info": info
        }


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    icon = db.Column(db.String(400), nullable=False)

    def __init__(self, name, icon):
        self.name = name
        self.icon = icon

    def __repr__(self):
        return f'<Category {self.name}>'

    def serialize(self):
        products_in_category = 0
        products = Product.query.all()
        for product in products:
            if product.category == self and product.for_sale:
                products_in_category += 1

        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "subcategories": [subcat.serialize() for subcat in self.subcategories],
            "products_quantity": products_in_category
        }


class Subcategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)
    category = db.relationship("Category", backref="subcategories")
    name = db.Column(db.String(40), unique=True, nullable=False)
    image = db.Column(db.String(400), nullable=False)

    def __init__(self, name, category, image):
        self.name = name
        self.category = category
        self.image = image

    def __repr__(self):
        return f'<Subcategory {self.name}>'

    def serialize(self):
        products_in_subcategory = 0
        products = Product.query.all()
        for product in products:
            if product.subcategory == self and product.for_sale:
                products_in_subcategory += 1

        return {
            "id": self.id,
            "category": self.category.name,
            "name": self.name,
            "image": self.image,
            "products_quantity": products_in_subcategory
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
    sku = db.Column(db.String(30), nullable=False)
    image = db.Column(db.String(500), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
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
    
    def shop_serialize(self):
        return {
            "id": self.id,
            "category": self.category.name,
            "subcategory": self.subcategory.name if self.subcategory else None,
            "name": self.name,
            "unit_price": self.unit_price,
            "image": self.image,
            "description": self.description,
        }

    def serialize(self):
        years = {}
        months_template = {
            "01":{"quantity": 0, "total": 0},
            "02":{"quantity": 0, "total": 0},
            "03":{"quantity": 0, "total": 0},
            "04":{"quantity": 0, "total": 0},
            "05":{"quantity": 0, "total": 0},
            "06":{"quantity": 0, "total": 0},
            "07":{"quantity": 0, "total": 0},
            "08":{"quantity": 0, "total": 0},
            "09":{"quantity": 0, "total": 0},
            "10":{"quantity": 0, "total": 0},
            "11":{"quantity": 0, "total": 0},
            "12":{"quantity": 0, "total": 0},
            }
        items = Item.query.filter_by(product=self)
        for item in items:
            if item.order.date[0:4] not in years:
                years[item.order.date[0:4]] = copy.deepcopy(months_template)
            for year in years:
                if item.order.date[0:4] == year:
                    for month in years[f"{year}"]:
                        if month == item.order.date[5:7]:
                            years[f"{year}"][f"{month}"]["quantity"] += item.quantity
                            years[f"{year}"][f"{month}"]["total"] += item.quantity*self.unit_price

        return {
            "id": self.id,
            "category": self.category.name,
            "subcategory": self.subcategory.name if self.subcategory else None,
            "name": self.name,
            "unit_price": self.unit_price,
            "stock": self.stock-self.sold,
            "sold": self.sold,
            "sku": self.sku,
            "image": self.image,
            "description": self.description,
            "for_sale": self.for_sale,
            "all_time": years
        }
    

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    icon = db.Column(db.String(400))

    def __init__(self, name, icon):
        self.name = name
        self.icon = icon

    def __repr__(self):
        return f'<Payment {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "icon": self.icon
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customer.id"), nullable=False)
    customer = db.relationship("Customer")
    payment_id = db.Column(db.Integer, db.ForeignKey("payment.id"), nullable=False)
    payment = db.relationship("Payment")
    date = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.String(500))
    status = db.Column(db.String(15), nullable=False)

    def __init__(self, customer, payment, date, notes, status):
        self.customer = customer
        self.payment = payment
        self.date = date
        self.notes = notes
        self.status = status

    def __repr__(self):
        return f'<Order {self.id}>'

    def serialize(self):
        total_quantity = 0
        total_price = 0
        for itm in self.items:
            total_quantity += itm.quantity
            total_price += itm.product.unit_price*itm.quantity

        return {
            "id": self.id,
            "customer": self.customer.serialize(),
            "payment": self.payment.serialize(),
            "items": [itm.serialize() for itm in self.items],
            "total_quantity": total_quantity,
            "total_price": total_price,
            "date": self.date,
            "notes": self.notes,
            "status": self.status
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