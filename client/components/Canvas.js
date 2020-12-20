/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable react/no-array-index-key */
/* eslint-disable complexity */
/* eslint-disable react/button-has-type */
/* eslint-disable max-statements */
import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-input-slider';
import { SketchPicker } from 'react-color';
import { animate, createGrid, renderSaved } from '../utility';
import { connect } from 'react-redux';
import { createSession, getSession, saveSession } from '../store';

let initialFrames = [];
// let initialColors = [];
let canvas, ctx;

const Canvas = (props) => {
  const { user, createSess, sessionId, saveFrames } = props;

  const [pixelSize, setPixelSize] = useState(8);
  const [pixelSelect, setPixelSelect] = useState(1);
  const [factor, setFactor] = useState(1);
  const [framesArray, setFramesArray] = useState([]);
  const [mappedGrid, setMappedGrid] = useState({});
  const [frameCounter, setFrameCounter] = useState(initialFrames.length + 1);
  const [currentFrame, setCurrentFrame] = useState('1');
  const [fps, setFps] = useState(5);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  // const [colorsUsed, setColorsUsed] = useState([]);

  const canvasRef = useRef();

  useEffect(() => {
    canvas = canvasRef.current;
    console.log('get session = ', getSession(user));
    getFrames();
    ctx = canvas.getContext('2d');

    createGrid(ctx, pixelSize, mappedGrid);

    const storage = initialFrames.map((elem) => {
      return localStorage.getItem(elem);
    });

    localStorage.clear();
    storage.forEach((item, idx) => {
      localStorage.setItem(`${idx + 1}`, item);
    });

    // socket.on('fill', (x, y, color, pixelSize, factor) => {
    //   fillPixel(x, y, color, pixelSize, factor);
    // });

    setFrameCounter(initialFrames.length);

    if (initialFrames.length === 0) {
      addBlankFrame();
    }

    setFramesArray(initialFrames);
    setCurrentFrame(`${frameCounter}`);
    getCanvas(currentFrame);
    console.log('USER', user);
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    ctx = canvas.getContext('2d');
  }, [
    color,
    mappedGrid,
    currentFrame,
    frameCounter,
    framesArray,
    pixelSize,
    factor,
  ]);

  function handleChangeComplete(newColor) {
    setColor(newColor.hex);
  }

  // --------- TOGGLE TOOL--------- //
  function toggleTool() {
    // toggles between draw and erase
    if (tool) setTool(false);
    else setTool(true);
  }

  // --------- TOGGLE INSTRUCTIONS--------- //
  function toggleInstructions() {
    // toggles between draw and erase
    setShowInstructions(!showInstructions);
  }

  // --------- GET FRAMES--------- //
  function getFrames() {
    for (let key in localStorage) {
      if (
        key !== 'currentColor' &&
        typeof localStorage[key] === 'string' &&
        !initialFrames.includes(key)
      ) {
        initialFrames.push(key);
      }
    }
    initialFrames = initialFrames.sort((a, b) => a - b);
    setFramesArray(framesArray.concat(initialFrames));

    if (initialFrames[0]) {
      let frameObj = JSON.parse(localStorage.getItem(initialFrames[0]));
      console.log('frame = ', frameObj);

      let frameArr = Object.values(frameObj);
      console.log('frame array --->', typeof frameArr);

      let session = {
        canvas: frameArr,
        userId: user,
      };

      createSess(session);

      //   for (let row in frameObj) {
      //     // console.log('frameObj row =  ', Array.isArray(frameObj[row]));
      //   //   for (let i = 0; i < 48; i++) {
      //   //     let elem = frameObj[row][i];
      //   //     if (!initialColors.includes(elem) && elem) {
      //   //       console.log("color = ", elem);
      //   //       initialColors.push(elem);
      //   //     }
      //   //   }
      //   // }
    }
  }

  // --------- DELETE FRAMES --------- //
  function deleteFrame(canvasName) {
    const filteredArray = framesArray.filter((frame) => frame !== canvasName);
    localStorage.removeItem(canvasName);
    let idx = framesArray.indexOf(canvasName);
    setFramesArray(filteredArray);

    setCurrentFrame(`${framesArray.length}`);
    setFrameCounter(frameCounter - 1);

    const storage = filteredArray.map((elem) => {
      return localStorage.getItem(elem);
    });
    localStorage.clear();
    storage.forEach((item, i) => {
      localStorage.setItem(`${i + 1}`, item);
    });

    setTimeout(() => {
      if (filteredArray.includes(`${idx}`)) getCanvas(`${idx}`);
      else getCanvas(filteredArray[0]);
    }, 50);
  }

  // --------- CREATE A NEW FRAME --------- //
  function addBlankFrame() {
    ctx.clearRect(0, 0, 16 * 24, 16 * 24);
    createGrid(ctx, pixelSize, mappedGrid);
    if (framesArray.includes(`${frameCounter}`)) {
      localStorage.setItem(`${frameCounter + 1}`, JSON.stringify(mappedGrid));
      setFrameCounter(frameCounter + 1);
      setCurrentFrame(`${framesArray.length + 1}`);
    } else {
      localStorage.setItem(`${frameCounter + 1}`, JSON.stringify(mappedGrid));
      setFrameCounter(frameCounter + 1);
      setCurrentFrame(`${framesArray.length + 1}`);
    }
    setFramesArray([...framesArray, `${frameCounter + 1}`]);
    setCurrentFrame(`${frameCounter}`);

    setTimeout(() => getCanvas(`${frameCounter + 1}`), 50);
  }

  // --------- DUPLICATE CURRENT FRAME --------- //
  // saves canvas, adds it to array of canvases
  function addFrame() {
    if (!framesArray.includes(`${frameCounter}`)) {
      localStorage.setItem(`${frameCounter}`, JSON.stringify(mappedGrid));
      setFrameCounter(frameCounter + 1);
      setFramesArray([...framesArray, `${frameCounter}`]);
    } else if (framesArray.includes(`${frameCounter}`)) {
      localStorage.setItem(`${frameCounter + 1}`, JSON.stringify(mappedGrid));
      setFrameCounter(frameCounter + 1);
      setFramesArray([...framesArray, `${frameCounter + 1}`]);
    }

    ctx.clearRect(0, 0, 16 * 24, 16 * 24);
    createGrid(ctx, pixelSize, mappedGrid);

    setCurrentFrame(`${frameCounter}`);
    setTimeout(() => getCanvas(`${framesArray.length + 1}`), 50);
  }

  // --------- NEW SESSION--------- //
  function newSession() {
    resetCanvas();
    localStorage.clear();

    setFrameCounter(1);
    setFramesArray(['1']);
    initialFrames = [];
    localStorage.setItem(`1`, JSON.stringify(mappedGrid));
    setCurrentFrame('1');
  }

  // --------- GET CANVAS--------- //
  function getCanvas(frameNumber) {
    ctx.clearRect(0, 0, 16 * 24, 16 * 24);
    let item = JSON.parse(localStorage.getItem(frameNumber));
    renderSaved(item, ctx); // item is obj of arrays
    setCurrentFrame(`${frameNumber}`);
    setMappedGrid(item);
  }

  // --------- RESET CANVAS --------- //
  function resetCanvas() {
    ctx.clearRect(0, 0, 16 * 24, 16 * 24);
    createGrid(ctx, pixelSize, mappedGrid);
    localStorage.setItem(`${currentFrame}`, JSON.stringify(mappedGrid));
  }

  // --------- DELETE PIXEL --------- //
  function deletePixel(defaultX, defaultY) {
    const canvasRect = canvas.getBoundingClientRect();
    // These are not the actual coordinates but correspond to the place on the grid
    let x =
      defaultX ?? Math.floor((window.event.clientX - canvasRect.x) / pixelSize);
    let y =
      defaultY ?? Math.floor((window.event.clientY - canvasRect.y) / pixelSize);
    // if (defaultX === undefined && defaultY === undefined) {
    //   socket.emit('delete', x, y);
    // }
    // MAP color to proper place on mappedGrid
    for (let i = 0; i < factor; i++) {
      for (let j = 0; j < factor; j++) {
        mappedGrid[y * factor + i][x * factor + j] = null;
      }
    }
    // These are the actual coordinates to properly place the pixel
    let actualCoordinatesX = x * pixelSize;
    let actualCoordinatesY = y * pixelSize;
    ctx.clearRect(actualCoordinatesX, actualCoordinatesY, pixelSize, pixelSize);

    localStorage.setItem(`${currentFrame}`, JSON.stringify(mappedGrid));
  }

  // --------- FILL PIXEL --------- //
  function fillPixel(defaultX, defaultY) {
    //need to add a color value to the parameters
    const canvasRect = canvas.getBoundingClientRect();

    // These are not the actual coordinates but correspond to the place on the grid
    let x =
      defaultX ?? Math.floor((window.event.clientX - canvasRect.x) / pixelSize);
    let y =
      defaultY ?? Math.floor((window.event.clientY - canvasRect.y) / pixelSize);
    // setColorsUsed([...colorsUsed, color]);
    // MAP color to proper place on mappedGrid
    for (let i = 0; i < factor; i++) {
      for (let j = 0; j < factor; j++) {
        if (y * factor + i >= 0 && x * factor + j >= 0) {
          mappedGrid[y * factor + i][x * factor + j] = color;
        }
      }
    }
    // if (defaultX === undefined && defaultY === undefined) {
    //   socket.emit('fill', x, y, color, pixelSize, factor);
    // }

    // These are the actual coordinates to properly place the pixel
    let actualCoordinatesX = x * pixelSize;
    let actualCoordinatesY = y * pixelSize;

    ctx.fillStyle = color;

    ctx.fillRect(actualCoordinatesX, actualCoordinatesY, pixelSize, pixelSize);

    localStorage.setItem(`${currentFrame}`, JSON.stringify(mappedGrid));
  }

  // --------- MOUSE DOWN FOR DRAG--------- //
  function handleMouseDown() {
    if (tool) {
      fillPixel();
    } else {
      deletePixel();
    }
  }

  // --------- CONTINUOUS DRAG PIXEL --------- //
  function dragPixel() {
    canvas.addEventListener('mousemove', handleMouseDown, true);
    window.addEventListener('mouseup', (secondEvent) => {
      canvas.removeEventListener('mousemove', handleMouseDown, true);
    });
  }

  // --------- SET PIXEL SIZE --------- //
  function pixelChange(event) {
    let newFactor;
    let pixels = parseInt(event.target.value, 10);
    if (pixels === 24) {
      newFactor = 3;
    } else if (pixels === 16) {
      newFactor = 2;
    } else if (pixels === 8) {
      newFactor = 1;
    }
    // socket.emit('setPixelSize', pixels, factor);
    setPixelSize(pixels);
    setFactor(newFactor);
    setPixelSelect(newFactor);
  }

  return (
    <div>
      <nav className="nav container">
        <button onClick={toggleInstructions} className="btn instruct-btn">
          Instructions
        </button>
        <div
          className={`${
            showInstructions ? 'instructions show' : 'instructions'
          }`}
        >
          <h3>Welcome!</h3>
          INSTRUCTIONS GO HERE
          <button
            onClick={toggleInstructions}
            className="btn close-instruct-btn"
          >
            Close
          </button>
        </div>
      </nav>
      <div className="main-container container">
        <div className="toolbox-container">
          <div className="">
            <div>
              <SketchPicker
                className="sketch"
                color={color}
                disableAlpha={true}
                onChangeComplete={handleChangeComplete}
              />
            </div>
          </div>
          {/* <ColorPicker currentColor={setColor} /> */}
          <div className="tools">
            <button
              onClick={toggleTool}
              className={`btn ${
                tool ? 'tool-btn tool-btn-active' : 'tool-btn'
              }`}
            >
              Draw
            </button>
            <button
              onClick={toggleTool}
              className={`btn ${
                tool ? 'tool-btn' : 'tool-btn tool-btn-active'
              }`}
            >
              Erase
            </button>
          </div>
        </div>
        <div className="canvas-container">
          <h3>FRAME {currentFrame}</h3>

          <div className="canvas">
            <canvas
              className="real-canvas"
              width={16 * 24}
              height={16 * 24}
              ref={canvasRef}
              onClick={() => handleMouseDown()}
              onMouseDown={() => dragPixel()}
            />
            <img
              className="checkered-background"
              src="checkeredBackground.png"
              width={16 * 24}
              height={16 * 24}
            />
            <canvas width={16 * 24} height={16 * 24} />
          </div>

          <div className="frames-header">
            <div className="frames-heading">
              <h3>CHOOSE FRAME</h3>
              <button onClick={() => addBlankFrame()} className="btn add-btn">
                +
              </button>
            </div>
            <hr />
          </div>

          <div className="frames-container">
            <ul>
              {Array.isArray(framesArray) &&
                framesArray.map((frame, index) => {
                  return (
                    <li key={index} className="frame-item">
                      <button
                        className="frame-name frame-btn"
                        onClick={() => getCanvas(frame)}
                      >
                        Frame {frame}
                      </button>
                      <button
                        className="frame-btn frame-btn-delete"
                        onClick={() => deleteFrame(frame)}
                      >
                        DELETE
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="buttons-container">
          <button onClick={resetCanvas} className="btn">
            Reset Canvas
          </button>

          <button onClick={() => addFrame(currentFrame)} className="btn">
            Duplicate Frame
          </button>

          <button
            onClick={() => animate(framesArray, getCanvas, fps, currentFrame)}
            className="btn animate-btn"
          >
            Animate!
          </button>

          <button onClick={newSession} className="btn session-btn">
            New Session
          </button>

          <div className="slider-container">
            <h3 className="slider-header">{fps} FPS</h3>
            <div>
              <Slider
                xmax={10}
                xmin={1}
                axis="x"
                x={fps}
                onChange={({ x }) => setFps(x)}
                className="slider-bar"
              />
            </div>
          </div>
          <div className="pixel-buttons tools">
            <button
              onClick={pixelChange}
              className={`btn ${
                pixelSelect === 1 ? 'pixel-btn pixel-btn-active' : 'pixel-btn'
              }`}
              value={8}
            >
              8px
            </button>
            <button
              onClick={pixelChange}
              className={`btn ${
                pixelSelect === 2 ? 'pixel-btn pixel-btn-active' : 'pixel-btn'
              }`}
              value={16}
            >
              16px
            </button>
            <button
              onClick={pixelChange}
              className={`btn ${
                pixelSelect === 3 ? 'pixel-btn pixel-btn-active' : 'pixel-btn'
              }`}
              value={24}
            >
              24px
            </button>
          </div>
          <button
            onClick={() => {
              let frameObj = JSON.parse(localStorage.getItem(initialFrames[0]));
              let frameArr = Object.values(frameObj);
              let session = {
                canvas: frameArr,
                userId: user,
              };
              console.log('id inside onClick >>> ', session);
              return saveFrames(session);
            }}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
const mapState = (state) => ({
  user: state.user.id,
  sessionId: state.session.id,
});

const mapDispatch = (dispatch) => ({
  createSess: (session) => dispatch(createSession(session)),
  getSession: (userId) => dispatch(getSession(userId)),
  saveFrames: (session) => dispatch(saveSession(session)),
});

export default connect(mapState, mapDispatch)(Canvas);
