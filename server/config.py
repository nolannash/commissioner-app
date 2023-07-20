from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_mail import Mail
from werkzeug.utils import secure_filename
from flask_jwt_extended import JWTManager
from datetime import timedelta
import uuid
import time
import os

app = Flask(__name__)


app.config['IMAGE_STORAGE'] = 'local'  

app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'UPLOAD_FOLDER')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


app.config['S3_BUCKET_NAME'] = "commissioner-bucket"
app.config['AWS_ACCESS_KEY'] = os.environ.get('AWS_ACCESS_KEY', 'default')
app.config['AWS_SECRET_KEY'] = os.environ.get('AWS_SECRET_KEY', 'default')


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.secret_key = os.environ.get('JWT_SECRET_KEY', 'dev')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db, render_as_batch=True)
db.init_app(app)
bcrypt = Bcrypt(app)

api = Api(app)

CORS(app)

app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = 'f22dbad3accd07'
app.config['MAIL_PASSWORD'] = '3591becb36a522'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev')
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config['JWT_ACCESS_COOKIE_SAMESITE'] = 'None'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_local(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{int(time.time())}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        return file_path
    return None

def save_file_s3(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{int(time.time())}_{filename}"

        s3_client = boto3.client('s3')
        response = s3_client.upload_file(unique_filename, app.config['S3_BUCKET_NAME'], unique_filename)

        return response
    return None


def save_file(file):
    if app.config['IMAGE_STORAGE'] == 'local':
        return save_file_local(file)
    elif app.config['IMAGE_STORAGE'] == 's3':
        return save_file_s3(file)
    else:
        raise ValueError("Invalid IMAGE_STORAGE setting")
