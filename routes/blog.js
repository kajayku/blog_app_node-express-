const { Router } = require('express');
const multer = require('multer');
const Blog = require('../models/blog');
const path = require('path');
const Comment = require('../models/comments');


const router = Router();


const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,path.resolve(`./public/uploads/`));
    },
    filename: function (req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    },
});

const upload = multer({ storage:storage });


router.get("/add-new",(req,res)=>{
    res.render("addBlog",{
        user:req.user,
    });
});

router.get("/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments =  await Comment.find({blogId:req.params.id}).populate('createdBy');
    res.render('blog',{
        user:req.user,
        blog,
        comments,
     });
});

router.post("/", upload.single("coverImage"), async(req,res)=>{
    const { title,body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });

    return res.redirect('/');
});

router.post("/comment/:blogId", async (req,res)=>{
    const content = req.body.content;
    const comment = await Comment.create({
        content:content,
        createdBy: req.user._id,
        blogId:req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});



module.exports = router;