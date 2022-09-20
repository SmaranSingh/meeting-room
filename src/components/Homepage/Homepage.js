import './Homepage.css';

import { GET_ALL_MEETINGS, GET_ALL_MEETING_ROOMS, GET_BUILDINGS } from '../../Queries';

import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { actions, useStore } from '../../AppContext';
import { useQuery } from '@apollo/client';

const Homepage = () => {
  const {
    state: { idCounter },
    dispatch,
  } = useStore();
  const { loading: buildingsLoading, error: buildingsError, data: buildingsData } = useQuery(GET_BUILDINGS);
  const {
    loading: meetingRoomsLoading,
    error: meetingRoomsError,
    data: meetingRoomsData,
  } = useQuery(GET_ALL_MEETING_ROOMS);
  const { loading: meetingsLoading, error: meetingsError, data: meetingsData } = useQuery(GET_ALL_MEETINGS);
  const { Buildings: buildings } = buildingsData || {};
  const { MeetingRooms: meetingRooms } = meetingRoomsData || {};
  const { Meetings: meetings } = meetingsData || {};

  useEffect(() => {
    if (meetings && meetings.length) {
      let maxId = idCounter;
      meetings?.forEach(({ id }) => {
        if (id >= maxId) {
          maxId = id + 1;
        }
      });

      if (maxId !== idCounter) {
        dispatch({ type: actions.SET_ID_COUNTER, payload: maxId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetings]);

  const formatDate = date => date.split('/').reverse().join('-');

  const getActiveMeetings = () => {
    let count = 0;
    meetings.forEach(meeting => {
      const startTime = new Date(`${formatDate(meeting.date)} ${meeting.startTime}`).getTime();
      const endTime = new Date(`${formatDate(meeting.date)} ${meeting.endTime}`).getTime();
      const now = Date.now();

      if (now >= startTime && now <= endTime) {
        count += 1;
      }
    });

    return count;
  };

  if (buildingsError || meetingRoomsError || meetingsError) return <p>Error :(</p>;
  if (buildingsLoading || meetingRoomsLoading || meetingsLoading) return <p>Loading...</p>;

  const activeMeetings = getActiveMeetings();

  return (
    <div className="page-container">
      <div className="info-box">
        <p>Buildings</p>
        <p>Total {buildings?.length || 0}</p>
      </div>
      <div className="info-box">
        <p>Rooms</p>
        <p>Total {meetingRooms?.length || 0}</p>
        <p>Free now {meetingRooms?.length - activeMeetings || 0}</p>
      </div>
      <div className="info-box">
        <p>Meetings</p>
        <p>Total {meetings?.length || 0}</p>
        <p>Active {activeMeetings || 0}</p>
      </div>
      <Link to="/create-meeting">
        <button className="add-meeting-cta" data-testid="add-meeting-btn">
          Add a meeting
        </button>
      </Link>
    </div>
  );
};

export default Homepage;
