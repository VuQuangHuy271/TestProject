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
        dataCook: CookInput,
    }

    input UpdateCookInput {
        dataCook: CookInput,
    }

    input UpdateCookInputReal {
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

    input searchCookInput {
        Ten: String,
    }

    # ROOT TYPE
    type Query {
        getListCook: GetListCookResponse
        getListCookByID(Id: Int): GetCookByIdResponse
        searchCook(bodyData: searchCookInput): GetListCookResponse
    }

    type Mutation {
        CreateCook(bodyData: CreateCookInput): BResponse
        UpdateCook(bodyData: UpdateCookInput): BResponse
        DeleteCook(Id: Int): BResponse
    }
`

module.exports = typeDefs