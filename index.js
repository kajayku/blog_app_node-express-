require('dotenv').config()
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require("./routes/blog");
const { default: mongoose } = require('mongoose');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');


const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("MongoDB Connected"));


app.set("view engine","ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public"))); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get('/', async (req,res)=>{
   const allBlog = await Blog.find({});
   res.render("home",{
      user:req.user,
      blogs:allBlog,
   });
   
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server Started at ${PORT}!`))