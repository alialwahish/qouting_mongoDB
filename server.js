var express = require("express");

var app=express();
const flash = require("express-flash");
app.use(flash());
var session = require('express-session');
var mongoose = require('mongoose');

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}))


mongoose.connect('mongodb://localhost/basic_mongoose');

var UserSchema = new mongoose.Schema({
    name:{type: String, required:true, minlength:3},
    quote:{type:String,required:true,minlength:3}
},{timestamps: true})

mongoose.model("User",UserSchema);
var User = mongoose.model('User');





var bodyParser= require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

var path= require("path");

app.use(express.static(path.join(__dirname,"/static")));

app.set('views',path.join(__dirname,'/views'));

app.set('view engine','ejs');

app.get('/',function(req,res){
    
   
            res.render('index');
        
      
})


app.post('/users',function(req,res){
    console.log("POST DATA", req.body);
    var user = new User({name:req.body.name,quote:req.body.quote});
    user.save(function(err){
        if(err){
            console.log("flash Error")
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');

        }
        else{
            console.log("user added");
            res.redirect('/');
        }
    })

})

app.get('/remove',function(req,res){
    User.remove({},function(err){
        if(err){
            console.log("removing err")
            res.render('/');
        }
        else{
            console.log("remove complete");
            res.render('/');
        }

    });
})

app.get('/quote',function(req,res){
    User.find({},function(err,quotes){
        if(err){
            console.log("Error in grabbing quotes")
            res.redirect('/')
        }
        else{
            quotes;
            res.render('quotes',{quotes:quotes});
        
        }
    });
})

app.listen(5000,function(){
    console.log("listining on port 5000");
})