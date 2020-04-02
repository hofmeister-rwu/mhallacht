import React from "react"
import { HashRouter, Route } from 'react-router-dom';
import { observer } from "mobx-react";
import Button from 'react-bootstrap/Button'
import PlayerCards from "../components/PlayerCards"
import StackCards from "../components/StackCards"
import CardStore from "../stores/cardStore"
import { observable, action } from 'mobx';
// import MobxInteraction from "../pages/MobxInteraction"


// Require scss files
require('../../stylesheets/_all.scss');

// require LESS files
require('../../stylesheets/initial.less');

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
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9,10];
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



function swapStackCard(chosenCard){
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
    CardStore.unselectCards();
    this.setState({chosenCardIndex:undefined});
}


function swapPlayerCard(chosenCard,enemyCard){
    var chosenCardIndex;
      for(let i = 0; i < this.gameBoard.players[this.state.activePlayerIndex].playerCards.length; i++){
        if(this.gameBoard.players[this.state.activePlayerIndex].playerCards[i]==chosenCard){
          chosenCardIndex=i;
        }
      }
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
    let playerCard = this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
    let otherCard = this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,1);
    this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,0,otherCard[0]);
    this.gameBoard.players[enemyPlayerIndex].playerCards.splice(enemyCardIndex,0,playerCard[0]);
    CardStore.unselectCards();
    this.setState({chosenCardIndex:undefined});
}


function throwCards(){
    let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
    this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
    this.setState({rerender:true});
    CardStore.unselectCards();
}

function draw(){
    CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
}

function show(card){
    CardStore.selectShowCard(card);
    console.log(CardStore.showCard);
    setTimeout(() => {CardStore.unselectCards()}, 2000);
}


// durch die Annotation @observer
@observer
export default class Game extends React.Component {
  @observable gameBoard = new Board();
  constructor(props){
    super(props);
        this.gameBoard.start(props.players);
        this.state = {
          rerender:false,
          chosenCardIndex:undefined,
          chosenCardPlayerIndex:undefined,
          activePlayerIndex:0,
        }
  }
    render() {
     console.log(this.gameBoard);
      //Load PlayerCards into {items}
      const playerCards = this.gameBoard.players.map((item, key) =>{
        var cardClick;
          if(item==this.gameBoard.players[this.state.activePlayerIndex]){
            cardClick= CardStore.selectCard;
          }else{
            cardClick=CardStore.selectEnemyCard;
          }
        return(<div key={item.playerName}><h2>{item.playerName}</h2><PlayerCards item={item.playerCards} cardClick={cardClick}/></div>);
      });
      const {chosenCard} = CardStore;
      const {enemyCard} = CardStore;
      const {stackCard} = CardStore;
      const {showCard} = CardStore;
      //Make SwapButton invisible if no Card is chosen
      let swapStackButton;
      if(chosenCard!=undefined &&enemyCard==undefined){
        swapStackButton =<Button onClick={swapStackCard.bind(this,chosenCard)}>Swap with First Card from Stack</Button>;
      }
      let swapPlayerButton;
      if(chosenCard!=undefined && enemyCard!=undefined){
        swapPlayerButton =<Button onClick={swapPlayerCard.bind(this,chosenCard,enemyCard)}>Swap with Enemy Card</Button>;
      }
      let throwButton;
      if(stackCard!=undefined){
        throwButton = <Button onClick={throwCards.bind(this)}>Throw</Button>;
      }
      let drawButton;
      if(stackCard==undefined){
        drawButton=
        <Button onClick={draw.bind(this)}>Draw Card</Button>;
      }
      let showButton;
      if(chosenCard!=undefined&&enemyCard==undefined){
        showButton=
        <Button onClick={show.bind(this,chosenCard)}>Show Card</Button>;
      }
        return (
            <div>
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
            </div>
        );
    }
}
