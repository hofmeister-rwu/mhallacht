import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Game from "../components/Game"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');

// durch die Annotation @observer
function addPlayerOneName(e){
  console.log(e.target.value);
  this.playerOne = e.target.value;
}
function addPlayerTwoName(e){
  console.log(e.target.value);
  this.playerTwo = e.target.value;
}
function addPlayerThreeName(e){
  console.log(e.target.value);
  this.playerThree = e.target.value;
}
function addPlayerFourName(e){
  console.log(e.target.value);
  this.playerFour = e.target.value;
}
function addPlayerFiveName(e){
  console.log(e.target.value);
  this.playerFive = e.target.value;
}
function addPlayerSixName(e){
  console.log(e.target.value);
  this.playerSix= e.target.value;
}
function submit(){
    this.state.players.push('Daisy');
    this.state.players.push('Peach');
  if(this.playerThree!=undefined){
    this.state.players.push(this.playerThree);
  }
  if(this.playerFour!=undefined){
    this.state.players.push(this.playerFour);
  }
  if(this.playerFive!=undefined){
    this.state.players.push(this.playerFive);
  }
  if(this.playerSix!=undefined){
    this.state.players.push(this.playerSix);
  }
  this.setState({submit:true})
}
@observer
export default class Layout extends React.Component {
  constructor(){
    super();
    this.playerOne;
    this.playerTwo;
    this.playerThree;
    this.playerFour;
    this.playerFive;
    this.playerSix;
    console.log(this.playerSix);
    this.state = {
      players : [],
      submit: false
    }
  }
    render() {
      let game;
      if (this.state.submit){
        game=<Game players={this.state.players}/>;
      }
      let form;
      if (!this.state.submit){
        form=<Form>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerOneName.bind(this)}/>
        </Form.Group>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerTwoName.bind(this)}/>
        </Form.Group>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerThreeName.bind(this)}/>
        </Form.Group>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerFourName.bind(this)}/>
        </Form.Group>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerFiveName.bind(this)}/>
        </Form.Group>
        <Form.Group controlId="test">
          <Form.Control type="text" placeholder="Normal text" onChange={addPlayerSixName.bind(this)}/>
        </Form.Group>
          <Button variant="primary" type="submit" onClick={submit.bind(this)}>
            Submit
          </Button>
        </Form>;
      }

        return (
          <div>
          {form}
          {game}
          </div>
        );
    }
}
