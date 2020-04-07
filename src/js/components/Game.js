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
import StackCards from "../components/StackCards"
import CardStore from "../stores/cardStore"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');


//Classes that make up the Board Game
class Card {
    constructor(value,id) {
        this.value = value;
        this.id= id;
    }
}class Deck {
    constructor() {
        this.cards = [];
    }
    createDeck() {
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9,10, "show", "swap", "show", "swap", "show", "swap"];
        let id =0;
        for (let j = 0; j < values.length; j++) {
          for (let i=0; i < 4; i++){
              this.cards.push(new Card(values[j],id));
              id++;
          }
        }
    }
    shuffleDeck() {
       let location1, location2, tmp;
       for (let i = 0; i < 1000; i++) {
           location1 = Math.floor((Math.random() * this.cards.length));
           location2 = Math.floor((Math.random() * this.cards.length));
           tmp = this.cards[location1];
           this.cards[location1] = this.cards[location2];
           this.cards[location2] = tmp;
        }
    }
}class Player {
    constructor(name) {
        this.playerName = name;
        this.playerCards = [];
        this.playerValue;
    }
}class Board {
    constructor() {
        this.cardsInMiddle = [];
        this.usedCards = [];
        this.players = [];
    }
    start(playerNames) {
        let d = new Deck();
        d.createDeck();
        d.shuffleDeck();
        for (var i = 0; i < playerNames.length; i++) {
          this.players.push(new Player(playerNames[i]));
          this.players[i].playerCards = d.cards.splice(i*4, 4);
        }
        this.cardsInMiddle=d.cards;
    }
}



//Draw the first Card of the Stack
function draw(){
    CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
}

//Throw a Card that the Player doesnt want on the used Cards Stack
function throwCards(){
  //if you dont want to use the StackCard throw it on the usedCards Stack
    let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
    this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
    this.endTurn();
}

//Swap a Card from the current player with the first Card from the Stack
function swapStackCard(chosenCard){
    //if a Card has been chosen, swap the first Card in the Stack with the chosenCard
    if(chosenCard!=undefined){
        var chosenCardIndex;
          for(let i = 0; i < this.gameBoard.players[this.state.activePlayerIndex].playerCards.length; i++){
            if(this.gameBoard.players[this.state.activePlayerIndex].playerCards[i]==chosenCard){
              chosenCardIndex=i;
            }
          }
        let playerCard = this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
        let stackCard = this.gameBoard.cardsInMiddle.splice(0,1);
        this.gameBoard.usedCards.splice(0,0,playerCard[0]);
        this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,0,stackCard[0]);
        this.endTurn();

    //if the chosenCard hasn't been defined yet, give out a warning
    }else{
      this.setState({alert:"Choose One of Your Cards to be Swapped by Clicking on it", warningshow:true})
    }
}


//Swap a Card from the active Player with a Card from another player
function swapPlayerCard(chosenCard,enemyCard){
  //if chosenCard and enemyCard are both defined
  if(chosenCard!=undefined&&enemyCard!=undefined){

    //getCardIndex of ChosenCard
    var chosenCardIndex;
      for(let i = 0; i < this.gameBoard.players[this.state.activePlayerIndex].playerCards.length; i++){
        if(this.gameBoard.players[this.state.activePlayerIndex].playerCards[i]==chosenCard){
          chosenCardIndex=i;
        }
      }

    //getCardIndex and PlayerIndex of enemyCard
    var enemyCardIndex;
    var enemyPlayerIndex;
    for(let j=0; j < this.gameBoard.players.length; j++){
      for(let i = 0; i < this.gameBoard.players[j].playerCards.length; i++){
        if(this.gameBoard.players[j].playerCards[i]==enemyCard){
          enemyCardIndex=i;
          enemyPlayerIndex=j;
        }
      }
    }
    //Delete chosenCard and enemyCard out of their normal places and store them in an array
    let playerCard = this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
    let otherCard = this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,1);

    //Insert chosenCard at place of enemyCard and Insert enemyCard inplace of chosenCard
    this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,0,otherCard[0]);
    this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,0,playerCard[0]);


    // put the StackCard on the UsedCard Staple and EndTUrn
    let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
    this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
    this.endTurn();

  //if one Card isn't chosen yet give out a warning
}else{
    if(chosenCard==undefined && enemyCard==undefined){
        this.setState({alert:"Choose One of Your Cards to be Swapped by Clicking on it. Choose One of Your Enemies' Cards to be Swapped by Clicking on it", warningshow:true})
    }
    if(chosenCard==undefined && enemyCard!=undefined){
        this.setState({alert:"Choose One of Your Cards to be Swapped by Clicking on it", warningshow:true})
    }
    if (enemyCard==undefined && chosenCard!=undefined){
          this.setState({alert:"Choose One of Your Enemies' Cards to be Swapped by Clicking on it", warningshow:true})
    }
  }
}

