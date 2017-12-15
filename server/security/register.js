import db from '../models/index';
import secret from '../../secret';
import Request from 'request';
import uuid from 'node-uuid';
import jwt from 'jwt-simple';
const registerHandler = (request,response)=>{
	let {
		phone_number,
		fullname,
		password,
		confirm_password,
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
		    .then(accounts=>{
		    	if(accounts.length>0){
		    		return accounts[0].update({
		    			UserName:phone_number,
		    			Password:password,
		    		},{fields:['UserName','Password'],transaction:t})
	    			.then(account=>{
	    				return account.getCustomer({transaction:t})
	    				.then(c=>{
	    					return c.update({FullName:fullname,PhoneNo:phone_number,IsConfirmedPhoneNo:true},{
	    						fields:['FullName','PhoneNo','IsConfirmedPhoneNo'],
	    						transaction:t
	    					});
	    				});
	    			});
		    	}else{
		    		return db.Customer.create({
		    			FullName:fullname,
		    			PhoneNo:phone_number,
		    			IsConfirmedPhoneNo:true
		    		},{fields:['FullName','PhoneNo','IsConfirmedPhoneNo'],transaction:t})
		    		.then(customer=>{
		    			return customer.createUserAccount({
		    				UserName:phone_number,
		    				Password:password,
		    				AccountKitId:id
		    			},{fields:['UserName','Password','AccountKitId'],transaction:t})
		    		});
		    	}
		    })
			.then((customer)=>{
				return customer.getUserAccount({transaction:t})
				.then(account=>{
					const token = jwt.encode(account.UserName,uuid.v4());
					return db.UserSession.create({
    					UserAccountId:account.id,
    					ExpiredIn:300,
    					Counter:1,
    					SessionKey:token
    				},{fields:['UserAccountId','ExpiredIn','Counter','SessionKey'],transaction:t})
    				.then(()=>{
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
				});
			})
		    .catch(error=>{
		    	throw error;
		    	t.rollback();
		    	response.status(500).send(error.message);
		    });
	    });
	    
	});
}

export default registerHandler;