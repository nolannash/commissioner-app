from flask import current_app
from flask_mail import Message
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt, mail
from datetime import datetime
import re
import os

UPLOAD_FOLDER = './UPLOAD_FOLDER'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Function to check if a file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to save the uploaded file
def save_file(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return filename
    return None

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.INTEGER, primary_key=True)
    username = db.Column(db.VARCHAR(20), unique=True, nullable=False)
    email = db.Column(db.VARCHAR, unique=True, nullable=False)
    _password_hash = db.Column(db.STRING)
    profile_photo = db.Column(db.VARCHAR)  # File path to profile photo
    email_notifications = db.Column(db.Boolean, default=False)

    favorites = db.relationship('Favorite', back_populates='user')

    @validates("username")
    def validate_username(self, key, username):
        if not username:
            raise ValueError("User requires a username")
        elif not re.match("^[a-zA-Z0-9]{2,20}$", username):
            raise ValueError("User needs a username, 2-20 characters in length")
        elif User.query.filter_by(username=username).first():
            raise ValueError("An account with that username already exists")
        return username

    @validates("email")
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email is required")
        elif not re.match("[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}", email):
            raise ValueError("Email needs to be in a proper format")
        elif User.query.filter_by(email=email).first():
            raise ValueError("An account with that email address already exists")
        return email

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    def __repr__(self):
        return f"<User {self.id}>"

class Seller(db.Model, SerializerMixin):
    __tablename__ = 'sellers'

    id = db.Column(db.INTEGER, primary_key=True)
    shopname = db.Column(db.VARCHAR(25), unique=True, nullable=False)
    email = db.Column(db.VARCHAR, unique=True, nullable=False)
    _password_hash = db.Column(db.STRING)
    logo_banner = db.Column(db.VARCHAR)  # the ~varchar~ is the file path to the photo
    profile_photo = db.Column(db.VARCHAR)  
    email_notifications = db.Column(db.Boolean, default=True)

    items = db.relationship('Item', back_populates='seller')

    @validates("shopname")
    def validate_shopname(self, key, shopname):
        if not shopname:
            raise ValueError("You need to name your shop!")
        elif not re.match("^[a-zA-Z0-9]{2,25}$", shopname):
            raise ValueError("Your shop name can be between 2 and 25 characters in length")
        elif Seller.query.filter_by(shopname=shopname).first():
            raise ValueError("An account with that shop name already exists")
        return shopname

    @validates("email")
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email is required")
        elif not re.match("[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}", email):
            raise ValueError("Email needs to be in a proper format")
        elif Seller.query.filter_by(email=email).first():
            raise ValueError("An account with that email address already exists")
        return email

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    def __repr__(self):
        return f"<Seller {self.id}>"

class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.INTEGER, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))
    batch_size = db.Column(db.INTEGER, nullable=False)
    rollover_period = db.Column(db.INTEGER, nullable=False)

    seller = db.relationship('Seller', back_populates='items')
    orders = db.relationship("Order", back_populates="item")
    form_items = db.relationship("FormItem", back_populates="item", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Item {self.id}>"

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.INTEGER, primary_key=True)
    seller_id = db.Column(db.INTEGER, db.ForeignKey('sellers.id'))
    user_id = db.Column(db.INTEGER, db.ForeignKey('users.id'))
    item_id = db.Column(db.INTEGER, db.ForeignKey('items.id'))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    item = db.relationship("Item", back_populates="orders")

    def __repr__(self):
        return f"<Order {self.id}>"

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    shop_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='favorites')
    shop = db.relationship('Seller', back_populates='favorites')
    item = db.relationship("Item", backref="favorites")

    def notify_new_item(self, item):
        if self.user.email and self.user.email_notifications:
            msg = Message("New Item Alert",
                sender=current_app.config['MAIL_DEFAULT_SENDER'],
                recipients=[self.user.email])
            msg.body = f"Shop '{self.shop.shopname}' has added a new item: '{item.name}'"
            mail.send(msg)

    def notify_item_available(self, item):
        if self.user.email and self.user.email_notifications:
            msg = Message("Item Available Alert",
                sender=current_app.config['MAIL_DEFAULT_SENDER'],
                recipients=[self.user.email])
            msg.body = f"The item '{item.name}' is now available in shop '{self.shop.shopname}'"
            mail.send(msg)

    def __repr__(self):
        return f"<Favorite {self.id}>"

class FormItem(db.Model):
    __tablename__ = 'form_items'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'))
    component_type = db.Column(db.String, nullable=False)
    options = db.Column(db.String)

    item = db.relationship('Item', back_populates='form_items')

    def __repr__(self):
        return f"<FormItem {self.id}>"