//Show one of the activePlayers Cards
function show(card){
  if(card!=undefined){

      //if the Card to Show is defined, show the Card Value for 2 seconds
      CardStore.selectShowCard(card);
      setTimeout(() => {this.endTurn();}, 2000);

      //after the Timer has run out, put the StackCard on the UsedCard Staple
      let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
      this.gameBoard.usedCards.splice(0,0,thrownCard[0]);

  //if no card is chosen give out a warning
  }else{
    this.setState({alert:"Choose A Card to Show, by Clicking on one of your Cards!", warningshow:true})
  }
}

//After the activePlayer has performed an action his Turn is over
function endTurn(){
  //if the EndGame has been defined, we check if the Game is over yet
    if(this.state.endRound!=""){
      this.checkEndGame();
    }
  //if theres a next player in the array it's his turn, so we unselect all Cards and count up the activePlayerIndex
    if(this.state.activePlayerIndex+1<this.gameBoard.players.length){
      this.setState({activePlayerIndex:this.state.activePlayerIndex+1,});
      CardStore.unselectCards();
    }else{
  //if theres no next player in the array a new Round begins and we start with the first player again
      this.endRound();
    }
}

//if all Players had their turn a new round beings
function endRound(){
    this.setState({round:this.state.round+1,});
    this.setState({activePlayerIndex:0});
    CardStore.unselectCards();
}

//if a player presses the EndGame Button, the point in time when the Game will end (one Round after the player pressed) is defined
function setEndGame(){
  if(this.state.endRound=="" && this.state.endPlayer==""){
    if(this.state.activePlayerIndex-1>=0){
      this.setState({endPlayer:this.state.activePlayerIndex-1});
      this.setState({endRound:this.state.round+1});
    }else{
      this.setState({endRound:this.state.round});
      this.setState({endPlayer:this.gameBoard.players.length-1});
    }
  }
}

