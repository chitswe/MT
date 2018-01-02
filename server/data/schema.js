/**
 * Created by ChitSwe on 12/21/16.
 */

 import {type as type_User,query as query_User,mutation as mutation_User} from './User'
 import {type as type_UserAccount, query as query_UserAccount,mutation as mutation_UserAccount} from './UserAccount';
 import {type as type_Customer, query as query_Customer,mutation as mutation_Customer} from './Customer';
 import {type as type_UserSession, query as query_UserSession,mutation as mutation_UserSession} from './UserSession';
 import {type as type_Tag, query as query_Tag,mutation as mutation_Tag} from './Tag';
 import {type as type_BlogPost, query as query_BlogPost,mutation as mutation_BlogPost} from './BlogPost';

const Schema=`
    scalar DateTime
    scalar Date

    type error{
        key:String
        message:String!
    }

    type pagination{
        page:Int!
        pageSize:Int!
        hasMore:Boolean!
        totalRows:Int!
        totalPages:Int!
    }

    input paginationCriteria{
        page:Int!
        pageSize:Int!
    }

    input criteria{
        pagination:paginationCriteria!
        orderBy:[[String]]!
    }

    input DateRange{
        From:Date
        To:Date
    }


    ${type_User}
    ${type_UserAccount}
    ${type_Customer}
    ${type_UserSession}
    ${type_Tag}
    ${type_BlogPost}

    type Query{
      Q:String
    ${query_User}
    ${query_UserAccount}
    ${query_Customer}
    ${query_UserSession}
    ${query_Tag}
    ${query_BlogPost}
    }

    type Mutation{
       M:String
     ${mutation_User}
     ${mutation_UserAccount}
     ${mutation_Customer}
     ${mutation_UserSession}
     ${mutation_Tag}
     ${mutation_BlogPost}
    }




    schema{
        query:Query
        mutation:Mutation

    }

`;
export default Schema;
