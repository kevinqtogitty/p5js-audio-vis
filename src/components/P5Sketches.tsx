/* eslint-disable @typescript-eslint/no-empty-function */
import P5 from 'p5';
import { Vector } from 'p5';
import { ReactP5Wrapper, Sketch } from 'react-p5-wrapper';
import song0 from '../assets/audio/SheepAndTides.mp3';
import song1 from '../assets/audio/Drugs.mp3';
import song2 from '../assets/audio/KickedOutBySeven.mp3';
import song3 from '../assets/audio/TheCaptain.mp3';

const background: Sketch = (p5) => {
  let canvas;
  const particles: P5.Vector[] = [];
  const num = window.innerWidth + window.innerHeight * 1.5;
  const noiseScale = 0.007;

  p5.setup = () => {
    canvas = p5.createCanvas(window.innerWidth * 0.9899, window.innerHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    for (let i = 0; i < num; i++) {
      particles.push(
        p5.createVector(p5.random(p5.width), p5.random(p5.height))
      );
    }
    p5.stroke(133, 143, 177);
    p5.strokeWeight(1.5);
  };

  p5.keyReleased = () => {
    p5.noiseSeed(p5.millis());
  };

  const onScreen = (v: { x: number; y: number }) => {
    return v.x >= 0 && v.x <= p5.width && v.y >= 0 && v.y <= p5.height;
  };

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  p5.draw = () => {
    p5.background(0, 20);
    particles.forEach((particle) => {
      const p = particle;
      p5.point(p.x, p.y);
      const n = p5.noise(p.x * noiseScale, p.y * noiseScale);
      const a = p5.TAU * n;
      p.x += p5.sin(a) / 1.5;
      p.y += p5.cos(a) / 1.5;
      if (!onScreen(p)) {
        p.x = p5.random(p5.width);
        p.y = p5.random(p5.height);
      }
    });
  };
};

const unknownPleasures: Sketch = (p5) => {
  let canvas = null;
  const step = 6;
  const edge = 30;
  const points: { x: number; y: number }[][] = [];
  const nInc = 0.04;
  let inc = 0;
  let start = 0;
  let h;

  p5.setup = () => {
    canvas = p5.createCanvas(400, 400);
    // canvas.position(0, 0);

    p5.background(0);
    p5.fill(0);
    p5.noiseDetail(2.5, 0.4);
    p5.strokeWeight(1);
    p5.stroke(255);

    for (let y = edge * 1.5; y < p5.height - edge; y += step) {
      points[inc] = [];
      for (let x = edge * 1.5; x < p5.width - edge * 1.5; x++) {
        const p = {
          x: x,
          y: y
        };
        points[inc].push(p);
      }
      inc++;
    }

    for (let i = 0; i < points.length; i++) {
      p5.beginShape();
      for (let j = 0; j < points[i].length; j++) {
        const y = points[i][j].y;
        const x = points[i][j].x;
        // if x lies outside the center
        if (x < p5.width / 3 || x > (2 * p5.width) / 3) {
          h = 5;
        } else {
          if (x < p5.width / 2) {
            h = p5.map(x, p5.width / 3, p5.width / 2, 5, 70);
          } else {
            h = p5.map(x, p5.width / 2, (2 * p5.width) / 3, 70, 5);
          }
        }

        p5.vertex(x, y - h * p5.noise(start));
        start += nInc;
      }
      p5.endShape();
    }
  };

  p5.draw = () => {};
};

const starBurst: Sketch = (p5) => {
  let canvas = null;
  const lines = 700;

  p5.setup = () => {
    canvas = p5.createCanvas(400, 400);
    p5.background(0);

    p5.translate(p5.width / 2, p5.height / 2);

    for (let i = 0; i < lines; i++) {
      const v = Vector.random2D();
      v.mult(p5.random(10, 80));
      p5.strokeWeight(2);
      p5.stroke(255, 50);
      p5.line(0, 0, v.x, v.y);
    }
  };
  p5.draw = () => {};
};

const snowFall: Sketch = (p5) => {
  interface Point {
    x: number;
    y: number;
    z: number;
    weight: number;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let canvas = null;
  const points: Point[] = [];
  let stop = 0;

  const dripdrop = (x: number, y: number, w: number) => {
    p5.stroke(255, 250, 250);
    p5.strokeWeight(w);
    p5.point(x, y);
  };

  p5.setup = () => {
    canvas = p5.createCanvas(400, 400);
    while (stop < p5.width) {
      const p: Point = {
        x: p5.random(p5.width),
        y: p5.random(-200, 200),
        z: p5.random(0, 5),
        weight: 0
      };

      p.weight = p5.map(p.z, 0, 5, 1, 4);
      points.push(p);
      stop++;
    }
  };
  p5.draw = () => {
    p5.background(0);
    points.forEach((p) => {
      // the further away the point the slower it moves
      const yVelocity = p5.map(p.z, 0, 5, 0.5, 2.5);
      const xOffset = p5.map(p.z, 0, 15, -0.5, 2);
      dripdrop(p.x, p.y, p.weight);
      if (p.y > p5.height) {
        p.y = 0;
        p.x = p5.random(p5.width);
      }

      p.y = p.y + yVelocity;
      p.x = p.x + xOffset;
    });
  };
};

const AudioVis: Sketch = (p5) => {
  let fft: P5.FFT;
  let h: number;
  let audio: string;

  const songFiles = [song0, song1, song2, song3];
  const musicList: P5.SoundFile[] = [];

  let play: P5.Element;
  let nextButton: P5.Element;
  let prevButton: P5.Element;
  let nowPlaying: P5.SoundFile;
  let playbackContainer: P5.Element;
  let stat = false;

  const w = 10;

  p5.preload = () => {
    songFiles.forEach((song) => musicList.push(p5.loadSound(song)));
  };

  const toggleOrthoOn = () => {
    p5.ortho();
  };

  const toggleOrthoOff = () => {
    p5.perspective();
  };

  p5.keyPressed = () => {
    p5.key == ' '
      ? playsong()
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

  p5.setup = () => {
    p5.createCanvas(700, 500, p5.WEBGL);
    p5.angleMode(p5.DEGREES);
    fft = new P5.FFT(0.9, 512);

    play = p5.createButton('Play');
    nextButton = p5.createButton('Next');
    prevButton = p5.createButton('Previous');
    playbackContainer = p5.createElement('div');

    prevButton.addClass('prev-button');
    play.addClass('play-button');
    nextButton.addClass('next-button');
    playbackContainer.addClass('playback-container');

    playbackContainer.child(prevButton);
    playbackContainer.child(play);
    playbackContainer.child(nextButton);

    nowPlaying = musicList[0];

    prevButton.mousePressed(() => {
      prev();
    });

    nextButton.mousePressed(() => {
      next();
    });

    play.mousePressed(() => {
      playsong();
    });
  };

  p5.draw = () => {
    p5.background(0);
    p5.translate(0, 0, -100);
    p5.rotateX(60);

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
  };

  function next() {
    nowPlaying.stop();
    if (musicList.indexOf(nowPlaying) + 1 === 4) {
      nowPlaying = musicList[0];
    } else {
      nowPlaying = musicList[musicList.indexOf(nowPlaying) + 1];
    }
    nowPlaying.play();
  }

  function prev() {
    nowPlaying.stop();
    if (musicList.indexOf(nowPlaying) - 1 === -1) {
      nowPlaying = musicList[3];
    } else {
      nowPlaying = musicList[musicList.indexOf(nowPlaying) - 1];
    }
    nowPlaying.play();
  }

  function playsong() {
    if (stat) {
      nowPlaying.stop();
      stat = false;
      console.log(nowPlaying);
    } else {
      stat = true;
      nowPlaying.play();
      console.log(nowPlaying);
    }
  }
};

export const P5Background = () => {
  return <ReactP5Wrapper sketch={background} />;
};

export const P5UnknownPleasures = () => {
  return <ReactP5Wrapper sketch={unknownPleasures} />;
};

export const P5StartBurst = () => {
  return <ReactP5Wrapper sketch={starBurst} />;
};

export const P5SnowFall = () => {
  return <ReactP5Wrapper sketch={snowFall} />;
};

interface Props {
  url: string;
}
export const P5AudioVisualizer = () => {
  return <ReactP5Wrapper sketch={AudioVis} />;
};
