import db from '../models/index';
import uuid from 'node-uuid';
import jwt from 'jwt-simple';
import cloudinary from '../cloudinary';
import Request from 'request';
import secret from '../../secret';
let LocalStrategy = require('passport-local').Strategy;

function login(username,password,remember){
	let where = {UserName:username};
	if(password)
		where.Password=password;
	else{
		where.$or=[
			{
				Password:''
			},
			{Password:null}
		];
	}
	return db.UserAccount.findAll({where})
				.then(result=>{
					let userAccount = result[0];
					if(userAccount){
						let sessionKey = jwt.encode(username,uuid.v4());
						return db.UserSession.create({UserAccountId:userAccount.id,ExpiredIn:remember? null: 300,Counter:1,SessionKey:sessionKey},{fields:['UserAccountId','ExpiredIn','Counter','SessionKey']})
						.then(session=>{
							return userAccount.getUser().then(user=>{
								if(user)
									return {type:'USER',Photo:user.Photo,FullName:user.FullName,EntityId:user.id};
								else
									return userAccount.getCustomer().then(customer=>{
										if(customer)
											return {type:'CUSTOMER',Photo:customer.Photo,FullName:customer.FullName,EntityId:customer.id};
										else
											return user.getDealer().then(dealer=>{
												if(dealer)
													return {type:'DEALER',Photo:dealer.Photo,FullName:dealer.FullName,EntityId:dealer.id};
												else
													return null;
											});
									});
							}).then(accountType=>{
								let {type,Photo,FullName,EntityId}=accountType? accountType:{};
								return {
									success:true,
									access_token:sessionKey,
									user_id:userAccount.id,
									user_name:username,
									account_type:type,
									profile_pic:Photo?cloudinary.url(Photo):`/img/letter/letter_${FullName[0].toLowerCase()}.png`,
									full_name:FullName,
									entity_id:EntityId
								};
							});
						});
					}
					else {
						return {message:'User name or password is incorrect.',success:false};
					}
				})
				.catch(error=>({message:error,success:false}));
}

function loginHandler(req,response){
	let {username,password,remember,redirectUrlOnSuccess} = req.body;
	redirectUrlOnSuccess =redirectUrlOnSuccess? redirectUrlOnSuccess.replace('/',''):null;
	login(username,password,remember)
	.then(({access_token,user_id,user_name,account_type,profile_pic,full_name,entity_id,success})=>{
		if(success){
			response.cookie('access_token',access_token,{encode:m=>(m)});
			response.cookie('user_id',user_id,{encode:m=>(m)});
			response.cookie('user_name', user_name,{encode:m=>(m)});
			response.cookie('account_type','CUSTOMER',{encode:m=>(m)});
			response.cookie('profile_pic',profile_pic,{encode:m=>(m)});
			response.cookie('full_name',full_name,{encode:m=>(m)});
			response.cookie('entity_id',entity_id,{encode:m=>(m)});
			if(redirectUrlOnSuccess){
				let url = decodeURIComponent(redirectUrlOnSuccess);
				let lastChar=url[url.length-1];
				if(lastChar =='/')
					url = url.slice(0,url.length-1);
				response.redirect(url);
			}
			else
				response.redirect("/");
		}
		else{	
			response.redirect(`/login?message=${encodeURIComponent("Phone number or password is incorrect!")}&redirectUrlOnSuccess=${redirectUrlOnSuccess?redirectUrlOnSuccess:''}`);
		}
		return null;
	});
}

function adminSiteLoginHandler(req,res){
	let {username,password,remember} = req.body;
	login(username,password,remember).then(session=>{res.json(session);});
}

function smsLoginHandler(request,response){
	let {
		phone_number,
		auth_code,
		redirectUrlOnSuccess
	} = request.body;
	let {account_kit} = secret;
	let {app_id,app_secret} = account_kit;
	const url = `https://graph.accountkit.com/v1.2/access_token?grant_type=authorization_code&code=${auth_code}&access_token=AA|${app_id}|${app_secret}`;
	redirectUrlOnSuccess =redirectUrlOnSuccess? redirectUrlOnSuccess.replace('/',''):null;
	Request.get({url,json:true},(err,resp,respBody)=>{
		let {
			access_token,
	        expires_at,
	        id} = respBody;
	    db.sequelize.transaction().then(t=>{
	    	return db.UserAccount.findAll({where:{AccountKitId:id},transaction:t})
		    .then(([account])=>{
		    	if(account){
		    		return account.getCustomer({transaction:t})
		    		.then(customer=>{
		    			if(customer){
		    				const token = jwt.encode(account.UserName,uuid.v4())
		    				return db.UserSession.create({
		    					UserAccountId:account.id,
		    					ExpiredIn:300,
		    					Counter:1,
		    					SessionKey:token
		    				},{fields:['UserAccountId','ExpiredIn','Counter','SessionKey'],transaction:t}).then(session=>{
	    						response.cookie('access_token',token,{encode:m=>(m)});
			    				response.cookie('user_id',account.id,{encode:m=>(m)});
			    				response.cookie('user_name', account.UserName,{encode:m=>(m)});
			    				response.cookie('account_type','CUSTOMER',{encode:m=>(m)});
			    				response.cookie('profile_pic',customer.Photo,{encode:m=>(m)});
			    				response.cookie('full_name',customer.FullName,{encode:m=>(m)});
			    				response.cookie('entity_id',customer.id,{encode:m=>(m)});
			    				if(redirectUrlOnSuccess){
									let url = decodeURIComponent(redirectUrlOnSuccess);
									let lastChar=url[url.length-1];
									if(lastChar =='/')
										url = url.slice(0,url.length-1);
									response.redirect(url);
								}
								else
									response.redirect("/");
			    				t.commit();
			    				return null;
		    				});
		    			}else{
		    				t.rollback();
		    				response.send(`Phone no ${phone_number} is not associated with any customer.`);
		    				return null;
		    			}
		    		});
		    	}else{
		    		t.rollback();
		    		response.send(`Phone no ${phone_number} is not associated with any customer.`);
		    		return null;
		    	}
		    }).catch(error=>{
		    	throw error;
		    	t.rollback();
		    	response.status(500).send(error.message);
		    });
	    });
	    
	});
}


export {loginHandler,smsLoginHandler,adminSiteLoginHandler};
export default login;