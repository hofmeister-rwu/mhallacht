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

      //only show GameButtons after the unofficial 0 Round
      if(GameStore.round > 0){

        // Role WANDERER
        if(GameStore.playerCardClick == CardStore.selectWanderCard){
          let disabl = true;
          if(Object.values(CardStore.wanderCards).length == GameStore.gameBoard.players.length){
            disabl=false;
          }
          useRoleButton = <TooltipButton jumping={!disabl} clickFunction ={GameStore.cardsToLeft} text="Karten nach Links geben" icon="swap"/>
        }

        //Role KOBOLD
        if(GameStore.koboldSelect.playerName != undefined && CardStore.koboldVictim.playerName == undefined ){
          useRoleButton = <TooltipButton jumping={true} clickFunction ={GameStore.setKoboldVictim.bind(this,GameStore.koboldSelect)} text="Karten des ausgewählten Spielers umdrehen" icon="new"/>
        }

        //Role PREDIGER
        if(CardStore.predigerVictim != {} && CardStore.predigerCards.length>=2 && GameStore.playerClick!="" && !GameStore.predigershow){
          useRoleButton = <TooltipButton jumping={true} clickFunction ={()=>{GameStore.setPredigerShow(true)}} text="Spieler und Karten auswählen" icon="new"/>
        }

        //Role MITLÄUFER
        if(GameStore.gameBoard.players[GameStore.activePlayerIndex].playerRole == "mitlaeufer" && GameStore.mitlaeuferChosen != undefined){
            useRoleButton = <TooltipButton jumping={true} clickFunction ={()=>{ GameStore.setMitlaeuferUsed(true); GameStore.useRole(GameStore.mitlaeuferChosen.playerRole); GameStore.setMitlaeuferChosen(undefined)}} text="Diese Rolle einsetzen" icon="new"/>
        }

          //Only Show GameButtons if Game isn't over yet
          if(!GameStore.end){

            //if there's no card already drawn and there hasn't been a draw in this turn yet and there is no role active, show Draw Button and maybe UsedButton
            if(stackCard==undefined && GameStore.drawn==0 && GameStore.playerCardClick==""){

              //if the active Player has the role SCHARLATAN, the drawButton needs to call covertDraw instead of draw
              if(GameStore.gameBoard.players[GameStore.activePlayerIndex].playerRole!="scharlatan"){
                drawButton =<TooltipButton clickFunction ={GameStore.draw} text="Ziehe eine Karte" icon="draw"/>
              }else{

                  drawButton =<TooltipButton clickFunction ={GameStore.covertDraw} text="Ziehe eine Karte" icon="draw"/>
              }
              //if there is a card on the used Stack and the card is not an action card, show UsedButton
              if(GameStore.gameBoard.usedCards[0]!=undefined && !isNaN(parseInt(GameStore.gameBoard.usedCards[0].value))){
                let jumping = false;
                if(chosenCard!=undefined && GameStore.round <= 3){
                  jumping = true;
                }
                usedButton =<TooltipButton jumping={jumping} clickFunction ={GameStore.swapUsedCard.bind(this,chosenCard)} text="Tausche mit der ersten Karte vom Ablagestapel" icon="used"/>
              }

            //if the active Player has the role Abenteurer he can draw a second time
            }else if(stackCard == undefined && GameStore.drawn < 2 && GameStore.gameBoard.players[GameStore.activePlayerIndex].playerRole=="abenteurer"){

                drawButton =<TooltipButton clickFunction ={GameStore.draw} text="Ziehe eine Karte" icon="draw"/>

            //show Endturn button if draw has been made
            }else{
              throwButton =<TooltipButton clickFunction ={GameStore.endTurn} text="Beende deinen Zug" icon="end-turn"/>
            }

            //if the first Used Card is the current Stackcard, the usedButton is active too (needed for role ALTER MANN)
            if(GameStore.gameBoard.usedCards[0]!=undefined && GameStore.gameBoard.usedCards[0]==CardStore.stackCard && !isNaN(parseInt(GameStore.gameBoard.usedCards[0].value))){
              let jumping = false;
              if(chosenCard!=undefined && GameStore.round <= 3){
                jumping = true;
              }
              usedButton =<TooltipButton jumping={jumping} clickFunction ={GameStore.swapUsedCard.bind(this,chosenCard)} text="Tausche mit der ersten Karte vom Ablagestapel" icon="used"/>
            }
          }

          //if the stackCard IS defined and the game isn't over yet, show throw and action buttons
          if(stackCard!=undefined && !GameStore.end){

            //if the current StackCard is the first card from middle stack, throw that away on ThrowButton
            if(GameStore.gameBoard.cardsInMiddle[0]==stackCard){
              throwButton =<TooltipButton clickFunction ={GameStore.throwCards} text="Gezogene Karte wegwerfen" icon="throw"/>
            }
              //if the current StackCard is the first card from usedCards, and its the circleUsedCard, the role ALTER MANN is active, so the throw Button lets you circle through the used Cards
            else if(GameStore.gameBoard.usedCards[0]==stackCard && GameStore.gameBoard.usedCards[0]==circleUsedCard){
              throwButton =<TooltipButton clickFunction ={GameStore.circleBack} text="Gezogene Karte wegwerfen" icon="throw"/>
            }else{
              //if none of these conditions are correct, the throw button should simply always end the turn
              throwButton =<TooltipButton clickFunction ={GameStore.endTurn} text="Beende deinen Zug" icon="end-turn"/>
            }

            //Only show SwapStackButton if the Card you've drawn is not an ActionCard
            if(!isNaN(parseInt(stackCard.value)) && GameStore.gameBoard.cardsInMiddle[0]==stackCard){
              let jumping = false;
              if(chosenCard!=undefined && GameStore.round <= 3 ){
                jumping = true;
              }
              actionButton =<TooltipButton jumping={jumping} clickFunction ={GameStore.swapStackCard.bind(this,chosenCard)} text="Tausch mit der ersten Karte vom Stapel" icon="swap"/>
            }

            //Only show SwapPlayerButton if the Card you've drawn is a Swap Card
            if(stackCard.value=="swap"){
              let jumping = false;
              if(chosenCard!=undefined && enemyCard !=undefined && GameStore.round <= 3){
                jumping = true;
              }
                actionButton =<TooltipButton jumping={jumping} clickFunction ={GameStore.swapPlayerCard.bind(this,chosenCard,enemyCard)} text="Tausch mit der Karte deines Gegners" icon="swap"/>
            }

            //Only Show ShowButton if the card you've drawn is a show Card
            if(stackCard.value=="show"){
              let jumping = false;
              if(chosenCard!=undefined && CardStore.showCard==undefined && GameStore.round <= 3){
                jumping = true;
              }
              actionButton =<TooltipButton jumping={jumping} clickFunction ={GameStore.showCardModal.bind(this,CardStore.chosenCard)} text="Decke eine deiner Karten auf" icon="show"/>
            }


            if(stackCard.value=="skip"){
                actionButton =<TooltipButton clickFunction ={GameStore.skipNext} text="Nächsten Spieler überspringen" icon="skip"/>
            }

            if(stackCard.value=="double"){
              actionButton =<TooltipButton clickFunction ={GameStore.drawDouble} text="Doppelt ziehen" icon="double"/>
            }
            if(stackCard.value=="role-swap"){
              actionButton =<TooltipButton clickFunction ={GameStore.drawRole} text="Ziehe eine neue Rolle" icon="role-swap"/>
            }
            //Only show EndGameButton if it hasn't already been pressed
            if (GameStore.endingRound=="" && stackCard.value=="end"){
                  endGameButton =<TooltipButton clickFunction ={GameStore.setEndGame} text="Spiel in einer Runde beenden" icon="end"/>
            }


      }
      }
      //if round is not 0 and the game hasnt ended yet, show the Button to show the first Cards
      else if(!GameStore.end){
        let disabled = true;
        //disable the button if there are currently cards that are shown
        if(CardStore.showCard == undefined){
         disabled = false;
        }
        actionButton =<TooltipButton disabled={disabled}
        clickFunction ={GameStore.showCardModal.bind(this,GameStore.gameBoard.players[GameStore.activePlayerIndex].playerCards[0], GameStore.gameBoard.players[GameStore.activePlayerIndex].playerCards[GameStore.gameBoard.players[GameStore.activePlayerIndex].playerCards.length-1])}
        text="Anfangskarten anzeigen" icon="show"/>

      }


        return (
              <div class="button-row mx-auto">
                {drawButton}
                {throwButton}
                {usedButton}
                {actionButton}
                {endGameButton}
                {useRoleButton}
              </div>
        );
    }
}
