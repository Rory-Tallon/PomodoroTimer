import './App.css';

import * as React from "https://cdn.skypack.dev/react@17.0.1";
import * as ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
       breakLength: 300,
       sessionLength: 1500,
       timeLeft: 1500,
       running: false,
       timerLabel: "Session"
    };
    this.handleUp = this.handleUp.bind(this);
    this.handleDown = this.handleDown.bind(this);
    this.playPause = this.playPause.bind(this);
    this.reset = this.reset.bind(this);
    this.timeConversion = this.timeConversion.bind(this);
  } 


  //Handle the user incrementing the timers
  //Timers display in MM or MM:SS but are coded in seconds
  handleUp(buttonType){
    if (buttonType == "break"){
      if (this.state.breakLength < 3600){
        let newLength = this.state.breakLength + 60;
        this.setState({
          breakLength: newLength
        })  
      }
    } else {
      let newLength = this.state.sessionLength + 60;
      if (this.state.sessionLength < 3600){
        this.setState({
          sessionLength: newLength,
          timeLeft: newLength
        })  
      }
      
    }
  }


  //Handle the user decrementing the timer
  //Timers display in MM or MM:SS but are coded in seconds
  //Timers cannot go lower than one minute
  handleDown(buttonType){
    if (buttonType == "break"){
      if (this.state.breakLength > 60){
        let newLength = this.state.breakLength - 60;
        this.setState({
          breakLength: newLength
        })        
      }

    } else {
      let newLength = this.state.sessionLength - 60;
      if (this.state.sessionLength > 60){
        this.setState({
          sessionLength: newLength,
          timeLeft: newLength
        }) 
      }  
    }
  }
  

  //Handles the user pressing play/pause/reset
  //Play starts the timer from its current position
  //Pause stops the timer in its current position
  //Reset stops timer
  //The alarm is also played here
  playPause(type) {
    if (type === "reset"){
      clearInterval(this.timer);
    } else {
      if (!this.state.running){
        console.log("Play")
        this.setState({
          running: true
        }) 
        this.timer = setInterval(() => {
          this.setState({timeLeft: this.state.timeLeft - 1});
          if(this.state.timeLeft < 0){
            this.audioBeep.play()
            if (this.state.timerLabel === "Session"){
              this.setState({
                timerLabel: "Break",
                timeLeft: this.state.breakLength
              })
            } else {
              this.setState({
                timerLabel: "Session",
                timeLeft: this.state.sessionLength
              })
            }
          };},1000)  
      } else {
        console.log("Pause")
        clearInterval(this.timer);
        this.setState({
          running: false
        })
      }
    }
  }
  

  //This converts all time which is coded in seconds to Minutes/MM:SS
  timeConversion(timeSeconds, type){
    let tempSeconds = timeSeconds
    let minutes = Math.floor(tempSeconds/60);
    let seconds = tempSeconds % 60 
    let finalTime = "Error"
    

    //Only display session timer in MM:SS
    if (type != 0){
      if(minutes<10){minutes = "0" + String(minutes)}
      if(seconds<10){seconds = "0" + String(seconds)}
      finalTime = String(minutes) + ":" + String(seconds)
    } else {
      finalTime = String(minutes)
    }
    return finalTime
  }
  
  //Sets timers to defaults
  reset() {
    this.setState({
       breakLength: 300,
       sessionLength: 1500,
       timeLeft: 1500,
       timerLabel: "Session",
       running: false
    })
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.playPause("reset");
  }
 
  //Renders the timers
  render () {
    return(
      <div id="drum-machine" className="center">
        <h1 className="text">25 + 5 Machine</h1>
        <div id="display">
          <div className="container">
            <h2 className="text" id="break-label">Break Length</h2>
            <h2 className="text" id="session-label">Session Length</h2>
          </div>
          <div className=" text container">
            <h2 id="break-length">{this.timeConversion(this.state.breakLength, 0)}</h2>
            <h2 id="session-length">{this.timeConversion(this.state.sessionLength, 0)}</h2>
          </div>
          <div className="container text">
            <button id="break-increment" onClick={() => this.handleUp("break")}>&#8593;</button>
            <button id="break-decrement" onClick={() => this.handleDown("break")}>&#8595;</button>
            <button id="session-increment" onClick={() => this.handleUp()}>&#8593;</button>
            <button id="session-decrement" onClick={() => this.handleDown()}>&#8595;</button>
          </div>
          <div className="container text seshtimer">
            <h1 id="timer-label">{this.state.timerLabel}</h1>
          </div>
          <h1 className="text" id="time-left">{this.timeConversion(this.state.timeLeft, 1)}</h1>
          <div id="start_stop" onClick={this.playPause} className="container text playPause">
            <p className="text">⏯</p>
          </div>
          <div id="reset" onClick={this.reset} className="container text">
            <p className="text">↻</p>
          </div>
        </div>
                <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    )
  }
}

export default App;
