//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
let alert = require('alert'); 
const session =require('express-session')
const req = require("express/lib/request");
const flash =require('connect-flash');
const cookieParser = require('cookie-parser')
const mongoose =require("mongoose");

mongoose.connect("mongodb+srv://anisha-admin:test123@cluster0.lobmbkw.mongodb.net/blogDB")


const homeStartingContent = "This is a universal program which I have made to help you write your own planner. It can be a tour planner, a Exam Planner or anything else. For Posting your own blog, you should go to compose option and write your title and text and click publish. you will be able to see your post in the home screen. I think this will of great help to learners so that they can design and publish there blog without any difficulty.";
const aboutContent = "I Anisha  Ghosh , have designed the blog to help beginer in writing their blog as per requirement. Al you have to do is to change the statement and re write them according to your own requirement. You need not be a Javascript expert for this, But you should know the command well. Enjoy💞";
const contactContent = " ";


 
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(cookieParser('SecrectStringForCookie'))
// app.use(session({
//   secret:'SecrectStringForCookie',
//   cookie:{

//   }
// }
// ))
app.use(session());
app.use(flash());
const posts=[];

const postSchema = {

  title: String,
 
  content: String
 
 };
 const Post = mongoose.model("Post", postSchema);



app.get("/",(req,res)=>{
  // res.render("home", {startingContent:homeStartingContent,homePost:posts});
  Post.find({}, function(err, posts){

    res.render("home", {
 
      startingContent: homeStartingContent,
 
      homePost: posts
 
      });
     
  })

});

app.get("/about",(req,res)=>{
   res.render("about",{aboutText:aboutContent});
});

app.get("/contact",(req,res)=>{
  res.render("contact",{contactText:contactContent});
});
app.get("/compose",(req,res)=>{
  
  const flashs=req.flash('user')

  res.render("compose",{flashs});
 

});


app.post("/compose",(req,res)=>{
  const user_title =req.body.postTittle;
   console.log(user_title)
   const user_content=req.body.postBody;
  const post={
    tittle:req.body.postTittle,
    content: req.body.postBody
  };
  console.log(user_title)
  const newtittle=post.tittle.replace(/[ ]+/, '  ')
  const newpost=post.content.replace(/[ ]+/, '  ')
   if(newtittle==='  '|| post.tittle===''){
     
  
  req.flash('user','⚠️Oops:( Your Tittle is missing!');
  res.redirect('/compose');
    
  }

  else if(newpost==='  '|| post.content===''){
    req.flash('user','⚠️Oops:( Your post  is missing!');
    res.redirect('/compose');
    
  }
  
  else{
   

    const post = new Post ({
      title: user_title,
     content: user_content
       
   
    });
    post.save(function(err){

      if (!err){
   
        res.redirect("/");
   
      }
   
    });
 }
 

});


app.get('/posts/:test',function(req,res){
  // console.log(req.params.test);
  const  requestedPostId=(req.params.test);
  console.log(requestedPostId);
   
  Post.findOne({_id: requestedPostId}, function(err, post){

    res.render("post", {
 
      title: post.title,
 
      content: post.content
 
    });
 
  });
 
  
});




let port =process.env.PORT;
if (port==null || port ==""){
  port=3000;
}

app.listen(port, function () {
  console.log("Server has started!");
});
