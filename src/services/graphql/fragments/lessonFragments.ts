import { gql } from '@apollo/client';

export const LESSON_CORE_FIELDS = gql`
  fragment LessonCoreFields on lessons {
    title
    slug
    short_description
    language
    lesson_number
    main_image {
      id
      title
      filename_download
      type
      filesize
      width
      height
    }
    lesson_series {
      id
      title
      slug
      description
      image {
        id
      }
    }
    tags
  }
`; 