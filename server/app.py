# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api



if __name__ == '__main__':
    app.run(port=5555, debug=True)
