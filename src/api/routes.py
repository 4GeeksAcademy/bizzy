"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, Subcategory, Customer, Order, Payment, Item
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)

# PRODUCTS

# [GET] ALL PRODUCTS
@api.route('/products', methods=['GET'])
def get_products():
    try:
        all_products = Product.query.all()
        return [product.serialize() for product in all_products]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve products, {err}"}, 500

# [POST] ONE PRODUCT
@api.route('/product', methods=['POST'])
def post_product():
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
def put_product(product_id):
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

        if category:
            category = Category.query.filter_by(name=category).one_or_none()
            product.category = category
            
        if subcategory:
            subcategory = Subcategory.query.filter_by(name=subcategory).one_or_none()
            if subcategory.category != category: subcategory = None
            product.subcategory = subcategory
            
        if name: product.name = name
        if unit_price: product.unit_price = unit_price
        if stock: product.stock = stock + product.serialize()["sold"]
        if sku: product.sku = sku
        if image: product.image = image
        if description: product.description = description

        db.session.commit()
        
        return product.serialize(), 200
 
    except ValueError as err:
        return {"message": f"Failed to edit product, {err}"}, 500

# [DELETE] ONE PRODUCT    
@api.route("/product/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
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
def get_categories():
    try:
        all_categories = Category.query.all()

        return [category.serialize() for category in all_categories]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve categories, {err}"}, 500

# [POST] ONE CATEGORY
@api.route('/category', methods=['POST'])
def post_category():
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
def put_category(category_id):
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
def post_subcategory():
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
def put_subcategory(subcategory_id):
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
def get_orders():
    try:
        all_orders = Order.query.all()
        return [order.serialize() for order in all_orders]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve orders, {err}"}, 500
    
# [POST] ONE ORDER
@api.route('/order', methods=['POST'])
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
def put_order(order_id):
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
def get_customers():
    try:
        all_customers = Customer.query.all()
        return [customer.serialize() for customer in all_customers]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve customers, {err}"}, 500
    
# [POST] ONE CUSTOMER
@api.route('/customer', methods=['POST'])
def post_customer():
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
def put_customer(customer_id):
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

# PAYMENT

# [GET] ALL PAYMENTS
@api.route('/payments', methods=['GET'])
def get_payments():
    try:
        all_payments = Payment.query.all()
        return [payment.serialize() for payment in all_payments]
    
    except ValueError as err:
        return {"message": f"Failed to retrieve payments, {err}"}, 500
    
# [POST] ONE PAYMENT
@api.route('/payment', methods=['POST'])
def post_payment():
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
def put_payment(payment_id):
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