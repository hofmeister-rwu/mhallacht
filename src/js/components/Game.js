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
import SaveModal from "../components/SaveModal"
import AlertModal from "../components/AlertModal"
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
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, "show", "swap", "show", "swap", "show", "swap","end","skip","double"];
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
        for (let i = 0; i < playerNames.length; i++) {
          this.players.push(new Player(playerNames[i]));
          this.players[i].playerCards = d.cards.splice(i*4, 4);
        }
        this.cardsInMiddle=d.cards;
    }
    load(playersDB, middleDB, usedDB) {
      console.log(playersDB);
      this.players.length=0;
      for (let i = 0; i < playersDB.length; i++) {
          this.players.push(new Player(playersDB[i].playerName));
          var cardOne =  new Card(playersDB[i].playerCardOne,playersDB[i].playerName+"-Card-One");
          var cardTwo =  new Card(playersDB[i].playerCardTwo,playersDB[i].playerName+"-Card-Two");
          var cardThree =  new Card(playersDB[i].playerCardThree,playersDB[i].playerName+"-Card-Three");
          var cardFour =  new Card(playersDB[i].playerCardFour,playersDB[i].playerName+"-Card-Four");
          this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour];
      }
      this.cardsInMiddle.length =0;
      for (let i = 0; i < middleDB.length; i++) {
         this.cardsInMiddle.push(new Card (middleDB[i].value,middleDB[i].idCard));
      }
      this.usedCards.length =0;
      for (let i = 0; i < usedDB.length; i++) {
         this.usedCards.push(new Card (usedDB[i].value,usedDB[i].idCard));
      }
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

    function throwCardbyObject(card){
      var cardIndex = 0;
      for (let i = 0; i < this.gameBoard.cardsInMiddle.length; i++) {
        if(this.gameBoard.cardsInMiddle[i]==card){
          cardIndex = i;
        }
      }
      let thrownCard = this.gameBoard.cardsInMiddle.splice(cardIndex,1);
      this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
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
            if(isNaN(parseInt(this.gameBoard.usedCards[0].value))){
              CardStore.selectStackCard(this.gameBoard.usedCards[0]);
            }else{
              this.endTurn();
            }
            //this.endTurn();

        //if the chosenCard hasn't been defined yet, give out a warning
        }else{
          this.setState({alert:"Such dir eine deiner Karten aus, die getauscht werden soll", warningshow:true})
        }
    }

    //Swap a Card from the current player with the first Card from the Used Stack
    function swapUsedCard(chosenCard){
        //if a Card has been chosen, swap the first Card in the Stack with the chosenCard
        if(chosenCard!=undefined){
            var chosenCardIndex;
              for(let i = 0; i < this.gameBoard.players[this.state.activePlayerIndex].playerCards.length; i++){
                if(this.gameBoard.players[this.state.activePlayerIndex].playerCards[i]==chosenCard){
                  chosenCardIndex=i;
                }
              }
            let playerCard = this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,1);
            let stackCard = this.gameBoard.usedCards.splice(0,1);
            this.gameBoard.usedCards.splice(0,0,playerCard[0]);
            this.gameBoard.players[this.state.activePlayerIndex].playerCards.splice(chosenCardIndex,0,stackCard[0]);
            if(isNaN(parseInt(this.gameBoard.usedCards[0].value))){
              CardStore.selectStackCard(this.gameBoard.usedCards[0]);
            }else{
              this.endTurn();
            }

        //if the chosenCard hasn't been defined yet, give out a warning
        }else{
          this.setState({alert:"Such dir eine deiner Karten aus, die getauscht werden soll", warningshow:true})
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
        if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
          let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
          this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
        }
        this.endTurn();

      //if one Card isn't chosen yet give out a warning
    }else{
        if(chosenCard==undefined && enemyCard==undefined){
            this.setState({alert:"Such dir eine deiner Karten und eine Karte eines Gegners aus, um zu tauschen!", warningshow:true})
        }
        if(chosenCard==undefined && enemyCard!=undefined){
            this.setState({alert:"Such dir eine deiner Karten aus, um zu tauschen!", warningshow:true})
        }
        if (enemyCard==undefined && chosenCard!=undefined){
              this.setState({alert:"Such dir eine Karte von einem deiner Gegner aus, um zu tauschen!", warningshow:true})
        }
      }
    }

    //After the activePlayer has performed an action his Turn is over
    function skipNext(){
      // put the StackCard on the UsedCard Staple
      if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
        let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
        this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
      }
      //if theres a next player in the array it's his turn, so we unselect all Cards and count up the activePlayerIndex
        if(this.state.activePlayerIndex+2<this.gameBoard.players.length){
          this.setState({activePlayerIndex:this.state.activePlayerIndex+2,});
          CardStore.unselectCards();
        }else{
      //if theres no next player in the array a new Round begins and we start with the first player again
          console.log(this.state.activePlayerIndex+2-this.gameBoard.players.length);
          this.endRound(this.state.activePlayerIndex+2-this.gameBoard.players.length);
        }


    }

    function drawDouble(){

      if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
        let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
        this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
      }
        CardStore.unselectCards();
        console.log(this.gameBoard.cardsInMiddle[0]);
        console.log(this.gameBoard.cardsInMiddle[1]);
        CardStore.selectDoubleCards(this.gameBoard.cardsInMiddle[0],this.gameBoard.cardsInMiddle[1]);
        //CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
    }


    function showCardModal(card, secondCard){
        var warning = "Bitte Schau weg solange " + this.gameBoard.players[this.state.activePlayerIndex].playerName + " seine Karten anschaut";
        this.setState({alert:warning,warningshow:true});
      if(card!=undefined && secondCard.value !=undefined){
        this.setState({modalClose:() => {this.closeModal(); this.showFirst(card,secondCard);}});
      }else if(card!=undefined &&secondCard.value==undefined){
        this.setState({modalClose:() => {this.closeModal(); this.show(card);}});
      //if no card is chosen give out a warning
      }else{
        this.setState({alert:"Such dir ein Karte aus, die angezeigt werden soll", warningshow:true})
      }
    }

    //Show one of the activePlayers Cards
    function show(card){
      if(card!=undefined){
          //if the Card to Show is defined, show the Card Value for 2 seconds
          CardStore.selectShowCard(card);
          setTimeout(() => {this.endTurn();}, 2000);
          //after the Timer has run out, put the StackCard on the UsedCard Staple
          if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
            let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
            this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
          }
          this.setState({modalClose:closeModal.bind(this)});
        }
    }

    function showFirst(leftCard,rightCard){
        CardStore.selectShowCard(leftCard)
        setTimeout(() => {CardStore.selectShowCard(rightCard)}, 3000);
        setTimeout(() => {this.endTurn()}, 6000);

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
          this.endRound(0);
        }
    }

    //if all Players had their turn a new round beings
    function endRound(nextPlayer){
        this.setState({round:this.state.round+1,});
        this.setState({activePlayerIndex:nextPlayer});
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
      if(this.gameBoard.cardsInMiddle[0]==CardStore.stackCard){
        let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
        this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
      }
      this.endTurn();
    }


    //if the defined point when the game ends has come, the results are posted
    function checkEndGame(){
      if(this.state.round >= this.state.endRound && this.state.activePlayerIndex >= this.state.endPlayer){
        for(let i=0; i<this.gameBoard.players.length; i++){
            this.gameBoard.players[i].playerValue=0;
              for (let j = 0; j < this.gameBoard.players[i].playerCards.length; j++) {
                if(!isNaN(parseInt(this.gameBoard.players[i].playerCards[j].value))){
                    var integer = parseInt(this.gameBoard.players[i].playerCards[j].value, 10);
                    this.gameBoard.players[i].playerValue += integer;
                }else{
                  this.gameBoard.players[i].playerValue += 15;
                }
                console.log(this.gameBoard.players[i].playerValue)
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


    function save(){
        CardStore.deleteAll();
        for(let i = 0; i < this.gameBoard.players.length; i++){
          if(this.state.activePlayerIndex==i){
              CardStore.addNewPlayer(this.gameBoard.players[i],true);
          }else{
              CardStore.addNewPlayer(this.gameBoard.players[i],false);
          }
        }
        for(let i = 0; i < this.gameBoard.cardsInMiddle.length; i++){
            CardStore.addMiddleCard(this.gameBoard.cardsInMiddle[i]);
        }
        for(let i = 0; i < this.gameBoard.usedCards.length; i++){
            CardStore.addUsedCard(this.gameBoard.usedCards[i]);
        }
        console.log(this.state.round);
        CardStore.addRound(this.state.round);
        CardStore.fetchSavings();
        this.setState({saveshow:true});

    }

    function closeModal(){
      this.setState({warningshow:false});
    }


@observer
export default class Game extends React.Component {
  @observable gameBoard = new Board();

  constructor(props){
    super(props);
      switch (props.submit){
        case "new":
          this.gameBoard.start(props.players);
          break;
        case "load":
          this.gameBoard.load(props.playerArray, props.middleArray, props.usedArray);
          break;
        default:
          this.gameBoard.start(props.players);
          break;
      }
        this.state = {
          round:this.props.round,
          activePlayerIndex:this.props.activePlayerIndex,
          alert:"",
          warningshow:false,
          saveshow:false,
          modalClose:closeModal.bind(this),
          endRound:"",
          endPlayer:"",
          end:false,
        };
    this.endRound=endRound.bind(this);
    this.endTurn=endTurn.bind(this);
    this.checkEndGame=checkEndGame.bind(this);
    this.closeModal=closeModal.bind(this);
    this.show=show.bind(this);
    this.showFirst=showFirst.bind(this);
    CardStore.fetchSavings();
  }
    render() {
     //console.log(this.gameBoard);
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

     //Load PlayerCards into {items}
      const playerCards = this.gameBoard.players.map((item, key) =>{

          let cardClick;
          let counter = 0;
          for (let i = 0; i < this.gameBoard.players.length; i++) {
            if(this.gameBoard.players[i]==item){
              counter = (i-this.state.activePlayerIndex)+1;
              if(counter<=0){
                counter+=this.gameBoard.players.length;
              }
            }
          }
          let deckClass ="deckContainer player-"+counter;
          //OnClick of Cards is only defined if Game ins't over yet
          if(!this.state.end){
            //onClick stores the card either in chosenCard or enemyCard depending if the Card belongs to the active Player or not
              if(item==this.gameBoard.players[this.state.activePlayerIndex]){
                cardClick= CardStore.selectCard;
                deckClass+= " active"
              }else{
                cardClick=CardStore.selectEnemyCard;
              }
          }
          return(<div key={item.playerName} class="player center">
            <PlayerCards item={item.playerCards} heading={item.playerName} cardClick={cardClick} deckClass={deckClass} end={this.state.end}/>
            </div>);
      });

      //Load Cards from the CardStore
      const {chosenCard} = CardStore;
      const {enemyCard} = CardStore;
      const {stackCard} = CardStore;
      const {showCard} = CardStore;
      let {doubleCards} = CardStore;
      const doubleCardsfromStore = [...doubleCards];


      //Only Show Info once Game has really started
      let gameInfo = <Alert variant="primary">Schau deine Karten an, {this.gameBoard.players[this.state.activePlayerIndex].playerName}
      <Button class="save-button" onClick={save.bind(this)}>Speichern</Button></Alert>;
      let drawButton;
      let usedButton;
      let throwButton;
      let actionButton;
      let endGameButton;

      if(this.state.round>0){
        gameInfo=<Alert variant="primary">Runde {this.state.round} <Button class="save-button" onClick={save.bind(this)}>Speichern</Button></Alert> ;
        if(this.state.endPlayer != "" && !this.state.end){
          var tilEnd = this.state.endPlayer - this.state.activePlayerIndex +1;
          if(tilEnd <= 0){
            tilEnd = this.state.activePlayerIndex + tilEnd;
          }
          gameInfo=<Alert variant="primary">Runde {this.state.round}, Noch {tilEnd} Züge  <Button class="save-button" onClick={save.bind(this)}>Speichern</Button></Alert>
        }
        //Only Show DrawButton if there is no card already drawn and Game isn't over
        if(stackCard==undefined && !this.state.end){
          drawButton=
          <Button onClick={draw.bind(this)}>Ziehen</Button>;
          if(this.gameBoard.usedCards[0]!=undefined && !isNaN(parseInt(this.gameBoard.usedCards[0].value,10))){
            usedButton=
            <Button onClick={swapUsedCard.bind(this,chosenCard)}>Vom Ablegestapel tauschen</Button>;
          }
        }

        if(stackCard!=undefined && !this.state.end){
          if(this.gameBoard.cardsInMiddle[0]==stackCard){
            throwButton = <Button onClick={throwCards.bind(this)}>Wegwerfen</Button>;
          }else{
            throwButton = <Button onClick={endTurn.bind(this)}>Zug beenden</Button>;
          }

          //Only show SwapStackButton if the Card you've drawn is not an ActionCard
          if(!isNaN(parseInt(stackCard.value))){
            actionButton =<Button onClick={swapStackCard.bind(this,chosenCard)}>Vom Kartenstapel tauschen</Button>;
          }

          //Only show SwapPlayerButton if the Card you've drawn is a Swap Card
          if(stackCard.value=="swap"){
            actionButton =<Button onClick={swapPlayerCard.bind(this,chosenCard,enemyCard)}>Gegnerkarte tauschen</Button>;
          }

          //Only Show ShowButton if the card you've drawn is a show Card
          if(stackCard.value=="show"){
            actionButton=
            <Button onClick={showCardModal.bind(this,chosenCard)}>Karte umdrehen</Button>;
          }


          if(stackCard.value=="skip"){
            actionButton=
            <Button onClick={skipNext.bind(this)}>Spieler überspringen</Button>;
          }

          if(stackCard.value=="double"){
            actionButton=
            <Button onClick={drawDouble.bind(this)}>Doppelt ziehen</Button>;
          }
          //Only show EndGameButton if it hasn't already been pressed
          if (this.state.endRound=="" && stackCard.value=="end"){
            endGameButton = <Button onClick={setEndGame.bind(this)}>Spiel beenden</Button>;
          }
        }
      }else{
        let disabled = true;
        if(CardStore.showCard == undefined){
         disabled = false;
        }
        actionButton=
        <Button disabled={disabled} onClick={showCardModal.bind(this,this.gameBoard.players[this.state.activePlayerIndex].playerCards[0], this.gameBoard.players[this.state.activePlayerIndex].playerCards[3])}>
          Anfangskarten zeigen
        </Button>;
      }
      let endClass = "end-"+this.state.end;

        return (
            <div class={endClass}>
            {gameInfo}

                <AlertModal
                  show={this.state.warningshow}
                  onHide={this.state.modalClose}
                  alert={this.state.alert}
                />
                <SaveModal
                  saveshow={this.state.saveshow}
                  onHide={()=>this.setState({saveshow:false})}
                  playerLength={this.gameBoard.players.length}
                  middleLength={this.gameBoard.cardsInMiddle.length}
                  usedLength={this.gameBoard.usedCards.length}
                  round={this.state.round}/>

              <div class="stacks">
                <div class="row col-xl-4 col-6 mx-auto position-relative">
                  <StackCards heading={"Kartenstapel"} item={this.gameBoard.cardsInMiddle} stack={true} deleteFunction={throwCardbyObject.bind(this)}/>
                  <StackCards heading={"Ablegestapel"} item={this.gameBoard.usedCards} stack={false}/>
                </div>
              </div>
              <div class="center">
                    {playerCards}
              </div>
              <div class="button-row mx-auto">
                {drawButton}
                {usedButton}
                {throwButton}
                {actionButton}
                {endGameButton}
              </div>
            </div>
        );
    }
}
