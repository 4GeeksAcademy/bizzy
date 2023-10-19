from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    role = db.Column(db.String(15), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.nickname}>'

    def serialize(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
            "email": self.email,
            "role": self.role,
            "password": self.password,
        }
    
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), unique=True, nullable=False)
    category = db.Column(db.String(15), unique=False, nullable=False)
    unit_price = db.Column(db.Integer, nullable=False)
    unit_cost = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    sku = db.Column(db.String(15), unique=False, nullable=False)
    image = db.Column(db.String(200), unique=False, nullable=True)

    def __repr__(self):
        return f'<Product {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
            "name": self.name,
            "unit_price": self.unit_price,
            "unit_cost": self.unit_cost,
            "quantity": self.quantity,
            "stock": self.stock,
            "sku": self.sku,
            "image": self.image,
        }