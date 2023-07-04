from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt

from datetime import datetime
import re

#! TODO: --> enable image upload for logo + profile pic etc.
#! --> relationships and associations
#! --> figure out how the heck the form is going to work --> save choices as number based variables?
#! --> serialize

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.INTEGER, primary_key=True)
    username = db.Column(db.VARCHAR(20), unique=True, nullable=False)
    email = db.Column(db.VARCHAR, unique=True, nullable=False)
    _password_hash = db.Column(db.STRING)
    
    # Relationships and associations
    
    # Serializations
    
    # Validations
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
    
    # Relationships and associations
    
    # Serializations
    
    # Validations
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
    seller_id = db.Column(db.INTEGER, db.ForeignKey('sellers.id'))
    batch_size = db.Column(db.INTEGER, nullable=False)
    rollover_period = db.Column(db.INTEGER, nullable=False)
    
    # Relationships and associations
    
    # Serializations
    
    # Validations

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.INTEGER, primary_key=True)
    seller_id = db.Column(db.INTEGER, db.ForeignKey('sellers.id'))
    user_id = db.Column(db.INTEGER, db.ForeignKey('users.id'))
    item_id = db.Column(db.INTEGER, db.ForeignKey('items.id'))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships and associations
    item = db.relationship("Item", back_populates="orders")

    # Serializations
    
    # Validations
