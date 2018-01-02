/**
 * Created by ChitSwe on 1/2/17.
 */
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import {resolver as resolver_User} from './User';
import {resolver as resolver_UserAccount} from './UserAccount';
import {resolver as resolver_Customer} from './Customer';
import {resolver as resolver_UserSession} from './UserSession';
import {resolver as resolver_Tag} from './Tag';
import {resolver as resolver_BlogPost} from './BlogPost';
const Resolver={
    DateTime:new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date time custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Date:new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return (new Date(value)).dateOnly(); // value from the client
        },
        serialize(value) {
            return value.toDateOnlyJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Query:{
        Q:()=>('Q')
    },
    Mutation:{
        M:()=>('M')
    }
};

Object.assign(Resolver,resolver_User.type);
Object.assign(Resolver.Query,resolver_User.query);
Object.assign(Resolver.Mutation,resolver_User.mutation);

Object.assign(Resolver,resolver_UserAccount.type);
Object.assign(Resolver.Query,resolver_UserAccount.query);
Object.assign(Resolver.Mutation,resolver_UserAccount.mutation);

Object.assign(Resolver,resolver_Customer.type);
Object.assign(Resolver.Query,resolver_Customer.query);
Object.assign(Resolver.Mutation,resolver_Customer.mutation);

Object.assign(Resolver,resolver_UserSession.type);
Object.assign(Resolver.Query,resolver_UserSession.query);
Object.assign(Resolver.Mutation,resolver_UserSession.mutation);

Object.assign(Resolver,resolver_Tag.type);
Object.assign(Resolver.Query,resolver_Tag.query);
Object.assign(Resolver.Mutation,resolver_Tag.mutation);

Object.assign(Resolver,resolver_BlogPost.type);
Object.assign(Resolver.Query,resolver_BlogPost.query);
Object.assign(Resolver.Mutation,resolver_BlogPost.mutation);
export default  Resolver;
