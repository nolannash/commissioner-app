from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

app.secret_key = os.environ.get('JWT_SECRET_KEY', 'dev')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

UPLOAD_FOLDER = './UPLOAD_FOLDER'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db,render_as_batch=False)
db.init_app(app)
bcrypt = Bcrypt(app)

api = Api(app)

CORS(app)

jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev')
jwt.init_app(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES']= timedelta(minutes=10)

app.config['MAIL_SERVER'] = 'your_mail_server'
app.config['MAIL_PORT'] = 587  # or the appropriate port number
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_username'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@example.com'

mail = Mail(app)