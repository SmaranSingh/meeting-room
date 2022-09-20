import './App.css';

import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';

import AddMeetingForm from './components/AddMeetingForm';
import Homepage from './components/Homepage';
import RoomsList from './components/RoomsList';
import { withContext } from './AppContext';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create-meeting" exact element={<AddMeetingForm />} />
          <Route path="/create-meeting/select-room" exact element={<RoomsList />} />
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default withContext(App);
