import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';


const _getListCook = gql`
query ListData {
  getListCook {
    listData {
      Anh_Url
      Id
      MoTa
      Ten
    }
    message
    messageCode
  }
}
`;

const _getListCookByID = gql`
query GetListCookByID($Id: Int) {
  getListCookByID(Id: $Id) {
    Data {
      Anh_Url
      Id
      MoTa
      Ten
    }
    message
    messageCode
  }
}
`

@Injectable({
    providedIn: 'root'
})
export class CookService {

    constructor(private apollo: Apollo) { }

    getListCook() {
        return new Promise((resolve, reject) => {
            return this.apollo
                .query<any>({
                    variables: {

                    },
                    query: _getListCook,
                    fetchPolicy: 'network-only'
                }).toPromise()
                .then(response => {
                    resolve(response?.data.getListCook)
                });
        });
    }

    getListCookByID(Id: number) {
        return new Promise((resolve, reject) => {
            return this.apollo
                .query<any>({
                    variables: {
                        Id
                    },
                    query: _getListCookByID,
                    fetchPolicy: 'network-only'
                }).toPromise()
                .then(response => {
                    resolve(response?.data.getListCookByID)
                });
        });
    }
}