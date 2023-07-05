# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

import re

# Local imports
from config import app, db, api

from models import User, Seller, Item, Order, Favourite, FormItem, save_file

class Users(Resource):
    def get(self,user_id=None):
        if not user_id:
            return make_response([user.to_dict() for user in User.query.all()],200)
        if user := db.session.get(User,user_id):
            return make_response(user.to_dict(),200)
        else:
            return make_response({'error':'User Not Found'},404)
    
    def post(self):
        data = request.get_json()
        user = User(**data)
        try:
            user.password_hash = data['password']
            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(),201)
        except Exception as e:
            return make_response({'error':e},400)
    
    def patch(self, user_id):
        if user := db.session.get(User , user_id):
            data=request.get_json()
            try:
                user.username = data.get('username', user.username)
                user.email = data.get('email', user.email)
                user.password_hash = data.get('password', user.password_hash)
                user.email_notifications = data.get('email_notifications', user.email_notifications)
                db.session.commit()
                return make_response(user.to_dict(),200)
            except Exception as e:
                return make_response({'error':e},400)
    
    def delete(self, user_id):
        if user:=db.session.get(User, user_id):
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}
        else:
            return {'message': 'User not found'}, 404

if __name__ == '__main__':
    app.run(port=5555, debug=True)
