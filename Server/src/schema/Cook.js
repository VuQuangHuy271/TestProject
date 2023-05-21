const { gql } = require('apollo-server-express')

const typeDefs = gql `

    scalar Upload

    type CookModel {
        Id: Int
        Ten: String
        MoTa: String
        Anh_Url: String
    }
    type GetListCookResponse {
        listData: [CookModel],
        messageCode: Int!,
        message: String!,
    }

    type GetCookByIdResponse {
        Data: CookModel,
        messageCode: Int!,
        message: String!,
    }

    input CreateCookInput {
        
        Anh: Upload,
    }

    input UpdateCookInput {
        dataCook: CookInput,
        Anh: Upload,
    }

    input CookInput {
        Id: Int,
        Ten: String,
        MoTa: String,
    }

    type BResponse {
        messageCode: Int!,
        message: String!,
    }

    type File {
    filename: String!
    mimetype: String!
    encoding: String!
    }

    type Query {
    uploads: [File]
    }



    # ROOT TYPE
    type Query {
        getListCook: GetListCookResponse
        getListCookByID(Id: Int): GetCookByIdResponse
    }

    type Mutation {
        singleUpload(file: Upload!): File!
        CreateCook(bodyData: CreateCookInput): BResponse
        UpdateCook(bodyData: UpdateCookInput): BResponse
        DeleteCook(Id: Int): BResponse
    }
`

module.exports = typeDefs