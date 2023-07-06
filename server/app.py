from flask import request, make_response, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, unset_jwt_cookies
from datetime import datetime, timedelta
import re

from config import app, db, api, jwt
from models import User, Seller, Item, Order, Favorite, FormItem, save_file

class Users(Resource):
    @jwt_required()
    def get(self, user_id=None):
        if not user_id:
            users = User.query.all()
            return make_response([user.to_dict() for user in users], 200)
        if user := db.session.get(User,user_id):
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'User Not Found'}, 404)

    @jwt_required()
    def patch(self, user_id):
        if not (user := db.session.get(User, user_id)):
            return make_response({'error': 'User Not Found'}, 404)
        data = request.get_json()
        try:
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.password_hash = data.get('password', user.password_hash)
            user.email_notifications = data.get('email_notifications', user.email_notifications)
            db.session.commit()
            return make_response(user.to_dict(), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

    @jwt_required()
    def delete(self, user_id):
        if user := db.session.get(User,user_id):
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}
        else:
            return {'message': 'User not found'}, 404

class SignupUser(Resource):
    def post(self):

        try:
            data = request.get_json()
            user = User(
            username = data['username'],
            email = data['email'],
            password_hash = data['password']
            )

            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

class LoginUser(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user and user.verify_password(password):
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token}, 200
        else:
            return make_response({'message': 'Invalid email or password'}, 401)

class Sellers(Resource):
    @jwt_required()
    def get(self, seller_id=None):
        if seller_id:
            return (
                seller.to_dict()
                if (seller := db.session.get(Seller, seller_id))
                else ({'message': 'Seller not found'}, 404)
            )
        sellers = Seller.query.all()
        return [seller.to_dict() for seller in sellers]

    @jwt_required()
    def patch(self, seller_id):
        if not (seller := db.session.get(Seller, seller_id)):
            return {'message': 'Seller not found'}, 404
        data = request.get_json()
        try:
            seller.shopname = data.get('shopname', seller.shopname)
            seller.email = data.get('email', seller.email)
            seller.password_hash = data.get('password', seller.password_hash)
            seller.email_notifications = data.get('email_notifications', seller.email_notifications)
            db.session.commit()
            return {'message': 'Seller updated successfully'}
        except ValueError as e:
            return {'message': str(e)}, 400

    @jwt_required()
    def delete(self, seller_id):
        if seller := db.session.get(Seller,seller_id):
            db.session.delete(seller)
            db.session.commit()
            return {'message': 'Seller deleted successfully'}
        else:
            return {'message': 'Seller not found'}, 404

