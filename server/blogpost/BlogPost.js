import Mustache from 'mustache';
import fs from 'fs';
import db from '../models/index';
import HttpStatus from'http-status-codes';
function blogPostHandler(request,response) {
	initialBlogPostContentHandler(request,response);
}

function initialBlogPostContentHandler(request,response) {
   const {BlogPostId}  = request.query;
   const view = {};
   db.sequelize.transaction(t=>{
   	return db.BlogPost.findById(BlogPostId,{transaction:t})
   			 .then(blogPost => {
   			 	view.Content = blogPost.Content;
   			 	view.BlogPostId = blogPost.id;
          view.action = "/saveContent";
   			 	//console.log(view);

					let	html = Mustache.render(fs.readFileSync(`${global.appRoot}/public/html/blogpost/process.html`).toString(),view);
					response.send(html);

   			 });
   }).catch(e=>{
   	console.log(e);
   })

}

function saveContentHandler(request,response) {
  let {id,Content} = request.body;
	const view = {};
  db.sequelize.transaction(t=>{
            return db.BlogPost.findById(id,{transaction:t})
            .then(i=>{
              if(!i)
                  throw "BlogPost not found"
              else {
                return i.update({Content:Content},{transaction:t,fields:['Title','Image','AuthorId','BriefContent','Content','State']})
                .then(()=>{
									view.respCode = HttpStatus.OK;
									view.message = "Update is successful."
				   			  var html = Mustache.render(fs.readFileSync(`${global.appRoot}/public/html/blogpost/result.html`).toString(),view);
                  response.send(html);
                })
								.catch(e=>{
						    	console.log(e);
						    })
              }
            })
        });

}

function previewHandler(request,response) {
	const {BlogPostId,Content}  = request.query;
	const view = {};
	db.sequelize.transaction(t=>{
	 return db.BlogPost.findById(BlogPostId,{transaction:t})
				.then(blogPost => {
				 view.Content = blogPost.Content;
				 view.BlogPostId = blogPost.id;
				 view.action = "/saveContent";
				// console.log(view);

				 let	html = Mustache.render(fs.readFileSync(`${global.appRoot}/public/html/blogpost/preview.html`).toString(),view);
				 response.send(html);

				});
	}).catch(e=>{
	 console.log(e);
	})
}

export {blogPostHandler,saveContentHandler,previewHandler}
