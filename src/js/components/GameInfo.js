import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import GameStore from "../stores/gameStore"
import TooltipButton from "../components/TooltipButton"
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class GameInfo extends React.Component {

  constructor(props){
    super(props);
  }
    render() {
      //Only Show Info once Game has really started
      let gameInfo = <div class="game-info">Schau deine Karten an, {this.props.gameBoard.players[this.props.activePlayerIndex].playerName}
                      <div class="top-buttons">
                        <TooltipButton clickFunction ={GameStore.save} text="Speichern" icon="save"/>
                        <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                        </div>
                    </div>;

      if(GameStore.round>0 && !GameStore.end){
        let endAlert="";
        let gottheitAlert="";
        if(GameStore.endPlayer != ""){
            let tilEnd = GameStore.endPlayer - GameStore.activePlayerIndex +1;
            console.log("EndPlayerIndex: " + GameStore.endPlayer);
            console.log("Endplayer-ActivePlayer:" +tilEnd);
            console.log("ActivePlayr: " + GameStore.activePlayerIndex);
            if(tilEnd <= 0){
                tilEnd = GameStore.activePlayerIndex + tilEnd +1;
            }
            console.log("ActivePlayer+TilEnd: " + tilEnd);
            endAlert = " Noch " + tilEnd + " Züge bis zur Wertung";
        }

        if(GameStore.gottheitRound !=""){
          let gottheitIndex;
          for (let i = 0; i < GameStore.gameBoard.players.length; i++) {
            if(GameStore.gameBoard.players[i].playerRole=="gottheit"){
              gottheitIndex=i;
            }
          }
          if(gottheitIndex != GameStore.activePlayerIndex){
            let tilGottheit = gottheitIndex - GameStore.props.activePlayerIndex;
            if(tilGottheit <= 0){
                tilGottheit = GameStore.activePlayerIndex + tilGottheit;
            }
            gottheitAlert = " Noch " + tilGottheit + " Züge bis zum Kartentausch";
          }
        }

        gameInfo=<div class="game-info">Runde {this.props.round}
                    {endAlert} {gottheitAlert}
                    <div class="top-buttons">
                      <TooltipButton clickFunction ={GameStore.save} text="Speichern" icon="save"/>
                      <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                    </div>
                  </div>

          }

        return (
          <div>
            {gameInfo}
            </div>
        );
    }
}