class SignupSeller(Resource):
    def post(self):
        data = request.get_json()
        seller = Seller(
            shopname=data['shopname'],
            email=data['email']
        )
        seller.password_hash = data['password']

        try:
            db.session.add(seller)
            db.session.commit()
            return {'message': 'Seller created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

class LoginSeller(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        seller = Seller.query.filter_by(email=email).first()
        if seller and seller.verify_password(password):
            access_token = create_access_token(identity=seller.id)
            return {'access_token': access_token}, 200
        else:
            return {'message': 'Invalid email or password'}, 401

class Items(Resource):
    def get(self, item_id=None):
        if item_id:
            return (
                item.to_dict()
                if (item := db.session.get(Item, item_id))
                else ({'message': 'Item not found'}, 404)
            )
        items = Item.query.all()
        return [item.to_dict() for item in items]

    def post(self):
        data = request.get_json()
        seller_id = data.get('seller_id')
        seller = db.session.get(Seller, seller_id)
        if not seller:
            return {'message': 'Seller not found'}, 404

        user_id = data.get('user_id')
        user = db.session.get(User, user_id)
        if not user:
            return {'message': 'User not found'}, 404

        item_id = data.get('item_id')
        item = db.session.get(Item, item_id)
        if not item:
            return {'message': 'Item not found'}, 404

        # Check if a rollover is required based on the rollover period
        if item.rollover_period:
            current_time = datetime.now()
            if item.last_rollover is None or (current_time - item.last_rollover) >= timedelta(days=item.rollover_period):
                # Reset the order count and update the last rollover timestamp
                item.order_count = 0
                item.last_rollover = current_time

        # Check if the batch size is exceeded
        if item.batch_size and item.order_count >= item.batch_size:
            return {'message': 'Commissions are closed for now.'}, 400

        # Create the order
        order = Order(seller=seller, user=user, item=item)
        try:
            db.session.add(order)
            item.order_count += 1
            db.session.commit()
            return {'message': 'Order created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400


    def patch(self, item_id):
        if not (item := db.session.get(Item, item_id)):
            return {'message': 'Item not found'}, 404
        data = request.get_json()
        try:
            item.batch_size = data.get('batch_size', item.batch_size)
            item.rollover_period = data.get('rollover_period', item.rollover_period)
            db.session.commit()
            return {'message': 'Item updated successfully'}
        except ValueError as e:
            return {'message': str(e)}, 400

    def delete(self, item_id):
        if item := db.session.get(Item,item_id):
            db.session.delete(item)
            db.session.commit()
            return {'message': 'Item deleted successfully'}, 204
        else:
            return {'message': 'Item not found'}, 404

class Orders(Resource):
    def get(self, order_id=None):
        if order_id:
            return (
                order.to_dict()
                if (order := db.session.get(Order, order_id))
                else ({'message': 'Order not found'}, 404)
            )
        orders = Order.query.all()
        return [order.to_dict() for order in orders]

    def post(self):
        data = request.get_json()
        seller_id = data.get('seller_id')
        seller = db.session.get(Seller,seller_id)
        if not seller:
            return {'message': 'Seller not found'}, 404

        user_id = data.get('user_id')
        user = db.session.get(User,user_id)
        if not user:
            return {'message': 'User not found'}, 404

        item_id = data.get('item_id')
        item = db.session.get(Item,item_id)
        if not item:
            return {'message': 'Item not found'}, 404

        order = Order(seller=seller, user=user, item=item)
        try:
            db.session.add(order)
            db.session.commit()
            return {'message': 'Order created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    def delete(self, order_id):
        if order := db.session.get(Order,order_id):
            db.session.delete(order)
            db.session.commit()
            return {'message': 'Order deleted successfully'}
        else:
            return {'message': 'Order not found'}, 404

class Favorites(Resource):
    def get(self, favorite_id=None):
        if favorite_id:
            return (
                favorite.to_dict()
                if (favorite := db.session.get(Favorite, favorite_id))
                else ({'message': 'Favorite not found'}, 404)
            )
        favorites = Favorite.query.all()
        return [favorite.to_dict() for favorite in favorites]

    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        user = db.session.get(User,user_id)
        if not user:
            return {'message': 'User not found'}, 404

        shop_id = data.get('shop_id')
        shop = db.session.get(Seller,shop_id)
        if not shop:
            return {'message': 'Shop not found'}, 404

        item_id = data.get('item_id')
        item = db.session.get(Item,item_id)
        if not item:
            return {'message': 'Item not found'}, 404

        favorite = Favorite(user=user, shop=shop, item=item)
        try:
            db.session.add(favorite)
            db.session.commit()
            favorite.notify_new_item(item)
            return {'message': 'Favorite created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    def delete(self, favorite_id):
        if favorite := db.session.get(Favorite,favorite_id):
            db.session.delete(favorite)
            db.session.commit()
            return {'message': 'Removed From Favorites'}, 204
        else:
            return {'message': 'Page Not Found'}, 404

class FormItems(Resource):
    def get(self, form_item_id=None):
        if form_item_id:
            return (
                form_item.to_dict()
                if (form_item := db.session.get(FormItem, form_item_id))
                else ({'message': 'Form Item not found'}, 404)
            )
        form_items = FormItem.query.all()
        return [form_item.to_dict() for form_item in form_items]

    def post(self):
        data = request.get_json()
        item_id = data.get('item_id')
        item = db.session.get(FormItem,item_id)
        if not item:
            return {'message': 'Item not found'}, 404

        form_item = FormItem(item=item, **data)
        try:
            db.session.add(form_item)
            db.session.commit()
            return {'message': 'Form Item created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    def patch(self, form_item_id):
        if not (form_item := db.session.get(FormItem,form_item_id)):
            return {'message': 'Form Item not found'}, 404
        data = request.get_json()
        try:
            form_item.component_type = data.get('component_type', form_item.component_type)
            form_item.options = data.get('options', form_item.options)
            db.session.commit()
            return {'message': 'Form Item updated successfully'}
        except ValueError as e:
            return {'message': str(e)}, 400

    def delete(self, form_item_id):
        if form_item := db.session.get(FormItem,form_item_id):
            db.session.delete(form_item)
            db.session.commit()
            return {'message': 'Form Item deleted successfully'}
        else:
            return {'message': 'Form Item not found'}, 404

class Logout(Resource):
    @jwt_required()
    def logout():
        response = jsonify({'message': 'Logout successful'})
        unset_jwt_cookies(response)
        return response, 200

api.add_resource(Users, '/users', '/users/<int:user_id>')
api.add_resource(SignupUser, '/signup/user','/signup/user')
api.add_resource(LoginUser, '/login/user')

api.add_resource(Sellers, '/sellers', '/sellers/<int:seller_id>')
api.add_resource(SignupSeller, '/signup/seller','/signup/seller')
api.add_resource(LoginSeller, '/login/seller')

api.add_resource(Logout, '/logout')

api.add_resource(Items, '/items', '/items/<int:item_id>')
api.add_resource(Orders, '/orders', '/orders/<int:order_id>')
api.add_resource(Favorites, '/favorites', '/favorites/<int:favorite_id>')
api.add_resource(FormItems, '/form-items', '/form-items/<int:form_item_id>')



if __name__ == '__main__':
    app.run(port=5555, debug=True, use_debugger=True,use_reloader=False)