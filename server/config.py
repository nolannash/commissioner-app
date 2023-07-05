from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

app.secret_key = os.environ.get('SECRET_KEY', 'dev')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db,render_as_batch=True)
db.init_app(app)
bcrypt = Bcrypt(app)

api = Api(app)

CORS(app)

jwt = JWTManager()
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
jwt.init_app(app)

app.config['MAIL_SERVER'] = 'your_mail_server'
app.config['MAIL_PORT'] = 587  # or the appropriate port number
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_username'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@example.com'

mail = Mail(app)