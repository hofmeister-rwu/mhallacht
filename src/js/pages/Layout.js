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

function changePlayerNumber(value){
  this.setState({numberofPlayers:value});
  console.log(this.state.numberofPlayers);
}
function addPlayer1Name(e){
  console.log(e.target.value);
    this.playerOne = e.target.value;
}
function addPlayer2Name(e){
  console.log(e.target.value);
  this.playerTwo = e.target.value;
}
function addPlayer3Name(e){
  console.log(e.target.value);
  this.playerThree = e.target.value;
}
function addPlayer4Name(e){
  console.log(e.target.value);
  this.playerFour = e.target.value;
}
function addPlayer5Name(e){
  console.log(e.target.value);
  this.playerFive = e.target.value;
}
function addPlayer6Name(e){
  console.log(e.target.value);
  this.playerSix= e.target.value;
}
function submit(){
  if(this.playerOne!=undefined){
    this.state.players.push(this.playerOne);
  }
  if(this.playerTwo!=undefined){
      this.state.players.push(this.playerTwo);
    }
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
      numberofPlayers : 1,
      players : [],
      submit: false
    }
  }
    render() {
      let game;
      if (this.state.submit){
        game=<Game players={this.state.players}/>;
      }
      let form = [];
      if(!this.state.submit){
        for (var i = 0; i < this.state.numberofPlayers; i++) {
          var changeFunction;
          switch (i+1){
            case 1:
             changeFunction = addPlayer1Name.bind(this);
             break;
            case 2:
              changeFunction = addPlayer2Name.bind(this);
              break;
            case 3:
              changeFunction = addPlayer3Name.bind(this);
              break;
            case 4:
              changeFunction = addPlayer4Name.bind(this);
              break;
            case 5:
              changeFunction = addPlayer5Name.bind(this);
              break;
            case 6:
              changeFunction = addPlayer6Name.bind(this);
              break;
          }
          form.push(
          <Form.Group>
          <Form.Control type="text" placeholder={"Player "+(i+1)} onChange={changeFunction}/>
          </Form.Group>);
          console.log(form);
        }
        form.push(<Button variant="primary" type="submit" onClick={submit.bind(this)}>
        Submit
        </Button>);
      }

        return (
          <div>
          <Form>
              <div className="mb-3">
                <Form.Check inline label="2" name="playerNumber" type='radio' id={`inline-radio-2`} onClick={changePlayerNumber.bind(this,2)}/>
                <Form.Check inline label="3" name="playerNumber" type='radio' id={`inline-radio-3`} onClick={changePlayerNumber.bind(this,3)}/>
                <Form.Check inline label="4" name="playerNumber" type='radio' id={`inline-radio-4`} onClick={changePlayerNumber.bind(this,4)}/>
                <Form.Check inline label="5" name="playerNumber" type='radio' id={`inline-radio-5`} onClick={changePlayerNumber.bind(this,5)}/>
                <Form.Check inline label="6" name="playerNumber" type='radio' id={`inline-radio-6`} onClick={changePlayerNumber.bind(this,6)}/>
              </div>
          </Form>
          {form}
          {game}
          </div>
        );
    }
}
