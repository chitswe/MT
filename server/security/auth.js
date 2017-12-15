import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';
import db from '../models/index';
import CustomStrategy from 'passport-custom';
function findSession(token, done) {
    db.UserSession.findAll({where:{SessionKey:token}})
    .then(userSession=>{
      let s = userSession && userSession.length>0? userSession[0]:null;
      if(s){
        return s.getUserAccount()
        .then(userAccount=>{
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
            }).then(entity=>{
              done(null,Object.assign(userAccount,entity));
            })
        }).catch(error=>{
          done(error);
        });
      }else
        done(null,false);
    });
  }
passport.use(new BearerStrategy(
  findSession
));


passport.use('bearer-graphql',new CustomStrategy(
    (req,done)=>{
        let token = req.headers.authorization? req.headers.authorization.replace('Bearer ',''):'';
        token = token? token:req.cookies.access_token;
        AuthenticateWithToken(token).then(userAccount=>{
          if(userAccount){
            userAccount.isAuthenticated=true;
            done(null,userAccount);
            return userAccount;
          }else{
            done(null,{
              isAuthenticated:false,
              error:"Invalid access key"
            });
            return Promise.reject("Invalid access key");
          }
        }).catch(error=>{
          done(null,{
            isAuthenticated:false,
            error
          });
        });
        
    }
  ));

passport.use('cookie-site',new CustomStrategy(
    (req,done)=>{
        findSession(req.cookies.access_token,(error,userAccount)=>{
          if(error)
            done(error,userAccount);
          else{
            if(userAccount && userAccount.type !== "CUSTOMER"){
              done(null,false);//if not customer force to login 
            }else if (userAccount){
              userAccount.isAuthenticated=true;
              done(null,userAccount);
            }else{
              done(null,{
                isAuthenticated:false
              });
            }
          }
        });
        
    }
  ));
passport.use('cookie-admin',new CustomStrategy(
    (req,done)=>{
        findSession(req.cookies.access_token,(error,userAccount)=>{
          if(error)
            done(error,userAccount);
          else{
            if(userAccount && userAccount.type !=="USER"){
              done(null,false);//force to log in if not system user.
            }else if(userAccount){
              userAccount.isAuthenticated = true;
              done(null,userAccount);
            }else{
              done(null,false);// force to log in if not authenticated.
            }
          }
        });
    }
  ));

function AuthenticateWithToken(token){
  let promise  = new Promise((complete,rej)=>{
    findSession(token,(error,userAccount)=>{
      if(error)
        rej(error);
      else
        complete(userAccount);
    });
  });
  return promise;
}

export default AuthenticateWithToken; 