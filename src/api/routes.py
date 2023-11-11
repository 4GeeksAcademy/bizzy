"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, Subcategory, Customer, Order, Payment, Item
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
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

    user = User.query.filter_by( email=email, password=password ).one_or_none()
    if user is None:
        return {"message": f"Couldn't find user"}, 401
    
    # crea un nuevo token con el id de usuario dentro
    access_token = create_access_token( identity=user.id )
    return { "token": access_token, "user": user.serialize()} , 200

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
        subcategory = Subcategory.query.filter_by(name=subcategory).one_or_none()
        
        new_product = Product( name=name, category=category, subcategory=subcategory, unit_price=unit_price, stock=stock, 
                                sold=0, sku=sku, image=image, description=description, for_sale=False)
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
            
        if name: product.name = name
        if unit_price or unit_price == 0: product.unit_price = unit_price
        if stock or stock == 0: 
            product.stock = stock + product.serialize()["sold"]
        if sku: product.sku = sku
        if image: product.image = image
        if description: product.description = description
        if for_sale: 
            if for_sale == "true": for_sale = True
            elif for_sale == "false": for_sale = False
            product.for_sale = for_sale

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
        name = body.get("name", None)

        if name == None: return {"message": "Category name is missing"}, 400
        
        new_category = Category( name=name )
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
       
        if name: category.name = name

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

        if name == None: return {"message": "Sub-category name is missing"}, 400
        if category == None: return {"message": "Category is missing"}, 400
        
        category = Category.query.filter_by(name=category).one_or_none()  
        
        new_subcategory = Subcategory( name=name, category=category )
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
       
        if name: subcategory.name = name
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
    if not admin_required(): return {"message": "User is not an admin"}, 401

    body = request.get_json()
    name = body.get("name", None)
    email = body.get("email", None)
    phone = body.get("phone", None)
    payment =  body.get("payment", None)
    items = body.get("items", [])
    date =  body.get("date", None)
    notes =  body.get("notes", None)
    status =  body.get("status", None)

    customer = Customer.query.filter_by(name=name).one_or_none()
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
            new_product = Product.query.filter_by(id=product["id"]).one_or_none()
            new_item = Item(product=new_product, order=new_order, quantity=product["quantity"])
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
                new_product = Product.query.filter_by(id=product["id"]).one_or_none()
                new_item = Item(product=new_product, order=order, quantity=product["quantity"])
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
                            years[f"{year}"][f"{month}"]["quantity"] += item.quantity
                            years[f"{year}"][f"{month}"]["total"] += item.quantity*item.product.unit_price
            

        return {"years": years, "categories": categories}, 200
    except ValueError as err:
        return {"message": f"Failed to retrieve payments, {err}"}, 500