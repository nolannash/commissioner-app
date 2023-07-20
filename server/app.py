from flask import request, make_response, jsonify, send_from_directory, send_file
from flask_restful import Resource
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity, set_access_cookies,  unset_jwt_cookies
from werkzeug.utils import secure_filename
from config import app, db, api,save_file, allowed_file
from models import User, Seller, Item, Order, Favorite, FormItem, ItemImage

import boto3
import os

class Users(Resource):
    @jwt_required()
    def get(self, user_id=None):

        if not user_id:
            users = User.query.all()
            return make_response([user.to_dict() for user in users], 200)
        if user := User.query.get(user_id):
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'User Not Found'}, 404)

    @jwt_required()
    def patch(self, user_id):
        if not (user := User.query.get(user_id)):
            return {'error': 'User not found'}, 404
        data = request.get_json()
        try:
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.email_notifications = data.get('email_notifications', user.email_notifications)
            db.session.commit()
            return make_response(user.to_dict(), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 400)

    @jwt_required()
    def delete(self, user_id):
        if user := User.query.get(user_id):
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}
        else:
            return {'message': 'User not found'}, 404

class Sellers(Resource):
    def get(self, seller_id=None):
        if seller_id:
            return (
                seller.to_dict()
                if (seller := Seller.query.get(seller_id))
                else ({'message': 'Seller not found'}, 404)
            )
        sellers = Seller.query.all()
        return [seller.to_dict() for seller in sellers]

    @jwt_required()
    def patch(self, seller_id):
        if not (seller := Seller.query.get(seller_id)):
            return {'message': 'Seller not found'}, 404
        data = request.get_json()
        try:
            seller.shopname = data.get('shopname', seller.shopname)
            seller.email = data.get('email', seller.email)
            seller.bio = data.get('bio',seller.bio)
            
            seller.email_notifications = data.get('email_notifications', seller.email_notifications)
            db.session.commit()
            return make_response(seller.to_dict(),204)
        except ValueError as e:
            return {'message': str(e)}, 400

    @jwt_required()
    def delete(self, seller_id):
        if seller := Seller.query.get(seller_id):
            db.session.delete(seller)
            db.session.commit()
            return {'message': 'Seller deleted successfully'}
        else:
            return {'message': 'Seller not found'}, 404

class Items(Resource):
    def get(self, item_id=None):
        if item_id:
            return (
                item.to_dict()
                if (item := Item.query.get(item_id))
                else ({'message': 'Item not found'}, 404)
            )
        items = Item.query.all()
        return [item.to_dict() for item in items]

    def post(self):
        data = request.get_json()
        seller_id = data.get('seller_id')
        seller = Seller.query.get(seller_id)
        if not seller:
            return {'message': 'Seller not found'}, 404


        item = Item(seller=seller, **data)
        try:
            db.session.add(item)
            db.session.commit()
            return {'message': 'Item created successfully', 'item': item.to_dict()}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    def patch(self, item_id):
        if not (item := Item.query.get(item_id)):
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
        if item := Item.query.get(item_id):
            db.session.delete(item)
            db.session.commit()
            return {'message': 'Item deleted successfully'}, 204
        else:
            return {'message': 'Item not found'}, 404


