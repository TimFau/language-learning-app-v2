import { gql } from '@apollo/client';

export const GET_SAVED_TERMS = gql`
  query GetSavedTerms($limit: Int, $offset: Int) {
    saved_terms(
      limit: $limit
      offset: $offset
      sort: ["-date_created"]
    ) {
      id
      term
      definition
      language
      sync_preference
      date_created
      source_term_key
      source_definition
      source_deck {
        id
        deck_name
        Language2
        status
      }
    }
  }
`;

export const DELETE_SAVED_TERM = gql`
  mutation DeleteSavedTerm($id: ID!) {
    delete_saved_terms_item(id: $id) {
      id
    }
  }
`; 