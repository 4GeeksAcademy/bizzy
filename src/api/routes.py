"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category
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
        unit_price = body.get ("unit_price", None)
        unit_cost = body.get ("unit_cost", None)
        quantity = body.get ("quantity", None)
        sku = body.get ("sku", None)
        image = body.get ("image", None)
        
        info = (name, category, unit_price, unit_cost, quantity, sku, image)
        for key in info:
            if key == None: return {"message": "Some field is missing in request body"}, 400

        category = Category.query.filter_by(name=category).one_or_none()
        
        new_product = Product( name=name, category=category, unit_price=unit_price, unit_cost=unit_cost,
                              quantity=quantity, stock=quantity, sku=sku, image=image)
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
        all_categories = Category.query.all()
        return [category.serialize() for category in all_categories]
    
    except ValueError as err:
        return {"message": "failed to retrieve planet " + err}, 500

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