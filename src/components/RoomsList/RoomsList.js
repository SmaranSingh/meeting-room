import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../AppContext';
import { ADD_MEETING, GET_BUILDING } from '../../Queries';
import './RoomsList.css';

const RoomsList = () => {
  const [selectedRoom, setSelectedRoom] = useState();
  const {
    state: {
      formData: { title, date, startTime, endTime, buildingId },
      idCounter,
    },
    dispatch,
  } = useStore();
  let navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [saveMeeting, { data, loading, error }] = useMutation(ADD_MEETING);

  useEffect(() => {
    if (!buildingId) {
      navigate('/create-meeting');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const {
    loading: buildingLoading,
    error: buildingError,
    data: buildingData,
  } = useQuery(GET_BUILDING, {
    variables: { id: buildingId },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
  });

  const handleSaveClick = () => {
    dispatch({
      type: actions.SAVE_MEETING,
      payload: {
        selectedRoom,
      },
    });
    saveMeeting({
      variables: {
        id: idCounter,
        title,
        date,
        startTime,
        endTime,
        meetingRoomId: selectedRoom,
      },
    });
  };

  const { Building: building } = buildingData || {};

  return (
    <div className="page-container">
      <h2 className="add-room-header">
        {buildingError
          ? 'Unexpected error ocured, please start again'
          : buildingLoading
          ? 'Please wait while we get the available rooms'
          : 'Please select one of the free rooms'}
      </h2>
      {building?.meetingRooms?.map(({ id, name, floor }) => (
        <div key={id} className="room-card" onClick={() => setSelectedRoom(id)}>
          <p>{name}</p>
          <p>{building.name}</p>
          <p>Floor {floor}</p>
        </div>
      ))}
      <button className="primary-cta" disabled={!selectedRoom} onClick={handleSaveClick}>
        Save
      </button>
    </div>
  );
};

export default RoomsList;
