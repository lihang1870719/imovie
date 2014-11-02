var express =require('express');
var port=process.env.PORT||3000;
var app=express();
var path=require('path');
var mongoose=require('mongoose');
var Movie = require('./models/movie')
var _=require('underscore');
var bodyParser=require('body-parser');

//mongoose
mongoose.connect('mongodb://localhost/imovie',function(err){
	if(err)
	{
		console.log("cannot connect to databse");
	}
	else
		console.log("success connect to database");
});

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.locals.moment=require('moment');
app.listen(port);
console.log('imovie started on port'+port);

//index. page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('index',{
			title:'影院热度播报',
			movies:movies
		});
	});
});

//detail page
app.get('/movie/:id',function(req,res){
	var id =req.params.id;

	Movie.findById(id,function(err,movies){
		res.render('detail',{
		title:'imovie'+movies.title,
		movies:movies
		});
	});
});

//admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'imovie 后台录入页',
		movies:{
			director:' ',
			country:' ',
			title:' ',
			year:' ',
			poster:' ',
			language:' ',
			flash:' ',	
			summary:' '
		}
	});
});

//admin upadte movie
app.get('/admin/update/:id',function(req,res){
	var id=req.params.id;
	if(id){
		Movie.findById(id,function(err,movies){
			res.render('admin',{
				title:'imovie 后台更新页',
				movies:movies
			});
		})
	}
});

//admin post movie
app.post('/admin/movie/new',function(req,res){
	var id =req.body.movie._id;
	var movieObj=req.body.movie;
	var _movie;
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err)
				console.log(err);
		 _movie = _.extend(movie,movieObj);
		_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movie._id);
			});
	});
	}
	else{
		_movie=new Movie({
			director:movieObj.director,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		});

		_movie.save(function(err,movie){
			if(err){
				console.log("hi");
				console.log(err);
			}
			res.redirect('/movie/'+movie.id);
		});
	}
});

//list page 
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
		})
	})
})

//list delete

app.delete('/admin/list',function(req,res){
	var id=req.query.id;
	console.log("sahfkasjfhaksjhf ");
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
});