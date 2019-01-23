import gql from 'graphql-tag';

export const AGAMA_ALL = gql`
  query {
    agamaAll {
      id
      label
      value
    }
  }
`;

export const AGAMA_CREATE = gql`
  mutation agamaCreate($label: String!, $value: Int!) {
    agamaCreate(label: $label, value: $value) {
      id
      label
      value
    }
  }
`;
