/**
 * Created by ChitSwe on 12/21/16.
 */

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



   

    type Query{
      Q:String
    }

    type Mutation{
       M:String
    }

    


    schema{
        query:Query
        mutation:Mutation
        
    }

`;
export default Schema;
