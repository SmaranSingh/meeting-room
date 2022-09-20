import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../AppContext';
import { startIsLess } from '../../Helpers';
import { GET_BUILDINGS } from '../../Queries';
import './AddMeetingForm.css';

const AddMeetingForm = ({ className = '' }) => {
  const { loading: buildingsLoading, error: buildingsError, data: buildingsData } = useQuery(GET_BUILDINGS);
  const { Buildings: buildings } = buildingsData || {};
  const [title, setTitle] = useState();
  const [dateInput, setDateInput] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [buildingId, setBuildingId] = useState();
  const {
    dispatch,
    state: {
      // formData: { title, date, startTime, endTime },
    },
  } = useStore();
  let navigate = useNavigate();

  const validate = () => {
    const { year, month, date } = parseDate();
    if (!startIsLess(startTime, endTime)) {
      return { message: 'Start time should be earlier than End Time' };
    }
    if (year > '9999') {
      return { message: 'Please select a reasonable year!' };
    }
    const startTimeArray = startTime.split(':');
    const endTimeArray = endTime.split(':');
    const startMin = parseInt(startTimeArray[0]) * 60 + parseInt(startTimeArray[1]);
    const endMin = parseInt(endTimeArray[0]) * 60 + parseInt(endTimeArray[1]);

    if (endMin - startMin < 15) {
      return { message: 'Meeting should be atleast 15 mins long' };
    }

    return false;
  };

  const parseDate = () => {
    const [year, month, date] = dateInput.split('-');

    return { year, month, date };
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    const { year, month, date } = parseDate();
    const hasErrors = validate();

    if (!hasErrors) {
      dispatch({
        type: actions.SET_FORM_DATA,
        payload: {
          title,
          date: `${date}/${month}/${year}`,
          startTime,
          endTime,
          buildingId: parseInt(buildingId),
        },
      });
      navigate('/create-meeting/select-room');
    } else {
      alert(hasErrors.message);
    }
  };

  const handleBlur = () => {
    const hasErrors = validate();

    if (hasErrors) {
      alert(hasErrors.message);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="page-container add-meeting-form">
      <div className="input-grid">
        <label htmlFor="title">Title</label>
        <input id="title" required defaultValue={title} onChange={e => setTitle(e.target.value)} />
        <label htmlFor="date">Date</label>
        <input id="date" type="date" required defaultValue={dateInput} onChange={e => setDateInput(e.target.value)} />
        <label htmlFor="start-time">Start Time</label>
        <input id="start-time" type="time" required defaultValue={startTime} onChange={e => setStartTime(e.target.value)} />
        <label htmlFor="end-time">End Time</label>
        <input id="end-time" type="time" required defaultValue={endTime} onBlur={handleBlur} onChange={e => setEndTime(e.target.value)} />
      </div>
      {buildingsLoading && <p>Loading</p>}
      {buildingsError && <p>Error :(</p>}
      {!buildingsLoading && !buildingsError && (
        <select selected={buildingId} className="building-dropdown" required defaultValue="" onChange={e => setBuildingId(e.target.value)}>
          <option value="" disabled>
            Select a building
          </option>
          {buildings?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      )}
      <button type="submit" className="primary-cta">
        Next
      </button>
    </form>
  );
};

AddMeetingForm.propTypes = {
  className: PropTypes.string,
};

export default AddMeetingForm;
