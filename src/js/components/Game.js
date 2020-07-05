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
import GameButtons from "../components/GameButtons"
import GameInfo from "../components/GameInfo"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


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

    CardStore.fetchSavings();
  }
    render() {

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

     //console.log(gameBoard);
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
     //Load PlayerCards into {items}
     console.log(gameBoard);
      const playerCards = gameBoard.players.map((item, key) =>{

          let cardClick;
          let roleFunction;
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
          //OnClick of Cards is only defined if Game ins't over yet
          if(!end){
            //onClick stores the card either in chosenCard or enemyCard depending if the Card belongs to the active Player or not
              if(item==gameBoard.players[activePlayerIndex]){
                cardClick= CardStore.selectCard;
                deckClass+= " active"
                roleFunction = GameStore.useRole.bind(this,item.playerRole);
              }else{
                cardClick=CardStore.selectEnemyCard;
              }
              //console.log(GameStore.koboldSelect);
              if(item == koboldSelect || item == CardStore.predigerVictim || item == GameStore.mitlaeuferChosen){
                deckClass += " bg-primary";
              }
          }
          if(playerCardClick!=""){
            cardClick=playerCardClick;
          }

          let playerOnClick ="";
          if(playerClick!=""){
            playerOnClick = playerClick.bind(this,item);
          }

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

      let endClass = "end-"+end;

      if(gameBoard.cardsInMiddle.length <=0){
        GameStore.mixCards();
      }


        return (
            <div class={endClass}>
                <GameInfo/>
                <AlertModal/>
                <SaveModal/>
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
