/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <img src='static/images/logo.png' class="small-logo"/>
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
        
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li v-if= "auth" class = "nav-item active">
                <router-link class="nav-link" :to="{name: 'users', params: {user_id: cu_id}}">My Profile</router-link>
            <li v-if="auth" class="nav-item active">
                <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
            <li v-else class="nav-item">
                <router-link class="nav-link active" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </nav>
    `,
    data: function(){
        return {
            auth: localStorage.hasOwnProperty("current_user"),
            cu_id: localStorage.hasOwnProperty("current_user") ? JSON.parse(localStorage.current_user).id : null
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="row home-container">
        <div class="col-md-4 home-container-child" style="margin-left: 11%;">
            <img src="/static/images/home.jpg" id="home-img"/>
        </div>
        <div class="col-md-4  landing-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div style="margin-top: 20%;">
                  <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                  <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
              </div>
            </div>
          </div>  
        </div>
    </div>
   `,
    data: function() {
       return {}
    }
});

const Register = Vue.component("register", {
    template: `
        <div>
          <h3 class="card-header center text-muted">Register</h3>
          <div class="card center">
            <form id="RegForm" @submit.prevent="Register" enctype="multipart/form-data">
            <div>
                <label>Firstname:</label><br/>
               <input type='text' id='fname' name='fname' style="width: 100%;"/>
            </div>
            <div>
                <label>Lastname:</label><br/>
               <input type='text' id='lname' name='lname' style="width: 100%;"/>
            </div>
            <div>
                <label>Username:</label><br/>
               <input type='text' id='username' name='username' style="width: 100%;"/>
               
            </div>
            <div>
                <label>Password:</label><br/>
               <input type='password' id='password' name='password' style="width: 100%;"/>
            </div>
            <div>
                <label>Email:</label><br/>
               <input type='text' id='email' name='email' placeholder="test@example.com" style="width: 100%;"/>
            </div>
            <div>
                <label>Location:</label><br/>
               <input type='text' id='location' name='location' style="width: 100%;"/>
            </div>
            <div>
                <label>Biography:</label><br/>
               <textarea name="biography" rows="3" style="width:100%"> </textarea><br/>
            </div>
            <div>
                <label>Photo:</label><br/>
                <label for='file' class='btn btn-primary'>Browse....</label> <span>{{ filename }}</span>
                <input id="file" type="file" name='file' style="display: none" v-on:change = "onFileSelected" /><br/>
            </div>
                 <div>
                      <input type="submit" id="submit" class="btn btn-success" value="Register" /> 
                </div>
            </form>
                
            </div>
            </div>
        </div>
    `,
    methods: {
        Register: function(){
            let self =this;
            let register= document.getElementById('RegForm');
            let form_data= new FormData(register);
            console.log(register)
            fetch("/api/users/register",{
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFTOKEN': token
                },
                credentials: 'same-origin'
            }).then(function(response){
                return response.json();
            }).then(function (jsonResponse) {
                console.log(jsonResponse);
                
                  if (jsonResponse.hasOwnProperty("errors")){
                      self.message = jsonResponse.errors;
                      alert(self.message);
                      
                  }else if(jsonResponse.hasOwnProperty("message")){
                      self.message = jsonResponse.message;
                      alert(self.message);
                      router.push('/')
                  }
                
        });
        },
        onFileSelected: function(){
            let self = this
            let filesname = $("#file")[0].value.split("\\");
            self.filename = filesname[filesname.length-1]
            
        }
            
        },
        data: function(){
        return {
            message: [],
            filename: "No File Selected"
            
        }
        
    }
        
    
});
const Login = Vue.component('login', {
    template:`
    <div>
        <form id="loginform" @submit.prevent="login">
            <div class="card-header center">
                <strong>Login</strong>
            </div>
            <div class="card center">
                <div class="card-body login">
                    <div style="margin-top:5%;">
                        <label for='username'><strong>Username</strong></label><br>
                        <input type='text' id='username' name='username' style="width: 100%;"/>
                    </div>
                    <div style="margin-top:5%;">
                        <label for='password'><strong>Password</strong></label><br>
                        <input type='password' id='password' name='password' style="width: 100%;"/>
                    </div>
                    <div style="margin-top:5%;">
                        <button id="submit" class="btn btn-success"> Login </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    `,
    methods:{
        login: function(){
            const self = this
            let login_data= document.getElementById('loginform');
            let login_form= new FormData(login_data);
            
            fetch("/api/auth/login",{
                method: "POST",
                body: login_form,
                headers: {
                    'X-CSRFTOKEN':token
                },
                credentials: 'same-origin'
                
            }).then(function(response){
                return response.json();
            }).then(function(jsonResponse){
                console.log(jsonResponse);
                self.message = jsonResponse;
                
                
                if(jsonResponse.hasOwnProperty("user_id")){
                    cuser={"token":jsonResponse.token,id: jsonResponse.user_id};
                    localStorage.current_user = JSON.stringify(cuser);
                    alert(jsonResponse.message)
                    router.push("/explore");
                }else{
                    self.message = jsonResponse.errors
                    alert(self.message)
                }
            }).catch(function(error){
                self.messageFlag = false;
                console.log(error);
            });
            
        },
        data: function(){
            return {
                message: ""
            }
        }
    }
});

