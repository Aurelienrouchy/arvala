import { gql } from '@apollo/client';

export const REGISTER = gql`
    mutation Register($token: String!) {
        registerLinkedinUser(token: $token) {
            token
            lname
            fname
        }
    }
`