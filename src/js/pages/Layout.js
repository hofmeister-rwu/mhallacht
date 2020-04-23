import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Game from "../components/Game"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CardStore from "../stores/cardStore"
import { observable, action } from 'mobx';
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
    this.setState({playerOne : e.target.value});
}
function addPlayer2Name(e){
  console.log(e.target.value);
    this.setState({playerTwo : e.target.value});
}
function addPlayer3Name(e){
  console.log(e.target.value);
    this.setState({playerThree : e.target.value});
}
function addPlayer4Name(e){
  console.log(e.target.value);
    this.setState({playerFour : e.target.value});
}
function addPlayer5Name(e){
  console.log(e.target.value);
    this.setState({playerFive : e.target.value});
}
function addPlayer6Name(e){
  console.log(e.target.value);
    this.setState({playerSix : e.target.value});
}
function submit(){
  if(this.state.playerOne.length>0){
    this.state.players.push(this.state.playerOne);
  }
  if(this.state.playerTwo.length>0){
      this.state.players.push(this.state.playerTwo);
    }
  if(this.state.playerThree.length>0){
    this.state.players.push(this.state.playerThree);
  }
  if(this.state.playerFour.length>0){
    this.state.players.push(this.state.playerFour);
  }
  if(this.state.playerFive.length>0){
    this.state.players.push(this.state.playerFive);
  }
  if(this.state.playerSix.length>0){
    this.state.players.push(this.state.playerSix);
  }
  this.setState({submit:"new"})
}
function load(){
  this.setState({submit:"load"});
}
@observer
export default class Layout extends React.Component {
  constructor(){
    super();
    console.log(this.playerSix);
    this.state = {
      numberofPlayers : 2,
      players : [],
      submit: false,
      playerOne: "",
      playerTwo: "",
      playerThree: "",
      playerFour: "",
      playerFive:"",
      playerSix:"",
    }
      CardStore.fetchSavings();
  }
    render() {

      //import saved Game from Store/Database
      var {playersFromServer} = CardStore;
      var {middleFromServer} = CardStore;
      var {usedFromServer} = CardStore;
      var playerArray;
      var middleArray;
      var usedArray;
      if(playersFromServer!=undefined){
        playerArray = [...playersFromServer];
      }
      if(middleFromServer!=undefined){
        middleArray = [...middleFromServer];
      }
      if(usedFromServer!=undefined){
        usedArray = [...usedFromServer];
      }
      // console.log(playerArray);
      // console.log(middleArray);
      // console.log(usedArray);

      let game;
      if (this.state.submit=="new"){
        game=<Game players={this.state.players} submit={this.state.submit} round={0} activePlayerIndex={0}/>;
      }else if(this.state.submit =="load"){
        game = <Game playerArray={playerArray} middleArray={middleArray} usedArray={usedArray} submit={this.state.submit} round={2} activePlayerIndex={1}/>
      }
      let form = [];
      if(!this.state.submit){
        form.push(
          <Form key="PlayerNumber">
            <div className="mb-3">
              <Form.Check inline label="2" name="playerNumber" type='radio' id={`inline-radio-2`} onClick={changePlayerNumber.bind(this,2)}/>
              <Form.Check inline label="3" name="playerNumber" type='radio' id={`inline-radio-3`} onClick={changePlayerNumber.bind(this,3)}/>
              <Form.Check inline label="4" name="playerNumber" type='radio' id={`inline-radio-4`} onClick={changePlayerNumber.bind(this,4)}/>
              <Form.Check inline label="5" name="playerNumber" type='radio' id={`inline-radio-5`} onClick={changePlayerNumber.bind(this,5)}/>
              <Form.Check inline label="6" name="playerNumber" type='radio' id={`inline-radio-6`} onClick={changePlayerNumber.bind(this,6)}/>
            </div>
          </Form>
        );
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
          <Form.Group key={"NameofPlayer".concat(i+1)}>
          <Form.Control type="text" placeholder={"Player "+(i+1)} onChange={changeFunction}/>
          </Form.Group>);
        }
        if(this.state.playerOne.length > 0 && this.state.playerTwo.length >0){
          form.push(<Button key="New" variant="primary" type="submit" onClick={submit.bind(this)}>
          New Game
          </Button>)
        }
        if(playerArray.length>0){
          form.push(<Button key="load" variant="warning" type="submit" onClick={load.bind(this)}>
          Load
          </Button>);
        }
      }

        return (
          <div>

          {form}
          {game}
          </div>
        );
    }
}
