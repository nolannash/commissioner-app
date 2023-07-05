# Remote library imports
from flask import request
from flask_restful import Resource

import re

# Local imports
from config import app, db, api

from models import User, Seller, Item, Order, Favourite, FormItem

if __name__ == '__main__':
    app.run(port=5555, debug=True)
