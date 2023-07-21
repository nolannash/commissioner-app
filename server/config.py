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
from botocore.exceptions import ClientError
import boto3
import uuid
import time
import os

# Create the Flask app
app = Flask(__name__)

# Configurations

# Set the image storage type (either 'local' or 's3')
app.config['IMAGE_STORAGE'] = 's3'

# Upload folder for local storage (if IMAGE_STORAGE == 'local')
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'UPLOAD_FOLDER')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# AWS S3 configurations
app.config['S3_BUCKET_NAME'] = "commissioner-bucket"
app.config['AWS_ACCESS_KEY'] = os.getenv('AWS_ACCESS_KEY')
app.config['AWS_SECRET_KEY'] = os.getenv('AWS_SECRET_KEY')
app.config['AWS_REGION'] = "us-west-1"

# SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

# JWT secret key for authentication
app.secret_key = os.environ.get('JWT_SECRET_KEY', 'dev')

# Disable tracking modifications to improve performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Compact JSON representation (optional)
app.json.compact = False

# Metadata for SQLAlchemy with custom naming convention
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize SQLAlchemy with the app and metadata
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db, render_as_batch=True)
db.init_app(app)

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Initialize Flask-RESTful API
api = Api(app)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Mail configurations (using Mailtrap for testing)
app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = 'f22dbad3accd07'
app.config['MAIL_PASSWORD'] = '3591becb36a522'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# JWT configurations for token-based authentication
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev')
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config['JWT_ACCESS_COOKIE_SAMESITE'] = 'None'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize JWTManager
jwt = JWTManager(app)

# Helper functions for file upload

# Function to check if the file has allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to save the file locally
def save_file_local(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{int(time.time())}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        return file_path
    return None

# Function to save the file to AWS S3
def save_file_s3(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{int(time.time())}_{filename}"
        s3_bucket_name = app.config['S3_BUCKET_NAME']
        s3_client = boto3.client('s3')

        try:
            s3_client.upload_fileobj(file, s3_bucket_name, unique_filename)
            s3_object_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{unique_filename}"
            return s3_object_url
        except ClientError as e:
            print("Error uploading file to S3:", e)
            return None

    return None

# Function to save the file based on the IMAGE_STORAGE setting
def save_file(file):
    if app.config['IMAGE_STORAGE'] == 'local':
        return save_file_local(file)
    elif app.config['IMAGE_STORAGE'] == 's3':
        return save_file_s3(file)
    else:
        raise ValueError("Invalid IMAGE_STORAGE setting")
