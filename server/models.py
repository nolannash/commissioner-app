from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt
import re

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.INTEGER, primary_key=True)
    username = db.Column(db.VARCHAR, unique=True, nullable=False)
    email = db.Column(db.VARCHAR, unique=True, nullable=False)
    _password_hash = db.Column(db.STRING)
    
    @validates("username")
    def validate_username(self, _, username):
        if not username:
            raise ValueError("User requires a username")
        elif not re.match("^[a-zA-Z0-9]*$", username):
            raise ValueError("User needs a username, 2-20 characters in length")
        elif User.query.filter_by(username=username).first():
            raise ValueError("An account with that UserName already exists")
        return username
    
    @validates("email")
    def validate_email(self, _, email):
        if not email:
            raise ValueError("Email is required")
        elif not re.match("[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}", email):
            raise ValueError("Email needs to be in a proper format")
        elif User.query.filter_by(email=email).first():
            raise ValueError("An account with that email already exists")
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
        return f"<user: {self.id}>"