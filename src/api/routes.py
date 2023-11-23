"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, Subcategory, Customer, Order, Payment, Item
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import bcrypt
import copy


api = Blueprint('api', __name__)

#ADMIN REQUIRED FUNCTIOn
def admin_required():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.admin: 
        return True
    else: 
        return False


#TOKEN
@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password: return {"message": "Some field is missing in request body"}, 400

    user = User.query.filter_by( email=email ).one_or_none()

    if user is None:
        return {"message": f"Couldn't find user"}, 401
    
    password_byte = bytes(password, 'utf-8')
    
    if bcrypt.checkpw(password_byte, user.password.encode('utf-8')):
        return {'token': create_access_token(identity = user.id), "user": user.serialize()},200
    
    else:
        return {"message": "Invalid token :c"}, 400

@api.route("/account", methods=["GET"])
@jwt_required()
def account():
    # Accede a la identidad del usuario actual con get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return user.serialize(), 200
    else:
        return False

# [POST] USER
@api.route('/user', methods=['POST'])
def post_user():
    try:
        body = request.get_json()
        name = body.get("name", None)
        email = body.get("email", None)
        password = body.get("password", None)

        if name == None: return {"message": "Name is missing"}, 400
        if email == None: return {"message": "Email is missing"}, 400
        if password == None: return {"message": "Password is missing"}, 400

        bpassword = bytes(password, 'utf-8')
        salt = bcrypt.gensalt(14)
        hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)

        exist = User.query.filter_by(email=email).one_or_none()  
        if exist:
            return {"message": "Email already on use"}, 400
        new_user = User(name=name, email=email, password=hashed_password.decode('utf-8'), salt=salt.decode('utf-8'), active=False, admin=False)
        new_user.name = name
        db.session.add(new_user)
        db.session.commit()
        return new_user.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create subcategory, {err}"}, 500

# [PUT] USER
@api.route('/user/<user_id>', methods=['PUT'])
@jwt_required()
def put_user(user_id):
    current_user_id = get_jwt_identity()
    if not admin_required() and current_user_id != int(user_id): return {"message": "You're not allowed"}, 401
    try:
        user = User.query.get(user_id)

        body = request.get_json()
        name = body.get("name", None)
        email = body.get("email", None)
        old_password = body.get("password", None)
        password = body.get("new_password", None)
       
        if password:
            password_byte = bytes(old_password, 'utf-8')
            if not bcrypt.checkpw(password_byte, user.password.encode('utf-8')):
                return {"message": "Incorrect password"}, 401
            
            bpassword = bytes(password, 'utf-8')
            salt = bcrypt.gensalt(14)
            hashed_password = bcrypt.hashpw(password=bpassword, salt=salt)

            user.password = hashed_password.decode('utf-8')
            user.salt = salt.decode('utf-8')

        if name: user.name = name
        if email: user.email = email
        
        db.session.commit()
        
        return user.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit user, {err}"}, 500

# PRODUCTS

# [GET] ALL PRODUCTS
@api.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    if not admin_required(): return [], 401
    try:
        all_products = Product.query.all()
        products_list = [product.serialize() for product in all_products]
        products_list = sorted(products_list, key=lambda product: -product['id'])
        return products_list
    
    except ValueError as err:
        return {"message": f"Failed to retrieve products, {err}"}, 500

# [POST] ONE PRODUCT
@api.route('/product', methods=['POST'])
@jwt_required()
def post_product():
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        body = request.get_json()

        name = body.get("name", None)
        category = body.get ("category", None)
        subcategory = body.get ("subcategory", None)
        unit_price = body.get ("unit_price", None)
        stock = body.get ("stock", None)
        sku = body.get ("sku", None)
        image = body.get ("image", None)
        description = body.get ("description", None)
        
        info = (name, category, unit_price, stock, sku, image, description)
        for key in info:
            if key == None: return {"message": "Some field is missing in request body"}, 400

        category = Category.query.filter_by(name=category).one_or_none()
        subcategory = Subcategory.query.filter_by(name=subcategory, category=category).one_or_none()
        
        new_product = Product( name=name, category=category, subcategory=subcategory, unit_price=unit_price, stock=stock, 
                                sold=0, sku=sku, image=image, description=description, for_sale=True)
        db.session.add(new_product)
        db.session.commit()
        return new_product.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create product, {err}"}, 500

