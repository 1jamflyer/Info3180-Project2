from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
import os

app = Flask(__name__)
csrf = CSRFProtect(app)

UPLOAD_FOLDER='./static/uploads'
PROFILE_PIC = './app/static/profilepic'
POST_PIC = './app/static/posts'
POST_PICT= './static/posts'
PROFILE_PICT = './static/posts/'
app.config['PROFILE_PICT'] = PROFILE_PICT
app.config['POST_PICT'] = POST_PICT
app.config['PROFILE_PIC'] = PROFILE_PIC
app.config['POST_PIC'] = POST_PIC
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://photogram:project2@localhost/gram" 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

login_manager = LoginManager()

login_manager.init_app(app)
login_manager.login_view = 'login'  
login_manager.login_message_category = "info"

from app import views,models