const Logout = Vue.component("logout", {
    template: `
        <div>
        <div/>`,
    created: function(){
    const self = this;
    
    fetch("api/auth/logout", {
        method: "GET"
    }).then(function(response){
        return response.json();
    }).then(function(jsonResponse){
        localStorage.removeItem("current_user");
        router.push("/");
        this.$router.push('/');
    }).catch(function(error){
        console.log(error);
    });
  }
});

const Explore= Vue.component("explore", {
    template:`
    <div class="row">
        <div v-if="postFlag" class= "col-md-7" style="margin: 0 auto;">
            <div class="card" style=" width:100%; padding: 0; margin-bottom: 5%" v-for="(post, index) in posts">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <img id="pro-photo" v-bind:src=post.profile_pic  style="width:40px"/>
                        <router-link class="username" :to="{name: 'users', params: {user_id: post.user_id}}">{{ post.username }}</router-link>
                    </li>
                    <li class="list-group-item" style="padding: 0;">
                        <img id="post-img" v-bind:src=post.pic style="width:100%" />
                    </li>
                    <li class="list-group-item text-muted">
                        {{post.caption}}
                        <div class="row" style="margin-top: 10%">
                            <div id="likes" class="col-md-6" style="text-align: left;">
                                <img class="like-ico liked" src="static/icons/liked.png"  v-on:click="like" style="width:20px; display: none;"/>
                                <img class="like-ico like" src="static/icons/like.png"  v-on:click="like" style="width:20px;"/> {{post.likes}} Likes
                                <input type="hidden" id="post-id"  v-bind:value="post.id" />
                                <input type="hidden" id="post-index" v-bind:value="index" />
                            </div>
                            <div id="post-date" class="col-md-6" style="text-align: right">
                                {{post.pcreation}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <div class="alert alert-primary" >
                No Posts Available 
            </div>
        </div>
        <div class="col-md-3">
            <router-link class="btn btn-primary" to="/posts/new" style="width:100%;">New Post</router-link>
        </div>
    </div>
    `,
    created: function(){
    self = this;
    
    fetch("/api/posts", {
      method: "GET",
      headers:{
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
        'X-CSRFToken': token
      },
      credentials: 'same-origin'
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      if(jsonResponse.hasOwnProperty("posts")){
        if(jsonResponse.posts.length !=0){
          self.posts = jsonResponse.posts.reverse();
          self.postFlag = true;
        }
      }
    }).catch(function(error){
        console.log(error);
      });
    },
    methods: {
    like: function(event){
      self = this;
      let node_list = event.target.parentElement.children;
      let post_id = node_list[node_list.length-2].value;
      let post_index = node_list[node_list.length-1].value;
      
      fetch("/api/posts/${post_id}/like", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
          'X-CSRFToken': token,
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({"user_id": JSON.parse(localStorage.current_user).id, "post_id": post_id})
      }).then(function(response){
        return response.json();
        console.log(jsonResponse);
      }).then(function(jsonResponse){
          if(jsonResponse.hasOwnProperty("message")){
              event.target.style.display="none"
              event.target.previousElementSibling.style.display="";
              self.posts[post_index].likes = jsonResponse.likes;
              self.message = (jsonResponse.message)
              alert(self.message)
          
        }
          
        
          
      }).catch(function(error){
        console.log(error);
      });
    }
  },
  data: function(){
    return {
      posts: [],
      postFlag: false
      }
    }
});