# [PUT] ONE PRODUCT
@api.route('/product/<product_id>', methods=['PUT'])
@jwt_required()
def put_product(product_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        product = Product.query.get(product_id)

        body = request.get_json()
        name = body.get("name", None)
        category = body.get("category", None)
        subcategory = body.get("subcategory", None)
        unit_price = body.get("unit_price", None)
        stock = body.get("stock", None)
        sku = body.get("sku", None)
        image = body.get("image", None)
        description = body.get("description", None)
        for_sale = body.get("for_sale", None)

        if category:
            category = Category.query.filter_by(name=category).one_or_none()
            product.category = category
            
        if subcategory:
            subcategory = Subcategory.query.filter_by(name=subcategory).one_or_none()
            if subcategory.category != category: subcategory = None
            product.subcategory = subcategory

        if not subcategory:
            product.subcategory = None
            
        if name: product.name = name
        if unit_price or unit_price == 0: product.unit_price = unit_price
        if sku: product.sku = sku
        if image: product.image = image
        if description: product.description = description
        if for_sale: 
            if for_sale == "true": for_sale = True
            elif for_sale == "false": for_sale = False
            product.for_sale = for_sale

        if stock or stock == 0: 
            product.stock = stock + product.sold
            if product.stock - product.sold <= 0: product.for_sale = False

        db.session.commit()
        
        return product.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit product, {err}"}, 500

# [DELETE] ONE PRODUCT    
@api.route("/product/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        selected_product = Product.query.get(product_id) or None
        if selected_product == None:
            return {"message": f"Product with id {product_id} does not exist"}, 400
        else:
            db.session.delete(selected_product)
            db.session.commit()
            return {"message": f"Product has been deleted"}, 200
        
    except ValueError as err:
        return {"message": f"Failed to delete product, {err}"}, 500

# CATEGORIES

# [GET] ALL CATEGORIES
@api.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    if not admin_required(): return [], 401
    try:
        all_categories = Category.query.all()

        return [category.serialize() for category in all_categories]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve categories, {err}"}, 500

# [POST] ONE CATEGORY
@api.route('/category', methods=['POST'])
@jwt_required()
def post_category():
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        body = request.get_json()
        name = body.get("name", None),
        icon = body.get("icon", None),
        banner = body.get("banner", None)

        if not name or not icon  or not banner : return {"message": "Something is missing"}, 400
        
        new_category = Category( name=name, icon=icon, banner=banner )
        db.session.add(new_category)
        db.session.commit()
        return new_category.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create category, {err}"}, 500
    
# [PUT] ONE CATEGORY
@api.route('/category/<category_id>', methods=['PUT'])
@jwt_required()
def put_category(category_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        category = Category.query.get(category_id)

        body = request.get_json()
        name = body.get("name", None)
        icon = body.get("icon", None)
       
        if name: category.name = name
        if icon: category.icon = icon

        db.session.commit()
        
        return category.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit category, {err}"}, 500

# SUBCATEGORIES

# [POST] ONE SUBCATEGORY
@api.route('/subcategory', methods=['POST'])
@jwt_required()
def post_subcategory():
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        body = request.get_json()
        category = body.get("category", None)
        name = body.get("name", None)
        image = body.get("image", None)

        if name == None: return {"message": "Sub-category name is missing"}, 400
        if category == None: return {"message": "Category is missing"}, 400
        if image == None: return {"message": "Image is missing"}, 400
        
        category = Category.query.filter_by(name=category).one_or_none()  
        
        new_subcategory = Subcategory( name=name, category=category, image=image )
        db.session.add(new_subcategory)
        db.session.commit()
        return new_subcategory.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create subcategory, {err}"}, 500

# [PUT] ONE SUBCATEGORY
@api.route('/subcategory/<subcategory_id>', methods=['PUT'])
@jwt_required()
def put_subcategory(subcategory_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        subcategory = Subcategory.query.get(subcategory_id)

        body = request.get_json()
        category = body.get("category", None)
        name = body.get("name", None)
        image = body.get("image", None)
       
        if name: subcategory.name = name
        if image: subcategory.image = image
        if category:
            category = Category.query.filter_by(name=category).one_or_none()  
            subcategory.category = category

        db.session.commit()
        
        return subcategory.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit subcategory, {err}"}, 500

# ORDERS

# [GET] ALL ORDERS
@api.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    if not admin_required(): return [], 401
    try:
        all_orders = Order.query.all()
        orders_list = [order.serialize() for order in all_orders]
        orders_list = sorted(orders_list, key=lambda order: -order['id'])
        return orders_list
    
    except ValueError as err:
        return {"message": f"Failed to retrieve orders, {err}"}, 500
    
# [POST] ONE ORDER
@api.route('/order', methods=['POST'])
@jwt_required()
def post_order():

    body = request.get_json()
    name = body.get("name", None)
    email = body.get("email", None)
    phone = body.get("phone", None)
    payment =  body.get("payment", None)
    items = body.get("items", [])
    date =  body.get("date", None)
    notes =  body.get("notes", None)
    status =  body.get("status", None)

    customer = Customer.query.filter_by(email=email).one_or_none()
    if customer is None:          
        customer = Customer( name=name, email=email, phone=phone )
        db.session.add(customer)
        db.session.commit()

    payment = Payment.query.filter_by(name=payment).one_or_none()

    new_order = Order(customer=customer, payment=payment, date=date, notes=notes, status=status)
    try:
        db.session.add(new_order)
        db.session.commit()

        for product in items:
            print(product["id"])
            selected_product = Product.query.filter_by(id=product["id"]).one_or_none()
            selected_product.sold += product["quantity"]
            if selected_product.stock - selected_product.sold <= 0:
                selected_product.for_sale = False
            new_item = Item(product=selected_product, order=new_order, quantity=product["quantity"])
            db.session.add(new_item)
            db.session.commit()
        
        return new_order.serialize(), 200
        
    except ValueError as err:
        return { "message" : f"Failed to create order, {err}" }, 500

# [PUT] ONE ORDER
@api.route('/order/<order_id>', methods=['PUT'])
@jwt_required()
def put_order(order_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        order = Order.query.get(order_id)

        body = request.get_json()
        customer = body.get("customer", None)
        items = body.get("items", None)
        date = body.get("date", None)
        payment = body.get("payment", None)
        notes = body.get("notes", None)
        status = body.get("status", None)
       
        if customer:
            customer = Customer.query.filter_by(name=customer).one_or_none()
            order.customer = customer

        if items:
            old_items = Item.query.filter_by(order=order)
            for item in old_items:
                db.session.delete(item)
                db.session.commit()

            for product in items:
                selected_product = Product.query.filter_by(id=product["id"]).one_or_none()
                selected_product.sold += product["quantity"]
                if selected_product.stock - selected_product.sold <= 0:
                    selected_product.for_sale = False
                new_item = Item(product=selected_product, order=order, quantity=product["quantity"])
                db.session.add(new_item)
                db.session.commit()

        if date: order.date = date
        if payment: order.payment = payment
        if notes: order.notes = notes
        if status: order.status = status

        db.session.commit()
        
        return order.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit order, {err}"}, 500

# [DELETE] ONE ORDER   
@api.route("/order/<int:order_id>", methods=["DELETE"])
@jwt_required()
def delete_order(order_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        selected_order = Order.query.get(order_id) or None
        if selected_order == None:
            return {"message": f"Order with id {order_id} does not exist"}, 400
        
        for item in selected_order.items:
            db.session.delete(item)
            db.session.commit()

        else:
            db.session.delete(selected_order)
            db.session.commit()
            return {"message": f"Order has been deleted"}, 200
        
    except ValueError as err:
        return {"message": f"Failed to delete order, {err}"}, 500

# CUSTOMER

# [GET] ALL CUSTOMERS
@api.route('/customers', methods=['GET'])
@jwt_required()
def get_customers():
    if not admin_required(): return [], 401
    try:
        all_customers = Customer.query.all()
        customers_list = [customer.serialize() for customer in all_customers]
        customers_list = sorted(customers_list, key=lambda customer: customer['id'])
        return customers_list
    
    except ValueError as err:
        return {"message": f"Failed to retrieve customers, {err}"}, 500
    
# [POST] ONE CUSTOMER
@api.route('/customer', methods=['POST'])
@jwt_required()
def post_customer():
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        body = request.get_json()
        name = body.get("name", None)
        email = body.get("email", None)
        phone = body.get("phone", None)

        if name == None: return {"message": "Customer name is missing"}, 400
        
        customer = Customer.query.filter_by(name=name).one_or_none()
        if customer: return {"message": f"Customer with name {name} already exists"}, 400
        
        new_customer = Customer( name=name, email=email, phone=phone )
        db.session.add(new_customer)
        db.session.commit()
        return new_customer.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create customer, {err}"}, 500
    
# [PUT] ONE CUSTOMER
@api.route('/customer/<customer_id>', methods=['PUT'])
@jwt_required()
def put_customer(customer_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        customer = Customer.query.get(customer_id)

        body = request.get_json()
        name = body.get("name", None)
        email = body.get("email", None)
        phone = body.get("phone", None)
        
        if name: customer.name = name
        if email: customer.email = email
        if phone: customer.phone = phone

        db.session.commit()
        
        return customer.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit customer, {err}"}, 500

# [DELETE] ONE CUSTOMER   
@api.route("/customer/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete_customer(customer_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        selected_customer = Customer.query.get(customer_id) or None
        if selected_customer == None:
            return {"message": f"customer with id {customer_id} does not exist"}, 400
        else:
            db.session.delete(selected_customer)
            db.session.commit()
            return {"message": f"Customer has been deleted"}, 200
        
    except ValueError as err:
        return {"message": f"Failed to delete customer, {err}"}, 500

# PAYMENT

# [GET] ALL PAYMENTS
@api.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():
    if not admin_required(): return [], 401
    try:
        all_payments = Payment.query.all()
        return [payment.serialize() for payment in all_payments]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve payments, {err}"}, 500
    
# [POST] ONE PAYMENT
@api.route('/payment', methods=['POST'])
@jwt_required()
def post_payment():
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        body = request.get_json()
        name = body.get("name", None)
        icon = body.get("icon", None)

        if name == None: return {"message": "Payment name is missing"}, 400
        
        payment = Payment.query.filter_by(name=name).one_or_none()
        if payment: return {"message": f"Payment with name {name} already exists"}, 400
        
        new_payment = Payment(name=name, icon=icon)

        db.session.add(new_payment)
        db.session.commit()

        return new_payment.serialize(), 200
    
    except ValueError as err:
        return {"message": f"Failed to create payment, {err}"}, 500

# [PUT] ONE PAYMENT
@api.route('/payment/<payment_id>', methods=['PUT'])
@jwt_required()
def put_payment(payment_id):
    if not admin_required(): return {"message": "User is not an admin"}, 401
    try:
        payment = Payment.query.get(payment_id)

        body = request.get_json()
        name = body.get("name", None)
        icon = body.get("icon", None)
       
        if name: payment.name = name
        if icon: payment.icon = icon

        db.session.commit()
        
        return payment.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit payment, {err}"}, 500
    
# CHARTS INFORMATION
# [GET] INFO
@api.route('/info', methods=['GET'])
@jwt_required()
def get_info():
    if not admin_required(): return [], 401
    try:
        data = {"income": 0 , "orders": 0, "customers": 0}
        years = {}
        categories = {}
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
        all_categories = Category.query.all()
        items = Item.query.all()
        orders = Order.query.all()
        customers = Customer.query.all()

        for customer in customers:
            data["customers"] += 1

        for order in orders:
            data["orders"] += 1

        for item in items:
            for category in all_categories:
                if category.name not in categories:
                    categories[f"{category.name}"] = 0
                if item.product.category == category:
                    categories[f"{category.name}"] += item.quantity

            if item.order.date[0:4] not in years:
                years[item.order.date[0:4]] = copy.deepcopy(months_template)
            for year in years:
                if item.order.date[0:4] == year:
                    for month in years[f"{year}"]:
                        if month == item.order.date[5:7]:
                            data["income"] += item.quantity*item.product.unit_price
                            years[f"{year}"][f"{month}"]["quantity"] += item.quantity
                            years[f"{year}"][f"{month}"]["total"] += item.quantity*item.product.unit_price
            

        return {"years": years, "categories": categories, "data": data}, 200
    except ValueError as err:
        return {"message": f"Failed to retrieve payments, {err}"}, 500
    

# SHOP INFORMATION
# [GET] SHOP INFO
@api.route('/shop', methods=['GET'])
def get_shop():
    try:
        all_products = Product.query.filter_by(for_sale=True)
        products_list = sorted(all_products, key=lambda product: -product.sold)
        products_list = [product.shop_serialize() for product in products_list]

        all_orders = Order.query.all()
        orders_list = [order.serialize() for order in all_orders]

        all_categories = Category.query.all()
        categories_list = [category.serialize() for category in all_categories]
        categories_list = sorted(categories_list, key=lambda category: -category["products_quantity"])

        all_payments = Payment.query.all()
        payments_list = [payment.serialize() for payment in all_payments]

        return {"products": products_list, "categories": categories_list, "payments": payments_list, "orders": orders_list}
            
    except ValueError as err:
        return {"message": f"Failed to retrieve payments, {err}"}, 500
    