const { Router } = require("express");
const User = require("../models/user");


const router = Router();


router.get("/signin",(req,res)=>{
    return res.render("signin");
});

router.get("/signup",(req,res)=>{
    return res.render("signup");
});

router.post("/signin", async (req,res)=>{
  
  const { email,password } = req.body;
 
  try {
    const token = await User.matchPasswordAndGenerateToken(email,password);
    
    return res.cookie("token",token).redirect("/");
  } catch (error) {
    return res.render("signin",{
      error: "Incorrect Email or Password",
    });
    
  }
  
});

router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("signin");
});

router.post("/signup", async (req,res)=>{
    const { fullName,email,password } = req.body;

    let result = await User.create({
        fullName,
        email,
        password
    });
  if(result){
    return res.redirect('/');
  }else{
    alert("Some things went wrong");
  }
});

module.exports = router;