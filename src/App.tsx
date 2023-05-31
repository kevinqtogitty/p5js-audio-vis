import { useState } from 'react';
import P5 from 'p5';
import PlaybackDashboard from './components/PlaybackDashboard';
await import('p5/lib/addons/p5.sound');
import song1 from './assets/audio/SheepAndTides.mp3';
import song2 from './assets/audio/Drugs.mp3';
import song3 from './assets/audio/KickedOutBySeven.mp3';
import song4 from './assets/audio/TheCaptain.mp3';
import { P5AudioVisualizer } from './components/P5Sketches';

(window as any).p5 = P5;
const songs = [
  {
    id: 0,
    url: song1,
    title: 'Sheeps and Tides',
    album: 'Drowning by Numbers',
    artist: 'Michael Nyman',
    year: 1998
  },
  {
    id: 1,
    url: song2,
    title: 'Drugs',
    album: 'Drugs',
    artist: 'Uffie',
    year: 2018
  },
  {
    id: 2,
    url: song3,
    title: 'Kicked Out by Seven',
    album: 'Eros In The Bunker',
    artist: 'Double Virgo',
    year: 2022
  },
  {
    id: 3,
    url: song4,
    title: 'The Captain',
    album: 'Silent Shout',
    artist: 'Michael Nyman',
    year: 2006
  }
];

function App() {
  return (
    <>
      <P5AudioVisualizer />
    </>
  );
}

export default App;
