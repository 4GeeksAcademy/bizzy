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
        return {"message": "failed to retrieve planet " + err}, 500

# [POST] ONE PRODUCT
@api.route('/product', methods=['POST'])
def post_product():
    try:
        body = request.get_json()

        name = body.get("name", None)
        category = body.get ("category", None)
        subcategory = body.get ("subcategory", None)
        unit_price = body.get ("unit_price", None)
        quantity = body.get ("quantity", None)
        sku = body.get ("sku", None)
        image = body.get ("image", None)
        description = body.get ("description", None)
        
        info = (name, category, unit_price, quantity, sku, image, description)
        for key in info:
            if key == None: return {"message": "Some field is missing in request body"}, 400

        category = Category.query.filter_by(name=category).one_or_none()
        subcategory = Subcategory.query.filter_by(name=subcategory).one_or_none()
        
        new_product = Product( name=name, category=category, subcategory=subcategory, unit_price=unit_price, quantity=quantity, 
                                sku=sku, image=image, description=description)
        db.session.add(new_product)
        db.session.commit()
        return new_product.serialize(), 200
    
    except ValueError as err:
        return {"message": "failed to retrieve planet " + err}, 500

# [DELETE] ONE PRODUCT    
@api.route("/product/<int:product_id>", methods=["DELETE"])
def delete_people(product_id):
    try:
        selected_product = Product.query.get(product_id) or None
        if selected_product == None:
            return {"message": f"Product with id {product_id} does not exist"}, 400
        else:
            db.session.delete(selected_product)
            db.session.commit()
            return {"message": f"Product has been deleted"}, 200
        
    except ValueError as err:
        return {"message": "failed to retrieve people " + err}, 500

# CATEGORIES

# [GET] ALL CATEGORIES
@api.route('/categories', methods=['GET'])
def get_categories():
    try:
        new_categories = []
        all_categories = Category.query.all()
        all_subcategories = Subcategory.query.all()
        for category in all_categories:
            cat = category.serialize()
            for subcategory in all_subcategories:
                subcat = subcategory.serialize()
                if cat["name"] == subcat["category"]:
                    cat["subcategories"].append(subcat)
            new_categories.append(cat)

        return new_categories
    
    except ValueError as err:
        return {"message": "Failed to retrieve categories " + err}, 500

# [POST] ONE CATEGORY
@api.route('/category', methods=['POST'])
def post_category():
    try:
        body = request.get_json()

        name = body.get("name", None)

        if name == None: return {"message": "Some field is missing in request body"}, 400
        
        new_category = Category( name=name )
        db.session.add(new_category)
        db.session.commit()
        return new_category.serialize(), 200
    
    except ValueError as err:
        return {"message": "failed to retrieve planet " + err}, 500
    
# ORDERS

# [GET] ALL ORDERS
@api.route('/orders', methods=['GET'])
def get_orders():
    try:
        all_orders = Order.query.all()
        return [order.serialize() for order in all_orders]
    
    except ValueError as err:
        return {"message": "Failed to retrieve orders" + err}, 500
    
# [POST] ONE ORDER
@api.route('/orders', methods=['POST'])
def post_order():

    body = request.get_json()
    customer = body.get("customer", None)
    payment =  body.get("payment", None)
    items = body.get("products", [])

    if customer != None and payment != None:

        customer = Customer.query.filter_by(id=customer).one_or_none()
        payment = Payment.query.filter_by(id=payment).one_or_none()

        new_order = Order(customer=customer, payment=payment)
        try:
            db.session.add(new_order)
            db.session.commit()

            for i in items:
                new_product = Product.query.filter_by(id=i).one_or_none()  
                new_item = Item(product=new_product, order=new_order)
                db.session.add(new_item)
                db.session.commit()

            return new_order.serialize()   , 200
            
        except ValueError as err:
            return { "message" : f"Something went wrong, {err}" }, 500
        
    else:
        return { "Something is missing or incorrect" }, 500
