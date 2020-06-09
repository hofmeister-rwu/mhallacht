import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Game from "../components/Game"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CardStore from "../stores/cardStore"
import AlertModal from "../components/AlertModal"
import RuleModal from "../components/RuleModal"
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
function addPlayerName(e){
  let name = e.target.value;
  let index = e.target.name;
  if(this.state.players[index]!=undefined){
    const newPlayers = [...this.state.players];
    newPlayers[index] = name;
    this.setState({ players:newPlayers });
  }else{
    this.setState(state => {
        const players = state.players.concat(name);
        return {
          players
        };
      });
  }
}
function submit(){
  let noDoubles = true;
  for (let i = 0; i < this.state.players.length; i++) {
    for (let j = 0; j < this.state.players.length; j++) {
      let str1 = this.state.players[i];
      let str2 = this.state.players[j];
      if(str1==str2 && i!=j){
        noDoubles = false;
      }
    }
  }
  console.log(noDoubles);
  if(noDoubles==true){
    this.setState({submit:"new"});
  }else{
    this.setState({warningshow:true});
  }
}
function load(){
  this.setState({submit:"load"});
}
function closeModal(){
  this.setState({warningshow:false});
}
@observer
export default class Layout extends React.Component {
  constructor(){
    super();
    this.state = {
      numberofPlayers : 2,
      players : [],
      submit: false,
      warningshow:false,
      ruleshow:false,
    }
      CardStore.fetchSavings();
  }
    render() {
      //console.log(this.state.players);
      //import saved Game from Store/Database
      var {playersFromServer} = CardStore;
      var {middleFromServer} = CardStore;
      var {usedFromServer} = CardStore;
      var {round} = CardStore;
      var playerArray;
      var middleArray;
      var usedArray;
      var roundFromServer;
      if(playersFromServer!=undefined){
        playerArray = [...playersFromServer];
      }
      if(middleFromServer!=undefined){
        middleArray = [...middleFromServer];
      }
      if(usedFromServer!=undefined){
        usedArray = [...usedFromServer];
      }
      if(round!=undefined){
        roundFromServer=round.value;
      }

      let game;
      if (this.state.submit=="new"){
        game=<Game players={this.state.players} submit={this.state.submit} round={0} activePlayerIndex={0}/>;
      }else if(this.state.submit =="load"){
        var activePlayer =0;
        for (var i = 0; i < playerArray.length; i++) {
          if(playerArray[i].activePlayer==true){
            activePlayer=i;
          }
        }
        game = <Game playerArray={playerArray} middleArray={middleArray} usedArray={usedArray} submit={this.state.submit} round={roundFromServer} activePlayerIndex={activePlayer}/>
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
          form.push(
          <Form.Group key={"NameofPlayer".concat(i+1)}>
          <Form.Control type="text" name={i} placeholder={"Spieler "+(i+1)} onBlur={addPlayerName.bind(this)}/>
          </Form.Group>);
        }
        console.log(this.state.players.length);
        if(this.state.players.length>1){
          form.push(<Button key="New" variant="primary" type="submit" onClick={submit.bind(this)}>
          Neues Spiel
          </Button>)
        }
        if(playerArray.length>0){
          form.push(<Button key="load" variant="warning" type="submit" onClick={load.bind(this)}>
          Spiel laden
          </Button>);
        }
        form.push(<Button className="z-index-100" onClick={() => {this.setState({ruleshow:true})}}>Regeln</Button>);
      }

        return (
          <div>
          <AlertModal
            show={this.state.warningshow}
            onHide={closeModal.bind(this)}
            alert="Jeder Name darf nur einmal vorkommen"
          />
          <RuleModal
            show={this.state.ruleshow}
            onHide={()=>{this.setState({ruleshow:false})}}
          />
          {form}
          {game}
          </div>
        );
    }
}
