import React from 'react';
import SplitPane from './SplitPane';
import './App.css';

function App() {
  const initialState = {
    cameraPosition: [10, 10, 10],
    cameraTarget: [0, 0, 0],
    boxPosition: [0, 0, 0],
    boxRotation: [0, 0, 0],
    lighting: {
      ambientIntensity: 0.5,
      pointLightPosition: [10, 10, 10],
    }
  };

  return (
    <div className="app">
      <SplitPane initialSceneState={initialState} />
    </div>
  );
}

export default App;