import React, { useState } from 'react';
import Scene from './Scene';

const SplitPane = ({ initialSceneState, depth = 0, onStateChange }) => {
  const [isSplit, setIsSplit] = useState(false);
  const [splitDirection, setSplitDirection] = useState('vertical');
  const [splitPosition, setSplitPosition] = useState(50);
  const [isHoveringSplit, setIsHoveringSplit] = useState(false);
  const [isHoveringJoin, setIsHoveringJoin] = useState(false);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [currentSceneState, setCurrentSceneState] = useState(initialSceneState);
  const [firstPaneState, setFirstPaneState] = useState(initialSceneState);
  const [secondPaneState, setSecondPaneState] = useState(initialSceneState);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const container = e.currentTarget.parentElement;
    
    const handleMouseMove = (event) => {
      if (splitDirection === 'vertical') {
        const rect = container.getBoundingClientRect();
        const percentage = ((event.clientX - rect.left) / rect.width) * 100;
        setSplitPosition(Math.min(Math.max(percentage, 10), 90));
      } else {
        const rect = container.getBoundingClientRect();
        const percentage = ((event.clientY - rect.top) / rect.height) * 100;
        setSplitPosition(Math.min(Math.max(percentage, 10), 90));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleSplit = () => {
    setIsSplit(true);
    setSplitDirection(depth % 2 === 0 ? 'vertical' : 'horizontal');
    setFirstPaneState(currentSceneState);
    setSecondPaneState(currentSceneState);
  };

  const handleSceneStateChange = (newState, isFirstPane) => {
    if (isSplit) {
      if (isFirstPane) {
        setFirstPaneState(newState);
      } else {
        setSecondPaneState(newState);
      }
    } else {
      setCurrentSceneState(newState);
      if (onStateChange) {
        onStateChange(newState);
      }
    }
  };

  const handleJoin = (retainSide) => {
    const stateToKeep = retainSide === 'first' ? firstPaneState : secondPaneState;
    setCurrentSceneState(stateToKeep);
    if (onStateChange) {
      onStateChange(stateToKeep);
    }
    setIsSplit(false);
    setShowJoinOptions(false);
  };

  if (!isSplit) {
    return (
      <div className="pane">
        <Scene 
          sceneState={currentSceneState} 
          onSceneStateChange={(newState) => handleSceneStateChange(newState, true)}
        />
        <div 
          className="hover-area" 
          onMouseEnter={() => setIsHoveringSplit(true)}
          onMouseLeave={() => setIsHoveringSplit(false)}
        >
          {isHoveringSplit && (
            <button className="split-btn" onClick={handleSplit}>
              Split
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`split-container ${splitDirection}`}>
      <div 
        className="split first" 
        style={{
          [splitDirection === 'vertical' ? 'width' : 'height']: `${splitPosition}%`
        }}
      >
        <SplitPane 
          initialSceneState={firstPaneState} 
          depth={depth + 1}
          onStateChange={(newState) => handleSceneStateChange(newState, true)}
        />
      </div>
      <div 
        className={`divider ${splitDirection}`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHoveringJoin(true)}
        onMouseLeave={() => {
          setIsHoveringJoin(false);
          setTimeout(() => {
            setShowJoinOptions(false);
          }, 300);
        }}
      >
        {isHoveringJoin && !showJoinOptions && (
          <button 
            className="join-btn" 
            onClick={() => setShowJoinOptions(true)}
          >
            Join
          </button>
        )}
        {showJoinOptions && (
          <div className="join-options">
            <button 
              className={`join-option-btn ${splitDirection === 'vertical' ? 'left' : 'up'}`}
              onClick={() => handleJoin('first')}
              style={{ marginRight: '4px' }}
            >
              {splitDirection === 'vertical' ? 'Left' : 'Up'}
            </button>
            <button 
              className={`join-option-btn ${splitDirection === 'vertical' ? 'right' : 'down'}`}
              onClick={() => handleJoin('second')}
            >
              {splitDirection === 'vertical' ? 'Right' : 'Down'}
            </button>
          </div>
        )}
      </div>
      <div 
        className="split second" 
        style={{
          [splitDirection === 'vertical' ? 'width' : 'height']: `${100 - splitPosition}%`
        }}
      >
        <SplitPane 
          initialSceneState={secondPaneState} 
          depth={depth + 1}
          onStateChange={(newState) => handleSceneStateChange(newState, false)}
        />
      </div>
    </div>
  );
};

export default SplitPane;