import P5 from 'p5';
import { ReactP5Wrapper, Sketch } from 'react-p5-wrapper';
import song0 from '../../assets/audio/SheepAndTides.mp3';
import song1 from '../../assets/audio/Drugs.mp3';
import song2 from '../../assets/audio/KickedOutBySeven.mp3';
import song3 from '../../assets/audio/TheCaptain.mp3';
import cover0 from '../../assets/covers/SheepsAndTides.webp';
import cover1 from '../../assets/covers/Drugs.webp';
import cover2 from '../../assets/covers/KickedOutBySeven.webp';
import cover3 from '../../assets/covers/TheCaptain.webp';
import data from '../../data/data.json';

const AudioVis: Sketch = (p5) => {
  let fft: P5.FFT;
  let h: number;

  interface Song {
    audioUrl: string;
    coverUrl: string;
    title?: string;
    year?: number;
    artist?: string;
    id?: number;
    album?: string;
    audio?: P5.SoundFile;
    cover?: P5.Element;
    duration?: number;
  }

  const songs: Song[] = [
    { audioUrl: song0, coverUrl: cover0 },
    { audioUrl: song1, coverUrl: cover1 },
    { audioUrl: song2, coverUrl: cover2 },
    { audioUrl: song3, coverUrl: cover3 }
  ];

  let play: P5.Element;
  let nextButton: P5.Element;
  let prevButton: P5.Element;
  let nowPlaying: P5.SoundFile;
  let songTitleAndArtist: P5.Element;
  let songAlbumAndYear: P5.Element;
  let volumeSlider: P5.Element;
  let audioTimelineSlider: P5.Element;
  let audioControlsAndTimelineContainer: P5.Element;
  let playbackContainer: P5.Element;
  let audioControlsContainer: P5.Element;
  let albumCoverAndMetaDataContainer: P5.Element;
  let albumCoverContainer: P5.Element;
  let songMetadataContainer: P5.Element;

  let currentSong = 0;
  const w = 10;

  p5.preload = () => {
    loadAndFormatAudioData();
  };

  p5.setup = () => {
    // Transformations
    p5.createCanvas(700, 500, p5.WEBGL);
    p5.angleMode(p5.DEGREES);
    fft = new P5.FFT(0.9, 512);

    // HTML elements
    initializeHtml();

    // Set button listeners
    keyboardControls();

    // Set initial song
    nowPlaying = songs[currentSong].audio!;
  };

  p5.draw = () => {
    p5.background(3, 2, 1, 0.8);
    p5.translate(0, 0, -100);
    p5.rotateX(60);

    updateVisualization();
    updateVolume();
    updateTimeline();
    autoPlayNextSongOnEnd();
    // updateAudioOnDrag();
  };

  p5.keyPressed = () => {
    p5.key == ' '
      ? playSong()
      : p5.key == 'o'
      ? toggleOrthoOn()
      : p5.key == 'p'
      ? toggleOrthoOff()
      : p5.key == 'ArrowRight'
      ? next()
      : p5.key == 'ArrowLeft'
      ? prev()
      : null;
  };

  function toggleOrthoOn() {
    p5.ortho();
  }

  function toggleOrthoOff() {
    p5.perspective();
  }

  function updateVolume() {
    nowPlaying.setVolume(Number(volumeSlider.value()) * 0.1);
  }

  function keyboardControls() {
    prevButton.mousePressed(() => {
      prev();
      albumCoverContainer.child(songs[currentSong].cover);
    });

    nextButton.mousePressed(() => {
      next();
      albumCoverContainer.child(songs[currentSong].cover);
    });

    play.mousePressed(() => {
      playSong();
    });
  }

  function loadAndFormatAudioData() {
    songs.forEach((song, i) => {
      // Load audio for song
      song.audio = p5.loadSound(song.audioUrl);

      // Load album cover for song
      const img = p5.createImg(song.coverUrl, 'song');
      img.addClass('album-cover');
      song.cover = img;

      // Load song metadata
      song.id = data.songs[i].id;
      song.title = data.songs[i].title;
      song.artist = data.songs[i].artist;
      song.album = data.songs[i].album;
      song.year = data.songs[i].year;
      song.duration = songs[i].audio?.duration();
    });
  }

  function next() {
    play.addClass('display-pause-icon');

    nowPlaying.stop();

    const check = currentSong + 1;
    check > songs.length - 1 ? (currentSong = 0) : currentSong++;

    // Update currently playing song data
    nowPlaying = songs[currentSong].audio!;
    albumCoverContainer.child(songs[currentSong].cover);
    songTitleAndArtist.html(
      `${songs[currentSong].title} by ${songs[currentSong].artist} `
    );
    songAlbumAndYear.html(
      `${songs[currentSong].album}, ${songs[currentSong].year}`
    );
    nowPlaying.play();
  }

  function prev() {
    play.addClass('display-pause-icon');

    nowPlaying.stop();

    const check = currentSong - 1;
    check < 0 ? (currentSong = songs.length - 1) : currentSong--;

    nowPlaying = songs[currentSong].audio!;
    albumCoverContainer.child(songs[currentSong].cover);
    songTitleAndArtist.html(
      `${songs[currentSong].title} by ${songs[currentSong].artist} `
    );
    songAlbumAndYear.html(
      `${songs[currentSong].album}, ${songs[currentSong].year}`
    );
    nowPlaying.play();
  }

  function playSong() {
    if (nowPlaying.isPlaying()) {
      nowPlaying.pause();
      play.removeClass('display-pause-icon');
    } else {
      nowPlaying.play();
      play.addClass('display-pause-icon');
    }
  }

  function initializeHtml() {
    play = p5.createButton('');
    nextButton = p5.createButton('');
    prevButton = p5.createButton('');
    songTitleAndArtist = p5.createElement(
      'h2',
      `${songs[currentSong].title} by ${songs[currentSong].artist} `
    );
    songAlbumAndYear = p5.createElement(
      'p',
      `${songs[currentSong].album}, ${songs[currentSong].year}`
    );
    volumeSlider = p5.createSlider(0, 50, 25, 1);
    audioTimelineSlider = p5.createSlider(0, 100, 0, 1);
    audioControlsAndTimelineContainer = p5.createElement('div');
    playbackContainer = p5.createElement('div');
    audioControlsContainer = p5.createElement('div');
    albumCoverAndMetaDataContainer = p5.createElement('div');
    albumCoverContainer = p5.createElement('div');
    songMetadataContainer = p5.createElement('div');

    prevButton.addClass('prev-button');
    play.addClass('play-button');
    nextButton.addClass('next-button');
    songTitleAndArtist.addClass('song-title-and-artist');
    volumeSlider.addClass('volume-slider');
    audioTimelineSlider.addClass('audio-timeline-slider');
    playbackContainer.addClass('playback-container');
    audioControlsAndTimelineContainer.addClass(
      'audio-controls-timeline-container'
    );
    audioControlsContainer.addClass('audio-controls-container');
    albumCoverAndMetaDataContainer.addClass('album-cover-metadata-container');
    albumCoverContainer.addClass('album-cover-container');
    songMetadataContainer.addClass('song-metadata-container');
    songAlbumAndYear.addClass('song-album-and-year');

    audioControlsContainer.child(prevButton);
    audioControlsContainer.child(play);
    audioControlsContainer.child(nextButton);

    audioControlsAndTimelineContainer.child(audioControlsContainer);
    audioControlsAndTimelineContainer.child(audioTimelineSlider);

    for (let i = songs.length - 1; i >= 0; i--) {
      albumCoverContainer.child(songs[i].cover);
    }

    songMetadataContainer.child(songTitleAndArtist);
    songMetadataContainer.child(songAlbumAndYear);
    albumCoverContainer.child(songs[currentSong].cover);
    albumCoverAndMetaDataContainer.child(albumCoverContainer);
    albumCoverAndMetaDataContainer.child(songMetadataContainer);

    playbackContainer.child(albumCoverAndMetaDataContainer);
    playbackContainer.child(audioControlsAndTimelineContainer);
    playbackContainer.child(volumeSlider);
  }

  function updateVisualization() {
    const spectrum = fft.analyze();
    for (let x = -p5.width / 3; x < p5.width / 3; x += w) {
      const i = p5.floor(p5.map(x, -300, 200, 0, 256));
      const u = spectrum[i];
      for (let y = 0; y <= 100; y += w) {
        h = u;
        p5.fill(100, h * 1.2, p5.map(y, 0, 100, 100, 255));
        p5.push();
        p5.translate(x, y, h);
        p5.box(w);
        p5.pop();
      }
    }
  }

  function updateTimeline() {
    const audioPosition = nowPlaying.currentTime();
    audioTimelineSlider.value(
      p5.map(audioPosition, 0, nowPlaying.duration(), 0, 100)
    );
  }

  function updateAudioOnDrag() {
    const timelineVal = Number(audioTimelineSlider.value());
    const jumpVal = p5.map(timelineVal, 0, 100, 0, nowPlaying.duration());
    console.log(jumpVal, nowPlaying.duration());
    // nowPlaying.jump(jumpVal, nowPlaying.duration());
  }

  function autoPlayNextSongOnEnd() {
    nowPlaying.onended(() => next());
  }
};

export const P5AudioVisualizer = () => {
  return <ReactP5Wrapper sketch={AudioVis} />;
};
