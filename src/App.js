import React from 'react';
import logo from './logo.svg';
import './App.css';
import SignVerifyMessageComp from './SignVerifyMessageComp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SignVerifyMessageComp></SignVerifyMessageComp> 
      </header>
    </div>
  );
}

export default App;
