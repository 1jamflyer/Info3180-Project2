from app import db


class Follows(db.Model):
    
    __tablename__ = 'user_follows'
    
    follow_id = db.Column(db.Integer,primary_key = True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column
    
    def __init__(self,user_id,follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
        
        
class UserProfile(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` or some other name.
    __tablename__ = 'user_profiles'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20))
    password = db.Column(db.String(20))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    location = db.Column(db.String(80))
    email = db.Column(db.String(80), unique=True)
    biography = db.Column(db.String(255))
    photograph = db.Column(db.String(500))
    date_joined = db.Column(db.Date())

    def __init__(self, username,password,first_name, last_name, gender, location, biography, photograph, email, date_joined):
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.location = location
        self.biography = biography
        self.email = email
        self.photograph=photograph
        self.date_joined = date_joined
        
class Likes(db.Model):
    __tablename__ = 'user_likes'
    
    like_id = db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer)
    post_id=db.Column(db.Integer)
    
    
    def __init__(self,user_id,post_id):
        self.user_id = user_id
        self.post_id = post_id
        
class Post(db.Model):
    __tablename__ = 'user_posts'
    
    post_id=(db.Column(db.Integer, primary_key=True))
    user_id=(db.Column(db.Integer))
    photo = (db.Column(db.String(500)))
    caption = (db.Column(db.String(200)))
    created_on = (db.Column(db.Date()))
    
    def __init__(self,user_id,photo,caption,created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on
        
    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support
        
        
    