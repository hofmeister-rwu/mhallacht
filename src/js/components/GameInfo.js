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
      let gameInfo = <div class="game-info">Schau deine Karten an, {GameStore.gameBoard.players[GameStore.activePlayerIndex].playerName}
                      <div class="top-buttons">
                        <TooltipButton clickFunction ={GameStore.save} text="Speichern" icon="save"/>
                        <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                        </div>
                    </div>;

      if(GameStore.round>0 && !GameStore.end){
        let endAlert="";
        let gottheitAlert="";
        if(GameStore.endPlayer != ""){
          let tilEnd;
          switch(GameStore.direction){
            case "left":
              tilEnd = GameStore.endPlayer - GameStore.activePlayerIndex +1;
              if(tilEnd <= 0){
                  //tilEnd = GameStore.activePlayerIndex + tilEnd +1;
                  tilEnd = GameStore.gameBoard.players.length + tilEnd;
              }
              break;
            case "right":
              tilEnd = GameStore.activePlayerIndex - GameStore.endPlayer +1;
              if(tilEnd <= 0){
                  tilEnd = GameStore.gameBoard.players.length + tilEnd;
              }
              break;
          }

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
            let tilGottheit;
            switch(GameStore.direction){
              case "left":
                tilGottheit = gottheitIndex - GameStore.activePlayerIndex;
                if(tilGottheit <= 0){
                    tilGottheit = GameStore.gameBoard.players.length + tilGottheit;
                }
                break;
              case "right":
                tilGottheit = GameStore.activePlayerIndex - gottheitIndex;
                if(tilGottheit <= 0){
                    tilGottheit = GameStore.gameBoard.players.length + tilGottheit;
                }
                break;
            }
            gottheitAlert = " Noch " + tilGottheit + " Züge bis zum Kartentausch";
          }
        }

        gameInfo=<div class="game-info">Runde {GameStore.round} <br/>
                    {endAlert} {gottheitAlert}
                    <div class="top-buttons">
                      <TooltipButton clickFunction ={GameStore.save} text="Speichern" icon="save"/>
                      <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                    </div>
                  </div>

          }else if(GameStore.end){
            gameInfo=<div class="game-info">
                        Noch eine Runde spielen?
                        <div class="top-buttons">
                          <TooltipButton clickFunction ={GameStore.newGame} text="Neues Spiel" icon="load"/>
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
