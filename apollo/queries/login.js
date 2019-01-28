import gql from 'graphql-tag';

const AUTH = gql`
  query auth($username: String!, $password: String!) {
    auth(username: $username, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

export default AUTH;
