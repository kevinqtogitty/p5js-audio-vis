import React from 'react';

interface Props {
  nextSong: () => void;
  previousSong: () => void;
}

const PlaybackDashboard = ({ nextSong, previousSong }: Props) => {
  return (
    <div className="playback-dashboard-main-container">
      <p>PlaybackDashboard</p>
      <button onClick={previousSong}>Previous</button>
      <button onClick={nextSong}>Next</button>
    </div>
  );
};

export default PlaybackDashboard;
