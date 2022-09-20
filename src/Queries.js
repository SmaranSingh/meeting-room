import { gql } from '@apollo/client';

export const GET_BUILDINGS = gql`
  query {
    Buildings {
      name
      id
    }
  }
`;

export const GET_BUILDING = gql`
  query Building($id: Int!) {
    Building(id: $id) {
      name
      meetingRooms {
        id
        name
        floor
      }
    }
  }
`;

export const GET_ALL_MEETING_ROOMS = gql`
  query {
    MeetingRooms {
      id
    }
  }
`;

export const GET_ALL_MEETINGS = gql`
  query {
    Meetings {
      id
      date
      startTime
      endTime
      # meetingRoom {
      #   id
      # }
    }
  }
`;

export const ADD_MEETING = gql`
  mutation Meeting(
    $id: Int!
    $title: String!
    $date: String!
    $startTime: String!
    $endTime: String!
    $meetingRoomId: Int!
  ) {
    Meeting(
      id: $id
      title: $title
      date: $date
      startTime: $startTime
      endTime: $endTime
      meetingRoomId: $meetingRoomId
    ) {
      id
    }
  }
`;