const Profile = Vue.component('profile',{
    template: `
  <div>
    <div class="card row" style="width:100%">
        <div class="card-body row profile-haeder" style="padding: 0;" >
          <img id="profile_image" class="col-md-2" v-bind:src=user.profile_pic style="width: 100%; height: 15%" />
          <div id="profile_info" class="col-md-7" style="margin-top: 0px;padding-right: 0;">
            <strong><label>{{ user.firstname }}</label>
            <label>{{ user.lastname }}</label></strong>
            <div id="local" style="color: gray;">
              <label>{{ user.location }}</label><br>
              <label>{{ user.date_joined }}</label>
            </div>
            <p id="bio" style="color: gray;">
              {{ user.biography }}
            </p>
          </div>
          <div id="follows" class="col-sm-3" style="padding-left:  0; padding-right:  0;">
            <strong><label id="posts" class="col-md-5">{{ user.tposts }}</label>
            <label id="followers" class="col-md-5">{{ user.followers }}</label></strong> <br>
            <label class="col-md-5" style="color: gray; font-weight: 600; font-size: larger;">Posts</label>
            <label class="col-md-6" style="color: gray; font-weight: 600; font-size: larger;">Followers</label>
            <label id="follow-btn" class="btn btn-primary" v-on:click="follow" style="width:100%; margin-top: 17%;">Follow</label>
          </div>
        </div>
    </div>
    
    <div id="post-area" class="row" style="width:100%;">
      <div class="profile-post col-md-4" style="margin-top:3%;" v-for="post in user.posts">
          <img v-bind:src=post.photo style="width: 100%;" />
      </div>
    </div>
  </div>
  `,
    methods: {
    follow: function(){
      self = this;
      
      fetch("/api/users/{user_id}/follow",{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
          "Content-Type": "application/json",
          'X-CSRFToken': token
        },
        credentials: 'same-origin',
        body: JSON.stringify({"follower_id": JSON.parse(localStorage.current_user).id, "user_id": self.user_id})
      })
      .then(function(response){
        return response.json();
      })
      .then(function(jsonResponse){
        
        if(jsonResponse.hasOwnProperty("message")){
          $("#follow-btn")[0].innerHTML="Following";
          $("#follow-btn").removeClass("btn-primary");
          $("#follow-btn").addClass("btn-success")
          ++ self.user.followers;
        }
        
      }).catch(function(error){
        console.log(error)
      });
    }
  },
  created: function(){
    self = this;
    
    fetch("/api/users/${self.$route.params.user_id}/posts",{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
      }
    })
    .then(function(response){
        return response.json();
    })
    .then(function(jsonResponse){
        console.log(jsonResponse)
        self.user = jsonResponse.postinfo;
    })
    .catch(function(error){
        console.log(error);
    });
  },
  data: function(){
    return {
      user: null,
      cu_id: (this.$route.params.user_id == JSON.parse(localStorage.current_user).id) ? true : false
    };
  }
    
});

const NewPost = Vue.component('newPost', {
    template:`
    <div>
      <div id="newPostForm">
        <h2 style="margin-left:1em;">New Post</h2>
        <form id="postContent" @submit.prevent="uploadPost">
        
        
            <div class="alert alert-danger" v-if="err !== ''">
              {{ err }}
            </div>
            <div class="alert alert-success" v-if="successful !== ''">
              {{ successful }}
            </div>
            <div class="form-group">
              <label>Photo</label>
              <input type="file" class="form-control-file" name="image">
            </div>
            <input id="user_id" name="user_id" v-bind:value="cu_id" style="display: none;"/>
            <div class="form-group">
              <label>Caption</label>
              <textarea class="form-control" name="caption" rows="2" placeholder="Write a caption..."></textarea>
            </div>
            <button id="submit" class="btn btn-inline btn-success btn-block">Submit</button>
        </form>
        
      </div>
    
    </div>
    `,
    data: function() {
    return {
      err: '',
      successful: '',
      cu_id: JSON.parse(localStorage.current_user).id
    };
  },
   
   methods:{
       uploadPost: function(){
           self = this;
           let uploadForm = document.getElementById('postContent');
           let form_data = new FormData(uploadForm);
           
           fetch("/api/users/${JSON.parse(localStorage.current_user).id}/posts", {
            method: 'POST',
            body: form_data,
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
                'X-CSRFToken': token
            },
             credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            // display a success message

                if (jsonResponse.hasOwnProperty("message")){
                    self.successful = jsonResponse.message;
                    self.err = jsonResponse.errors;
                    console.log(successful)
                }
        })
        .catch(function (error) {
            console.log(error);
        });
           
           
       }
   },
   
    
    
});




const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})

// Define Routes
const router = new VueRouter({
    routes: [
        {path: "/", component: Home},
        {path: "/register", component: Register},
        {path: "/login", component: Login},
        {path: "/explore", component: Explore},
        {path: "/logout", component: Logout},
        {path: "/posts/new", component: NewPost},
        { path: "/users/:user_id", name:"users",component: Profile},
        // Put other routes here

        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});