class Orders(Resource):
    @jwt_required()
    def get(self, order_id=None):
        if order_id:
            return (
                order.to_dict()
                if (order := Order.query.get(order_id))
                else {'message': 'Order not found'}, 404
            )
        orders = Order.query.all()
        return [order.to_dict() for order in orders]


    @jwt_required()
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

        form_responses = data.get('form_responses', [])
        if not form_responses:
            return {'message': 'Form responses are required'}, 400

        user_response = ','.join(response_data.get('response') for response_data in form_responses)

        order = Order(seller=seller, user=user, item=item, user_response=user_response)
        try:
            db.session.add(order)
            db.session.commit()

            db.session.commit()

            item.order_count += 1
            item.rollover_logic()
            db.session.commit()

            return {'message': 'Order and form responses created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    @jwt_required()
    def delete(self, order_id):
        if order := db.session.get(Order, order_id):
            db.session.delete(order)
            db.session.commit()

            item = order.item
            item.order_count -= order.order_quantity
            item.rollover_logic()
            db.session.commit()

            return {'message': 'Order deleted successfully'}
        else:
            return {'message': 'Order not found'}, 404


class Favorites(Resource):
    def get(self, favorite_id=None):
        if favorite_id:
            return (
                favorite.to_dict()
                if (favorite := Favorite.query.get(favorite_id))
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
            return {'message': 'Succsessfully added to Favorites!'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    def delete(self, favorite_id):
        if favorite := db.session.get(Favorite,favorite_id):
            db.session.delete(favorite)
            db.session.commit()
            return {'message': 'Removed From Favorites'}, 204
        else:
            return {'message': 'Page Not Found'}, 404

class Favorites(Resource):
    @jwt_required()
    def get(self, favorite_id=None):
        if favorite_id:
            return (
                favorite.to_dict()
                if (favorite := Favorite.query.get(favorite_id))
                else ({'message': 'Favorite not found'}, 404)
            )
        favorites = Favorite.query.all()
        return [favorite.to_dict() for favorite in favorites]

    @jwt_required()
    def post(self):
        data = request.get_json()
        item_id = data.get('item_id')
        item = db.session.get(Item, item_id)
        if not item:
            return {'message': 'Item not found'}, 404

        current_user_id = get_jwt_identity()
        user = db.session.get(User, current_user_id)
        if not user:
            return {'message': 'User not found'}, 404

        favorite = Favorite.query.filter_by(user_id=current_user_id, item_id=item_id).first()
        if favorite:
            return {'message': 'Item already in favorites'}, 200

        favorite = Favorite(user=user, item=item)
        db.session.add(favorite)
        db.session.commit()
        return {'message': 'Successfully added to Favorites!'}, 201

    @jwt_required()
    def delete(self, favorite_id):
        favorite = Favorite.query.get(favorite_id)
        if not favorite:
            return {'message': 'Favorite not found'}, 404

        db.session.delete(favorite)
        db.session.commit()
        return {'message': 'Removed from Favorites'}, 204


class FormItems(Resource):
    def get(self, form_item_id=None):
        if form_item_id:
            return (
                form_item.to_dict()
                if (form_item := Item.query.get(form_item_id))
                else ({'message': 'Form Item not found'}, 404)
            )
        form_items = FormItem.query.get()
        return [form_item.to_dict() for form_item in form_items]

    def post(self, item_id):
        data = request.get_json()
        item_id = data.get('item_id')
        item = db.session.get(Item,item_id)
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

class Recent(Resource):
    def get(self):
        recent_shops = Seller.query.order_by(Seller.created_at.desc()).limit(10).all()
        recent_items = Item.query.order_by(Item.created_at.desc()).limit(10).all()

        recent_shops_data = [shop.to_dict() for shop in recent_shops]
        recent_items_data = [item.to_dict() for item in recent_items]

        return {'recent_shops': recent_shops_data, 'recent_items': recent_items_data}

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)
    return response, 200

class SellerItems(Resource):
    @jwt_required()
    def get(self, id, item_id=None):
        seller = Seller.query.get(id)
        if not seller:
            return {'message': 'Seller not found'}, 404

        if item_id:
            item = Item.query.filter_by(id=item_id, seller=seller).first()
            if not item:
                return {'message': 'Item not found'}, 404
            return make_response(item.to_dict(), 200)

        items = Item.query.filter_by(seller=seller).all()
        if len(items) == 0:
            return {'message': 'You do not have any items'}, 204
        else:
            return make_response([item.to_dict() for item in items], 200)

    @jwt_required()
    def post(self, id):
        data = request.form

        seller = Seller.query.get(id)
        if not seller:
            return {'message': 'Seller not found'}, 404
        
        item = Item( **data)
        
        try:
            file = request.files.get('images')
            if file and allowed_file(file.filename):
                filepath = save_file(file)
                
                db.session.add(item)
                db.session.commit()
                item.rollover_logic()

                item_images = []
                for image_file in request.files.getlist('images'):
                    if image_file and allowed_file(image_file.filename):
                        image_path = save_file(image_file)
                        item_image = ItemImage(item_id=item.id, image_path=image_path)  # Set item_id and image_path here
                        item_images.append(item_image)

                if item_images:
                    db.session.bulk_save_objects(item_images)
                    db.session.commit()
                
                return {'message': 'Item created successfully'}, 201
        except ValueError as e:
            return {'message': str(e)}, 400

    @jwt_required()
    def patch(self, id, item_id):
        seller = Seller.query.get(id)
        if not seller:
            return {'message': 'Seller not found'}, 404

        item = Item.query.filter_by(id=item_id, seller=seller).first()
        if not item:
            return {'message': 'Item not found'}, 404

        data = request.get_json()
        try:
            item.batch_size = data.get('batch_size', item.batch_size)
            item.rollover_period = data.get('rollover_period', item.rollover_period)
            db.session.commit()
            item.rollover_logic()
            return {'message': 'Item updated successfully'}
        except ValueError as e:
            return {'message': str(e)}, 400

    @jwt_required()
    def delete(self, id, item_id):
        seller = Seller.query.get(id)
        if not seller:
            return {'message': 'Seller not found'}, 404

        item = Item.query.filter_by(id=item_id, seller=seller).first()
        if not item:
            return {'message': 'Item not found'}, 404

        db.session.delete(item)
        db.session.commit()
        return {'message': 'Item deleted successfully'}

@app.route("/signup/user",methods=["POST"])
def signupuser():
    data = request.get_json()
    try: 
        user=User(username=data['username'],email=data['email'])
        user.password_hash = data['password']
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity=user.id)
        response = make_response({'user':user.to_dict()},201)
        set_access_cookies(response,token)
        return response

    except Exception as e:
        return make_response({'error':str(e)},400)

@app.route('/login/user',methods={'POST'})
def login_user():
    data = request.get_json()
    if user := User.query.filter_by(email=data.get("email", "")).first():
        if user.authenticate(data.get('password','')):
            token = create_access_token(identity=user.id)
            response = make_response({'user': user.to_dict()}, 201)
            set_access_cookies(response, token)
            return response
        return make_response({'error':'Invalid Username or Password'}, 401)
    return make_response({'error': 'User not found'}, 404)

@app.route("/signup/seller",methods=["POST"])
def signupseller():
    data = request.get_json()
    try: 
        seller=Seller(shopname=data['shopname'],email=data['email'])
        seller.password_hash=data['password']
        db.session.add(seller)
        db.session.commit()
        token = create_access_token(identity=seller.id)
        response = make_response({'seller':seller.to_dict()},201)
        set_access_cookies(response,token)
        return response

    except Exception as e:
        return make_response({'error':str(e)},400)

@app.route('/login/seller', methods=['POST'])
def login_seller():
    data = request.get_json()
    email = data.get('email', '')
    password = data.get('password', '')

    seller = Seller.query.filter_by(email=email).first()
    user = User.query.filter_by(email=email).first()

    if seller and not user: 
        if seller.authenticate(password):
            token = create_access_token(identity=seller.id)
            response = make_response({'seller': seller.to_dict()}, 201)
            set_access_cookies(response, token)
            return response
        else:
            return make_response({'error': 'Invalid Username or Password'}, 401)
    elif user:
        return make_response({'error': 'Please sign in as a user'}, 400)
    else:
        return make_response({'error': 'User not found'}, 404)

@app.route('/uploads/<path:filename>', methods=['GET'])

def serve_uploaded_file(filename):
    s3_client = boto3.client('s3')
    response = s3_client.generate_presigned_url('get_object', Params={'Bucket': app.config['S3_BUCKET_NAME'], 'Key': filename})
    return send_file(response, as_attachment=True)

@app.route('/users/<int:user_id>/profile-photo', methods=['PATCH','DELETE'])
def handle_user_profile_photo(user_id):
    if request.method == 'PATCH':
        return upload_user_profile_photo(user_id)
    elif request.method == 'DELETE':
            return delete_user_profile_photo(user_id)
    else:
            return jsonify({'message': 'Method not allowed'}), 405

def upload_user_profile_photo(user_id):
    data = request.form
    user = User.query.get(user_id)
    if not user:
        return {'message': 'User not found'}, 404
    file = request.files.get('profilePhoto')
    if not file:
        return {'message': 'No file uploaded'}, 400
    file_path = save_file(file)
    user.profile_photo = file_path
    db.session.commit()
    return jsonify({'message': 'Profile Photo successfully'}), 204

def delete_user_profile_photo(user_id):
    user = db.session.query(User).get('userId')
    if not user:
        return {'message': 'User not found'}, 404
    if not user.profile_photo:
            return jsonify({'message': 'Profile photo not found'}), 404
    file_path = user.profile_photo
    if os.path.exists(file_path):
        os.remove(file_path)
    user.profile_photo = None
    db.session.commit()
    return jsonify({'message': 'Profile Photo successfully'}), 204
    

@jwt_required()
@app.route('/sellers/<int:seller_id>/logo_banner', methods=['PATCH','DELETE'])
def handle_seller_logo_banner(seller_id):
    if request.method == 'PATCH':
        return upload_seller_logo_banner(seller_id)
    elif request.method == 'DELETE':
        return delete_seller_logo_banner(seller_id)
    else:
        return jsonify({'message': 'Method not allowed'}), 405

def upload_seller_logo_banner(seller_id):
    data = request.form
    file = request.files.get('logoBanner')
    seller = db.session.query(Seller).get(data.get('userId'))
    if not seller:
        return jsonify({'message': 'Seller not found'}), 404

    if not file:
        return jsonify({'message': 'No file uploaded'}), 400

    file_path = save_file(file)
    seller.logo_banner = file_path
    db.session.commit()
    return jsonify({'message': 'Profile Logo Banner successfully'}), 204


def delete_seller_logo_banner(seller_id):
    seller = db.session.query(Seller).get(seller_id)
    if not seller:
        return jsonify({'message': 'Seller not found'}), 404

    if not seller.logo_banner:
        return jsonify({'message': 'Profile photo not found'}), 404
    file_path = seller.logo_banner
    if os.path.exists(file_path):
        os.remove(file_path)

    seller.logo_banner = None
    db.session.commit()
    return jsonify({'message': 'Profile photo deleted successfully'}), 204


@jwt_required()
@app.route('/sellers/<int:seller_id>/profile_photo', methods=['PATCH','DELETE'])
def handle_seller_profile_photo(seller_id):
    if request.method == 'PATCH':
        return upload_seller_profile_photo(seller_id)
    elif request.method == 'DELETE':
        return delete_seller_profile_photo(seller_id)
    else:
        return jsonify({'message': 'Method not allowed'}), 405

def upload_seller_profile_photo(seller_id):
    data = request.form
    file = request.files.get('profilePhoto')
    seller = db.session.query(Seller).get(data.get('userId'))
    if not seller:
        return jsonify({'message': 'Seller not found'}), 404

    if not file:
        return jsonify({'message': 'No file uploaded'}), 400

    file_path = save_file(file)
    seller.profile_photo = file_path
    db.session.commit()
    return jsonify({'message': 'Profile photo uploaded successfully'}), 204


def delete_seller_profile_photo(seller_id):
    seller = db.session.query(Seller).get(seller_id)
    if not seller:
        return jsonify({'message': 'Seller not found'}), 404

    if not seller.profile_photo:
        return jsonify({'message': 'Profile photo not found'}), 404

    file_path = seller.profile_photo
    if os.path.exists(file_path):
        os.remove(file_path)

    seller.profile_photo = None
    db.session.commit()
    return jsonify({'message': 'Profile photo deleted successfully'}), 204

@app.route('/items/<int:item_id>/images', methods=['POST'])
def upload_item_images(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify(message='Item not found'), 404

    images = request.files.getlist('images')
    saved_image_paths = []

    for image in images:
        if allowed_file(image.filename):
            file_path = save_file(image)
            if file_path:
                saved_image_paths.append(file_path)
            else:
                return jsonify(message='Failed to save file'), 400
        else:
            return jsonify(message='Invalid file'), 400

    for image_path in saved_image_paths:
        item_image = ItemImage(item_id=item_id, image_path=image_path)
        db.session.add(item_image)
    db.session.commit()
    item_images = ItemImage.query.filter_by(item_id=item_id).all()
    item.images = item_images
    db.session.commit()

    return make_response(item.to_dict(), 201)

@jwt_required()
@app.route('/users/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    user = User.query.get(user_id)
    if user:
        orders = user.orders
        return jsonify([order.to_dict() for order in orders])
    else:
        return jsonify({"message": "User not found"}), 404

@jwt_required()
@app.route('/sellers/<int:seller_id>/orders', methods=['GET'])
def get_seller_orders(seller_id):
    seller = Seller.query.get(seller_id)
    if seller:
        orders = seller.orders
        return jsonify([order.to_dict() for order in orders])
    else:
        return jsonify({"message": "Seller not found"}), 404

class ItemFormItems(Resource):
    @jwt_required()
    def get (self, item_id=None):
        item = Item.query.get(item_id)
        if item:
            form_items = FormItem.query.filter_by(item_id=item_id).all()
            return make_response([fi.to_dict() for fi in form_items],200)
        return {'error':'Could Not Find Form Items'},404


@app.route('/refresh_token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    id_ = get_jwt_identity()
    user = db.session.get(User, id_)
    seller = db.session.get(Seller, id_)
    new_access_token = create_access_token(identity=id_)
    if user:
        response = make_response({"user": user.to_dict()}, 200)
    if seller:
        response = make_response({"seller": seller.to_dict()}, 200)
    set_access_cookies(response, new_access_token)
    return response

@app.route("/me", methods=["GET"])
@jwt_required()
def me():
    if id_ := get_jwt_identity():
        if user := db.session.get(User, id_):
            return make_response(user.to_dict(), 200)
    return make_response({"error": "Unauthorized"}, 401)

api.add_resource(ItemFormItems, '/items/<int:item_id>/form_items')

api.add_resource(SellerItems, '/sellers/<int:id>/items', '/sellers/<int:id>/items/<int:item_id>')

api.add_resource(Users, '/users', '/users/<int:user_id>')

api.add_resource(Sellers, '/sellers', '/sellers/<int:seller_id>')

api.add_resource(Recent, '/recent')

api.add_resource(Items, '/items', '/items/<int:item_id>')

api.add_resource(Orders, '/orders', '/orders/<int:order_id>')

api.add_resource(Favorites, '/favorites', '/favorites/<int:favorite_id>', '/favorites/<int:seller_id>/favorites')

api.add_resource(FormItems, '/form-items', '/form-items/<int:item_id>',)


if __name__ == '__main__':
    UPLOAD_FOLDER = os.path.join(app.root_path, 'UPLOAD_FOLDER')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    app.run(port=5555, debug=True, use_debugger=True,use_reloader=False)
else:
    app.config['IMAGE_STORAGE'] = "s3"
    