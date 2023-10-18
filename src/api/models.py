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
    category = db.Column(db.String(15), unique=False, nullable=False)
    name = db.Column(db.String(120), unique=True, nullable=False)
    price = db.Column(db.String(80), unique=False, nullable=False)
    quantity = db.Column(db.String(15), unique=False, nullable=False)
    stock = db.Column(db.String(15), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.nickname}>'

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
            "name": self.name,
            "price": self.price,
            "quantity": self.quantity,
            "stock": self.stock,
        }