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
import TutorialModal from "../components/TutorialModal"
import CardStore from "../stores/cardStore"
import GameStore from "../stores/gameStore"
import TooltipButton from "../components/TooltipButton"
import GameButtons from "../components/GameButtons"
import GameInfo from "../components/GameInfo"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"



@observer
export default class Game extends React.Component {

  constructor(props){
    super(props);
      switch (props.submit){
        case "new":
          GameStore.gameBoard.start(props.players);
          break;
        case "load":
          GameStore.gameBoard.load(props.playerArray, props.middleArray, props.usedArray);
          break;
        default:
          GameStore.gameBoard.start(props.players);
          break;
      }
        GameStore.setRound(this.props.round);
        GameStore.setActive(this.props.activePlayerIndex);

      if(this.props.firstTime == true){
        GameStore.setTutorialShow(true);
      }

    CardStore.fetchSavings();
  }
    render() {

      // Get all Info from GameStore, so every Change triggers Rerender
      const {gameBoard} = GameStore;
      const {round} = GameStore;
      const {activePlayerIndex} = GameStore;
      const {alert} = GameStore;
      const {endingRound} = GameStore;
      const {endPlayer} = GameStore;
      const {end} = GameStore;
      const {drawn} = GameStore;
      const {actionDrawn} = GameStore;
      const {koboldEndIndex} = GameStore;
      const {koboldEndRound} = GameStore;
      const {koboldSelect} = GameStore;
      const {gottheitRound} = GameStore;
      const {direction} = GameStore;
      const {warningshow} = GameStore;
      const {saveshow} = GameStore;
      const {modalClose} = GameStore;
      const {playerCardClick} = GameStore;
      const {playerClick} = GameStore;
      const {dismiss} = GameStore;
      const {predigershow} = GameStore;
      const {ruleshow} = GameStore;

     var {playersFromServer} = CardStore;
     var savedPlayers;
     if(playersFromServer!=undefined){
       savedPlayers = [...playersFromServer];
     }
     var {middleFromServer} = CardStore;
     var savedMiddle;
     if(middleFromServer!=undefined){
       savedMiddle = [...middleFromServer];
     }
     var {usedFromServer} = CardStore;
     var savedUsed;
     if(usedFromServer!=undefined){
       savedUsed = [...usedFromServer];
     }

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


     console.log(gameBoard);

     //Call PlayerCards Component for every player
      const playerCards = gameBoard.players.map((item, key) =>{

          // Get Position of Player Relative to active Player (active player needs class player-1, the next player player-2 and so on)
          let counter = 0;
          for (let i = 0; i < gameBoard.players.length; i++) {
            if(gameBoard.players[i]==item){
              //counter = i+1;
              counter = (i-activePlayerIndex)+1;
              if(counter<=0){
                counter+=gameBoard.players.length;
              }
            }
          }
          let deckClass ="deckContainer player-"+counter;


          let cardClick;
          let roleFunction;

          //OnClick of Cards is only defined if Game ins't over yet
          if(!end){

            //onClick stores the card either in chosenCard or enemyCard depending if the Card belongs to the active Player or not
              if(item==gameBoard.players[activePlayerIndex]){
                cardClick= CardStore.selectCard;
                deckClass+= " active"

                //role can only be used if player is active in the moment
                roleFunction = GameStore.useRole.bind(this,item.playerRole);
              }else{
                cardClick=CardStore.selectEnemyCard;
              }

              //Style Players that were selected by a Role
              if(item == koboldSelect || item == CardStore.predigerVictim || item == GameStore.mitlaeuferChosen){
                deckClass += " bg-primary";
              }
          }

          //If GameStore.playerCardClick is defined it overwrites the ususal cardClick (if a role disrupts the usual GameFlow)
          if(playerCardClick!=""){
            cardClick=playerCardClick;
          }

          //If GameStore.playerClick is defined, something happens if you click on the player, else the attribute stays empty
          let playerOnClick ="";
          if(playerClick!=""){
            playerOnClick = playerClick.bind(this,item);
          }

          // If the second Phase of Preidger is active (predigerCards are still defined, but cards can't be chosen anymore) enemyClick is constrained to only PredigerCards
          let predigerSwap = false;
          if(CardStore.predigerVictim.playerCards != undefined && playerCardClick == "" && item != gameBoard.players[activePlayerIndex]){
            cardClick=()=>{};
            if(CardStore.predigerVictim == item){
              cardClick = cardClick=CardStore.selectEnemyCard;
            }
            predigerSwap=true;
          }

          return(<div key={item.playerName} class="player center" onClick={playerOnClick}>
            <PlayerCards player={item} cardClick={cardClick} deckClass={deckClass} end={end} roleCard={true} roleFunction={roleFunction} predigerSwap={predigerSwap}/>
            </div>);
      });

      //styling changes whether end is true or false
      let endClass = "end-"+end;

      //if the stack of new cards is empty, the cards from the used stack are reused
      if(gameBoard.cardsInMiddle.length <=0){
        GameStore.mixCards();
      }


        return (
            <div class={endClass}>
                <GameInfo/>
                <AlertModal/>
                <SaveModal/>
                <TutorialModal/>
                <PredigerModal/>
              <div class="test">
              <div class="stacks">
                <div class="row col-xl-4 col-6 mx-auto position-relative">
                  <StackCards heading={"Kartenstapel"} item={gameBoard.cardsInMiddle} stack={true} deleteFunction={GameStore.throwCardbyObject}/>
                  <StackCards heading={"Ablegestapel"} item={gameBoard.usedCards} stack={false}/>
                </div>
              </div>
              <div class="players">
                    {playerCards}
              </div>
              </div>
              <GameButtons
              />
            </div>
        );
    }
}
