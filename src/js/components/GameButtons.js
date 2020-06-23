import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

import PlayerCards from "../components/PlayerCards"
import PredigerModal from "../components/PredigerModal"
import RuleModal from "../components/RuleModal"
import StackCards from "../components/StackCards"
import SaveModal from "../components/SaveModal"
import AlertModal from "../components/AlertModal"
import CardStore from "../stores/cardStore"
import GameStore from "../stores/gameStore"
import TooltipButton from "../components/TooltipButton"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


@observer
export default class GameButtons extends React.Component {

  constructor(props){
    super(props);
  }
    render() {

     //Load Cards from the CardStore
     const {chosenCard} = CardStore;
     const {enemyCard} = CardStore;
     const {stackCard} = CardStore;
     const {showCard} = CardStore;
     const {circleUsedCard} = CardStore;
     let {doubleCards} = CardStore;
     let {wanderCards} = CardStore;
     const doubleCardsfromStore = [...doubleCards];
     const {koboldVictim} = CardStore;
     let {predigerCards} = CardStore;
     const predigerCardsFromStore = [...predigerCards];
     const {predigerVictim} = CardStore;

      let drawButton;
      let usedButton;
      let throwButton;
      let actionButton;
      let endGameButton;
      let useRoleButton;
      if(this.props.round > 0){

        if(this.props.playerCardClick == CardStore.selectWanderCard){
          let disabl = true;
          if(Object.values(CardStore.wanderCards).length == this.props.gameBoard.players.length){
            disabl=false;
          }
          useRoleButton = <TooltipButton clickFunction ={GameStore.cardsToLeft} text="Karten nach Links geben" icon="swap"/>
        }

        if(this.props.koboldSelect.playerName != undefined && CardStore.koboldVictim.playerName == undefined ){
          useRoleButton = <TooltipButton clickFunction ={GameStore.setKoboldVictim.bind(this,this.props.koboldSelect)} text="Karten des ausgewählten Spielers umdrehen" icon="new"/>
        }

        if(CardStore.predigerVictim != {} && CardStore.predigerCards.length>=2 && this.state.playerClick!=""){
          useRoleButton = <TooltipButton clickFunction ={() => {this.props.bindThis.setState({predigershow:true})}} text="Spieler und Karten auswählen" icon="new"/>
        }

          //Only Show DrawButton if there is no card already drawn and Game isn't over

          if(stackCard==undefined && !this.props.end && this.props.drawn==0 && this.props.playerCardClick==""){
            //drawButton= <Button variant="purple" onClick={draw}>Ziehen</Button>;
            drawButton =<TooltipButton clickFunction ={GameStore.draw} text="Ziehe eine Karte" icon="draw"/>

            if(this.props.gameBoard.usedCards[0]!=undefined && !isNaN(parseInt(this.props.gameBoard.usedCards[0].value,10))){

              usedButton =<TooltipButton clickFunction ={GameStore.swapUsedCard.bind(this,chosenCard)} text="Tausche mit der ersten Karte vom Ablagestapel" icon="used"/>
            }

          }else if(stackCard == undefined && this.props.drawn < 2 && this.props.gameBoard.players[this.props.activePlayerIndex].playerRole=="abenteurer"){

              drawButton =<TooltipButton clickFunction ={GameStore.draw} text="Ziehe eine Karte" icon="draw"/>

          }else{

            throwButton =<TooltipButton clickFunction ={GameStore.endTurn} text="Beende deinen Zug" icon="end-turn"/>
          }

          if(stackCard!=undefined && !this.props.end){
            if(this.props.gameBoard.cardsInMiddle[0]==stackCard){
              throwButton =<TooltipButton clickFunction ={GameStore.throwCards} text="Gezogene Karte wegwerfen" icon="throw"/>
            }else if(this.props.gameBoard.usedCards[0]==stackCard && this.props.gameBoard.usedCards[0]==circleUsedCard){
              throwButton =<TooltipButton clickFunction ={GameStore.circleBack} text="Gezogene Karte wegwerfen" icon="throw"/>
            }else{
              throwButton =<TooltipButton clickFunction ={GameStore.endTurn} text="Beende deinen Zug" icon="end-turn"/>
            }

            //Only show SwapStackButton if the Card you've drawn is not an ActionCard
            if(!isNaN(parseInt(stackCard.value))){
              actionButton =<TooltipButton clickFunction ={GameStore.swapStackCard.bind(this,chosenCard)} text="Tausch mit der ersten Karte vom Stapel" icon="swap"/>
            }

            //Only show SwapPlayerButton if the Card you've drawn is a Swap Card
            if(stackCard.value=="swap"){
                actionButton =<TooltipButton clickFunction ={GameStore.swapPlayerCard.bind(this,chosenCard,enemyCard)} text="Tausch mit der Karte deines Gegners" icon="swap"/>
            }

            //Only Show ShowButton if the card you've drawn is a show Card
            if(stackCard.value=="show"){
              actionButton =<TooltipButton clickFunction ={GameStore.showCardModal.bind(this,CardStore.chosenCard)} text="Decke eine deiner Karten auf" icon="show"/>
            }


            if(stackCard.value=="skip"){
                actionButton =<TooltipButton clickFunction ={GameStore.skipNext} text="Nächsten Spieler überspringen" icon="skip"/>
            }

            if(stackCard.value=="double"){
              actionButton =<TooltipButton clickFunction ={GameStore.drawDouble} text="Doppelt ziehen" icon="double"/>
            }
            //Only show EndGameButton if it hasn't already been pressed
            if (this.props.endRound=="" && stackCard.value=="end"){
                  endGameButton =<TooltipButton clickFunction ={GameStore.setEndGame} text="Spiel in einer Runde beenden" icon="end"/>
            }


      }
      }else if(!this.props.end){
        let disabled = true;
        if(CardStore.showCard == undefined){
         disabled = false;
        }
        actionButton =<TooltipButton disabled={disabled}
        clickFunction ={GameStore.showCardModal.bind(this,this.props.gameBoard.players[this.props.activePlayerIndex].playerCards[0], this.props.gameBoard.players[this.props.activePlayerIndex].playerCards[this.props.gameBoard.players[this.props.activePlayerIndex].playerCards.length-1])}
        text="Anfangskarten anzeigen" icon="show"/>

      }


        return (
              <div class="button-row mx-auto">
                {drawButton}
                {usedButton}
                {throwButton}
                {actionButton}
                {endGameButton}
                {useRoleButton}
              </div>
        );
    }
}
