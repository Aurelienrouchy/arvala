import { gql } from '@apollo/client';

export const GET_USER_BY_TOKEN = gql`
    query User($token: String!) {
        getUserByToken(token: $token) {
            lname
            fname
            email
            favorites
        }
    }
`
