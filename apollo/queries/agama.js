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

export const AGAMA_UPDATE = gql`
  mutation agamaUpdate($id: String!, $label: String!) {
    agamaUpdate(id: $id, label: $label) {
      id
      label
      value
    }
  }
`;

export const AGAMA_DELETE = gql`
  mutation agamaDelete($delete: [AgamaDeleteInputType]!) {
    agamaDelete(delete: $delete) {
      id
    }
  }
`;
