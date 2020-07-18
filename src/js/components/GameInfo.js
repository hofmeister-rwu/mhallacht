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
      let infoClass = "game-info";
      let container = "";
      //different Styling for different number of players
      if(GameStore.gameBoard.players.length == 5){
        container="center";
        infoClass += " center-info";
      }
      if(GameStore.gameBoard.players.length == 6){
        infoClass += " small-info";
      }

      //in the first round, show who's turn it is to look at cards
      let gameInfo = <div class={infoClass}>Schau deine Karten an, {GameStore.gameBoard.players[GameStore.activePlayerIndex].playerName}
                      <div class="top-buttons">
                        <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                        </div>
                    </div>;


      //Show Round Info once Game has really started and the Game isnt over yet
      if(GameStore.round>0 && !GameStore.end){
        let endAlert="";
        let gottheitAlert="";

        //if the end of Game has been defined, count how many turns until the End and set an Alert for that.
        if(GameStore.endingRound != ""){
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
            default:
              tilEnd = GameStore.endPlayer - GameStore.activePlayerIndex +1;
              if(tilEnd <= 0){
                  //tilEnd = GameStore.activePlayerIndex + tilEnd +1;
                  tilEnd = GameStore.gameBoard.players.length + tilEnd;
              }
              break;
          }

          endAlert = " Noch " + tilEnd + " Züge bis zur Wertung";
        }


        //if the role GOTTHEIT has been used, count how many turns until all cards will be swapped and show an alert
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

        //<TooltipButton clickFunction ={GameStore.save} text="Speichern" icon="save"/>
        gameInfo=<div class={infoClass}>Runde {GameStore.round} <br/>
                    {endAlert} {gottheitAlert}
                    <div class="top-buttons">
                      <TooltipButton clickFunction ={GameStore.setRuleShow.bind(true)} text="Regeln" icon="rule"/>
                    </div>
                  </div>

          }else if(GameStore.end){
            //if Game has ended only show new Game Button 
            gameInfo=<div class={infoClass}>
                        Noch eine Runde spielen?
                        <div class="top-buttons">
                          <TooltipButton clickFunction ={GameStore.newGame} text="Neues Spiel" icon="load"/>
                        </div>
                      </div>
          }

        return (
          <div class={container}>
            {gameInfo}
          </div>
        );
    }
}
