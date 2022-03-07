import React, { Component, Fragment } from 'react';
import Screen from './Screen.jsx';

class App extends Component {

  constructor(props){
      super(props);
      this.state = {
      };
  }

  render(){
    return (
    <Fragment>
      <Screen/>
    </Fragment>
    );
  }
}

export default App;