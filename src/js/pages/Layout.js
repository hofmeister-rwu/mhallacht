import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Game from "../components/Game"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CardStore from "../stores/cardStore"
import GameStore from "../stores/gameStore"
import AlertModal from "../components/AlertModal"
import RuleModal from "../components/RuleModal"
import TooltipButton from "../components/TooltipButton"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


function changePlayerNumber(value){
  this.setState({numberofPlayers:value});
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

function firstTime(){
  GameStore.setAlert("Brauchst du ein kurzes Tutorial?");
  GameStore.setModalClose(()=>{GameStore.closeModal();this.submit(true);});
  GameStore.setDismiss(()=>{ GameStore.closeModal();this.submit(false);});
  GameStore.setWarningShow(true);
}
function submit(first){
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
  if(noDoubles==true){
    this.setState({submit:"new", firstTime:first});
  }else{
    GameStore.setAlert("Jeder Name darf nur einmal vorkommen");
    GameStore.setWarningShow(true);
    GameStore.setModalClose(GameStore.closeModal);
  }
}
function load(){
  this.setState({submit:"load"});
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
      firstTime:true,
    }
      CardStore.fetchSavings();
      this.submit = submit.bind(this);
  }
    render() {
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
        game=<Game players={this.state.players} submit={this.state.submit} round={0} activePlayerIndex={0} firstTime={this.state.firstTime}/>;
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
              <label class="mr-3">Spieleranzahl:  </label>
              <Form.Check custom inline label="2" name="playerNumber" type='radio' id={`inline-radio-2`} onClick={changePlayerNumber.bind(this,2)}/>
              <Form.Check custom inline label="3" name="playerNumber" type='radio' id={`inline-radio-3`} onClick={changePlayerNumber.bind(this,3)}/>
              <Form.Check custom inline label="4" name="playerNumber" type='radio' id={`inline-radio-4`} onClick={changePlayerNumber.bind(this,4)}/>
              <Form.Check custom inline label="5" name="playerNumber" type='radio' id={`inline-radio-5`} onClick={changePlayerNumber.bind(this,5)}/>
              <Form.Check custom inline label="6" name="playerNumber" type='radio' id={`inline-radio-6`} onClick={changePlayerNumber.bind(this,6)}/>
            </div>
          </Form>
        );
        for (var i = 0; i < this.state.numberofPlayers; i++) {
          form.push(
          <Form.Group key={"NameofPlayer".concat(i+1)}>
          <Form.Control type="text" name={i} placeholder={"Spieler "+(i+1)} onBlur={addPlayerName.bind(this)}/>
          </Form.Group>);
        }
        if(this.state.players.length>1){
          form.push(<TooltipButton key="new" clickFunction ={firstTime.bind(this)} type="submit" text="Neues Spiel starten" icon="new"/>)
        }
        if(playerArray.length>0){
          form.push(<TooltipButton key="load" type="submit" clickFunction ={load.bind(this)} text="Spiel laden" icon="load"/>);
        }
        form.push(<TooltipButton key="rule" type="submit" clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>);
      }

        return (
          <div>
          <AlertModal/>
          <RuleModal/>
          <div class="form-class">
            <div>
            {form}
            </div>
          </div>
          {game}
          </div>
        );
    }
}
