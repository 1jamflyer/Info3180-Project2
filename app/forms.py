from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.fields import  BooleanField, StringField, TextAreaField, SelectField,PasswordField
from flask_wtf import FlaskForm
from wtforms.validators import DataRequired, Email


class RegForm(FlaskForm):
    fname = StringField('First Name',validators=[DataRequired()])
    lname = StringField('Last Name',validators=[DataRequired()])
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('New Password', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(),Email()])
    location = StringField('Location',validators=[DataRequired()])
    biography = TextAreaField('Biography',validators=[DataRequired()])
    file = FileField('Profile Image',validators=[FileRequired(),FileAllowed(['jpg','png'])])


class LoginForm(FlaskForm):
    username = StringField("Username",validators=[DataRequired()])
    password = PasswordField("Password",validators=[DataRequired()])
    remember_me = BooleanField("Remember Me")
    
class PostsForm(FlaskForm):
    user_id = StringField("", validators=[DataRequired()])
    image = FileField('Photo', validators=[DataRequired(), FileAllowed(['jpg','png'],'Image only!')])
    caption = TextAreaField('Caption', validators=[DataRequired()])