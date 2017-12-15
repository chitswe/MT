import {createError} from 'apollo-errors';
//shape of data obj
//{
//	type:String--graphql type
//	tag:String--tag
//	errors:[error] -- validation error array
//}
const ModelValidationFailError=createError('ModelValidationFailError',{
	message:'Data input validation failed!'
});

export default ModelValidationFailError;