"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

#General Imports
import os
import datetime
from app import app,db,login_manager
from flask import render_template, request, secure_filename, url_for, redirect
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import check_password_hash



#Form Imports
from forms import *


# Model Imports
from models import *

###
# Routing for your application.
###


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

#Registration
@app.route('/api/user/register',methods=['POST'])
def registration():
    form = RegForm()
    if request.method == 'POST' and form.validate_on_submit():
        
        firstname = form.fname.data
        lastname = form.lname.data
        username = form.username.data
        password = form.password.data
        gender = form.gender.data
        location = form.location.data
        email = form.email.data
        biography = form.biography.data
        photograph =  form.file.data
        filename = secure_filename(photograph.filename)
        photograph.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        user_date = datetime.datetime.today().strftime('%Y-%m-%d')
        user = UserProfile(username,password,firstname,lastname,gender,location,biography,filename,email,user_date)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return redirect(url_for('registration'))
    
#Login
@app.route('api/auth/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('secure_page'))
    form = LoginForm() 
    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = UserProfile.query.filter_by(username=username).first()
        if user is not None and check_password_hash(user.password, password):
            login_user(user)
        return render_template('home.html')
    
@app.route('api/auth/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'danger')
    return redirect(url_for('home'))


@app.route('/api/users/<user_id>/posts', methods =['GET','POST'])
@login_required
def singpost(uid):
    if request.method == 'GET':
        post = post.query.filter_by(user_id = uid).first()
        if post is None:
            return redirect(url_for('home'))
        user = UserProfile.query.filter_by(user_id = uid).first()
        followers = len((Follows.query.filter_by(user_id=uid).all()))
        "---------------"
    
    if request.method == 'POST':
        filefolder = app.config['UPLOAD_FOLDER']
        form = PostsForm()
        if form.validate_on_submit():
            uid = form.user_id.data
            image = request.file['image']
            caption = form.caption.data
            user = UserProfile.query.filter_by(id=uid).first()
            filename = secure_filename(image.filename)
            creation = str(datetime.date.today())
            post = Posts(user_id=uid,photo=filename,caption=caption ,created_on=creation)
            image.save(os.path.join(filefolder, filename))
            db.session.add(post)
            db.session.commit()
            "---------"
    

# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
