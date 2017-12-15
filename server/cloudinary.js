/**
 * Created by ChitSwe on 1/6/17.
 */
import cloudinary from 'cloudinary';
// let config =  {
//     cloud_name: 'chitswe',
//     api_key: '481568383515333',
//     api_secret: '43dwAat9zBMKpQey6NbzklQ6CGo'
// };

let config = {
        cloud_name: 'shopkeeper-mt',
        api_key: '156887998232998',
        api_secret: 'XI0icVrIctxGn9P7Z8pEJU0b49A'
    };

const env = process.env.NODE_ENV;
if (env !== "development"){
    config = {
        cloud_name: 'shopkeeper-mt',
        api_key: '156887998232998',
        api_secret: 'XI0icVrIctxGn9P7Z8pEJU0b49A'
    };
}


cloudinary.config(config);

const baseUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}/upload`;

const c={
    deleteByPublicId:(public_id)=>{
         return new Promise((response,reject)=>{
            cloudinary.v2.uploader.destroy(public_id, {invalidate:true},(error,result)=>{
                if(error)
                    reject(error);
                else
                    response(result);   
            });
        });
    },
    delete:(url)=>{
        if(!url)
            return new Promise((r)=>{r();})
        let public_id = url.replace(baseUrl,'');
        return new Promise((response,reject)=>{
            cloudinary.v2.uploader.destroy(public_id, {invalidate:true},(error,result)=>{
                if(error)
                    reject(error);
                else
                    response(result);   
            });
        });
    },
    thumb:(fileName)=>(cloudinary.url(fileName,{transformation:[
            {width:150,height:150,crop:'limit'}
        ],secure:true})),
    url:i=>(cloudinary.url(i,{secure:true})),
    update:(public_id,data)=>{
        return new Promise((response,reject)=>{
            cloudinary.api.update(public_id,response,data);
        });
    },
    moderateImage:(public_id)=>{
        return c.update(public_id,{tags:['moderated']});
    }

};
export default c;

