const bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  express = require('express'),
  app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set(expressSanitizer());
app.use(methodOverride("_method"));



const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//   body: "hello blog post"
// });

app.get('/', function (req, res) {
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get('/blogs', function (req, res) {
  //fect from db
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);

    } else {
      res.render("index", { blogs: blogs });
    }
  })
});

//new ROUTE
app.get('/blogs/new', function (req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post('/blogs', function (req, res) {
  //create blog
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");

    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW
app.get("/blogs/:id", function (req, res) {
  //find the campground with provided id
  //render show template


  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
  // res.send('akdsf;ljadsf memmmmmmmmmmmm');
});


//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});


app.put("/blogs/:id", function (req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");

    }
  })
});


app.listen(3000, function () {
  console.log('Server started on 3000');
});