//if the defined point when the game ends, has come, the results are posted
function checkEndGame(){
  if(this.state.round == this.state.endRound && this.state.activePlayerIndex == this.state.endPlayer){
    for(var i=0; i<this.gameBoard.players.length; i++){
        this.gameBoard.players[i].playerValue=0;
          for (var j = 0; j < this.gameBoard.players[i].playerCards.length; j++) {
            if(this.gameBoard.players[i].playerCards[j].value!="show" && this.gameBoard.players[i].playerCards[j].value!="swap"){
                this.gameBoard.players[i].playerValue += this.gameBoard.players[i].playerCards[j].value;
            }else{
              this.gameBoard.players[i].playerValue += 15;
            }
          }
    }
    var endPlayers=[...this.gameBoard.players];
    endPlayers.sort((a, b) => a.playerValue - b.playerValue);
    let counter = 0;
    const endList = endPlayers.map((player, key) =>{
        counter++;
        return(<div key={player.playerName}><Alert>#{counter}: {player.playerName} with {player.playerValue} </Alert></div>);
    });
    this.setState({alert:endList, warningshow:true, end:true})
  }
}

//ModalFunction
function handleModalClose(){
    this.setState({warningshow:false});
}


// durch die Annotation @observer
@observer
export default class Game extends React.Component {
  @observable gameBoard = new Board();

  constructor(props){
    super(props);
        this.gameBoard.start(props.players);
        this.state = {
          round:1,
          activePlayerIndex:0,
          alert:"",
          warningshow:false,
          endRound:"",
          endPlayer:"",
          end:false,
        }
    this.endRound=endRound.bind(this);
    this.endTurn=endTurn.bind(this);
    this.checkEndGame=checkEndGame.bind(this);
  }
    render() {
     console.log(this.gameBoard);
     console.log(this.state.endRound);
     console.log(this.state.endPlayer);
     //Load PlayerCards into {items}
      const playerCards = this.gameBoard.players.map((item, key) =>{
          var cardClick;
          //OnClick of Cards is only defined if Game ins't over yet
          if(!this.state.end){
            //onClick stores the card either in chosenCard or enemyCard depending if the Card belongs to the active Player or not
              if(item==this.gameBoard.players[this.state.activePlayerIndex]){
                cardClick= CardStore.selectCard;
              }else{
                cardClick=CardStore.selectEnemyCard;
              }
          }
          return(<div key={item.playerName}><h2>{item.playerName}</h2><PlayerCards item={item.playerCards} cardClick={cardClick}/></div>);
      });

      //Load Cards from the CardStore
      const {chosenCard} = CardStore;
      const {enemyCard} = CardStore;
      const {stackCard} = CardStore;
      const {showCard} = CardStore;

      //Only Show DrawButton if there is no card already drawn and Game isn't over
      let drawButton;
      if(stackCard==undefined && !this.state.end){
        drawButton=
        <Button onClick={draw.bind(this)}>Draw Card</Button>;
      }

      //Only show Buttons if a Card has been drawn and the Game isn't over
      let throwButton;
      let swapStackButton;
      let swapPlayerButton;
      let showButton;

      if(stackCard!=undefined && !this.state.end){
        throwButton = <Button onClick={throwCards.bind(this)}>Throw</Button>;

        //Only show SwapStackButton if the Card you've drawn is not an ActionCard
        if(stackCard.value!="show" &&stackCard.value!="swap"){
          swapStackButton =<Button onClick={swapStackCard.bind(this,chosenCard)}>Swap with First Card from Stack</Button>;
        }

        //Only show SwapPlayerButton if the Card you've drawn is a Swap Card
        if(stackCard.value=="swap"){
          swapPlayerButton =<Button onClick={swapPlayerCard.bind(this,chosenCard,enemyCard)}>Swap with Enemy Card</Button>;
        }

        //Only Show ShowButton if the card you've drawn is a show Card
        if(stackCard.value=="show"){
          showButton=
          <Button onClick={show.bind(this,chosenCard)}>Show Card</Button>;
        }
      }
      //Only show EndGameButton if it hasn't already been pressed
      var endGameButton;
      if (this.state.endRound==""){
        endGameButton = <Button onClick={setEndGame.bind(this)}>End Game</Button>;
      }

        return (
            <div>
            <Alert variant="primary">Runde {this.state.round}</Alert>
            <Alert variant="primary">Your turn, {this.gameBoard.players[this.state.activePlayerIndex].playerName}</Alert>
              <Modal show={this.state.warningshow} onHide={handleModalClose.bind(this)}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body><Alert variant="warning">{this.state.alert}</Alert></Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleModalClose.bind(this)}>
                    Got It
                  </Button>
                </Modal.Footer>
              </Modal>
              {playerCards}
              <h2>Kartenstapel</h2>
              <StackCards item={this.gameBoard.cardsInMiddle} stack={true}/>
              <br/><br/>
              <h2>Ablegestapel</h2>
              <StackCards item={this.gameBoard.usedCards} stack={false}/>
              <br/><br/>
              {swapStackButton}
              {swapPlayerButton}
              {throwButton}
              {drawButton}
              {showButton}
              {endGameButton}
            </div>
        );
    }
}
