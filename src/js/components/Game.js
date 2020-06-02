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
        this.roleCards = [];
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
        let roles = ["abenteurer", "haendler", "alter-mann", "wanderer", "kobold", "prediger", "gottheit", "buerokrat", "koenig"];
        //let roles =["kobold","kobold","kobold","kobold","kobold","kobold","kobold"];
        for (let i = 0; i < roles.length; i++) {
              this.roleCards.push(roles[i]);
        }
    }

    shuffleDeck() {
       let location1, location2, tmp;
       for (let i = 0; i < 2000; i++) {
           location1 = Math.floor((Math.random() * this.cards.length));
           location2 = Math.floor((Math.random() * this.cards.length));
           tmp = this.cards[location1];
           this.cards[location1] = this.cards[location2];
           this.cards[location2] = tmp;


           location1 = Math.floor((Math.random() * this.roleCards.length));
           location2 = Math.floor((Math.random() * this.roleCards.length));
           tmp = this.roleCards[location1];
           this.roleCards[location1] = this.roleCards[location2];
           this.roleCards[location2] = tmp;
        }
    }
}class Player {
    constructor(name, role) {
        this.playerName = name;
        this.playerCards = [];
        this.playerValue;
        this.playerRole = role;
        this.roleActive = true;
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
          let role = d.roleCards.splice(0,1)
          this.players.push(new Player(playerNames[i],role[0]));
          if(role[0]=="abenteurer"){
              this.players[i].playerCards = d.cards.splice(0, 5);
          }else{
            this.players[i].playerCards = d.cards.splice(0, 4);
          }
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
          if(playersDB[i].playerCardFive != ""){
            var cardFive =  new Card(playersDB[i].playerCardFive,playersDB[i].playerName+"-Card-Five");
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour,cardFive];
          }else{
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour];
          }
          this.players[i].playerRole = playersDB[i].playerRole;
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
        this.setState({drawn:this.state.drawn+1});
    }

    //Throw a Card that the Player doesnt want on the used Cards Stack
    function throwCards(){
      //if you dont want to use the StackCard throw it on the usedCards Stack
        let thrownCard = this.gameBoard.cardsInMiddle.splice(0,1);
        this.gameBoard.usedCards.splice(0,0,thrownCard[0]);
        CardStore.unselectCards();
        //this.endTurn();
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
              //this.endTurn();

              CardStore.unselectCards();
            }

        //if the chosenCard hasn't been defined yet, give out a warning
        }else{
          this.setState({alert:"Such dir eine deiner Karten aus, die getauscht werden soll", warningshow:true, modalClose:this.closeModal.bind(this)})
        }
    }

    //Swap a Card from the current player with the first Card from the Used Stack
    function swapUsedCard(chosenCard){
        //if a Card has been chosen, swap the first Card in the Stack with the chosenCard
        setState({drawn:this.state.drawn+1});
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
              //this.endTurn();

              CardStore.unselectCards();
            }

        //if the chosenCard hasn't been defined yet, give out a warning
        }else{
          this.setState({alert:"Such dir eine deiner Karten aus, die getauscht werden soll", warningshow:true, modalClose:this.closeModal})
        }
    }

    //Swap a Card from the active Player with a Card from another player
    function swapPlayerCard(chosenCard,enemyCard){
      this.setState({actionDrawn:true});
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
        //this.endTurn();

        CardStore.unselectCards();

      //if one Card isn't chosen yet give out a warning
    }else{
        if(chosenCard==undefined && enemyCard==undefined){
            this.setState({alert:"Such dir eine deiner Karten und eine Karte eines Gegners aus, um zu tauschen!", warningshow:true, modalClose:this.closeModal})
        }
        if(chosenCard==undefined && enemyCard!=undefined){
            this.setState({alert:"Such dir eine deiner Karten aus, um zu tauschen!", warningshow:true, modalClose:this.closeModal})
        }
        if (enemyCard==undefined && chosenCard!=undefined){
              this.setState({alert:"Such dir eine Karte von einem deiner Gegner aus, um zu tauschen!", warningshow:true, modalClose:this.closeModal})
        }
      }
    }

    //After the activePlayer has performed an action his Turn is over
    function skipNext(){
      this.setState({actionDrawn:true});
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
        this.setState({actionDrawn:true});
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

        this.setState({actionDrawn:true});
        var warning = "Bitte Schau weg solange " + this.gameBoard.players[this.state.activePlayerIndex].playerName + " seine Karten anschaut";
        this.setState({alert:warning,warningshow:true, modalClose:this.closeModal.bind(this)});
      if(card!=undefined && secondCard.value !=undefined){
        this.setState({modalClose:() => {this.closeModal(); this.showFirst(card,secondCard);}});
      }else if(card!=undefined &&secondCard.value==undefined){
        this.setState({modalClose:() => {this.closeModal(); this.show(card);}});
      //if no card is chosen give out a warning
      }else{
        this.setState({alert:"Such dir ein Karte aus, die angezeigt werden soll", warningshow:true, modalClose:this.closeModal})
      }
    }

    //Show one of the activePlayers Cards
    function show(card){
        this.setState({actionDrawn:true});
      if(card!=undefined){
          //if the Card to Show is defined, show the Card Value for 2 seconds
          CardStore.selectShowCard(card);
          setTimeout(() => {CardStore.unselectCards();}, 2000);
          //setTimeout(() => {this.endTurn();}, 2000);
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
      this.setState({actionDrawn:false});
      if(this.state.koboldEndIndex!=""){
        this.checkKoboldEnd();
      }

        if(this.state.gottheitRound!=""){
          this.checkGottheit();
        }
      this.setState({drawn:0});
      //if the EndGame has been defined, we check if the Game is over yet
        if(this.state.endRound!=""){
          this.checkEndGame();
        }
        switch (this.state.direction){
          case "left":
          //if theres a next player in the array it's his turn, so we unselect all Cards and count up the activePlayerIndex
            if(this.state.activePlayerIndex+1<this.gameBoard.players.length){
              this.setState({activePlayerIndex:this.state.activePlayerIndex+1,});
              CardStore.unselectCards();
            }else{
          //if theres no next player in the array a new Round begins and we start with the first player again
              this.endRound(0);
            }
            break;
          case "right":
          //if theres a next player in the array it's his turn, so we unselect all Cards and count up the activePlayerIndex
            if(this.state.activePlayerIndex-1>=0){
              this.setState({activePlayerIndex:this.state.activePlayerIndex-1,});
              CardStore.unselectCards();
            }else{
          //if theres no next player in the array a new Round begins and we start with the first player again
              this.endRound(this.gameBoard.players.length-1);
            }
            break;
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
      //this.endTurn();
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
        this.setState({alert:endList, warningshow:true, end:true, modalClose:this.closeModal})
      }
    }


    function save(){
        CardStore.deleteAll();
        for(let i = 0; i < this.gameBoard.players.length; i++){
          if(this.state.activePlayerIndex==i){
            if(this.gameBoard.players[i].playerRole=="abenteurer"){
                CardStore.addNewAbenteurer(this.gameBoard.players[i],true);
            }else{
                CardStore.addNewPlayer(this.gameBoard.players[i],true);
            }
          }else{

            if(this.gameBoard.players[i].playerRole=="abenteurer"){
                CardStore.addNewAbenteurer(this.gameBoard.players[i],false);
            }else{
                CardStore.addNewPlayer(this.gameBoard.players[i],false);
            }
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



    ///roles
    function useRole(role){

        switch(role){
          case "abenteurer":
            this.deactivateRole(role);
            break;
          case "alter-mann":
          if(this.state.drawn==0){
              this.alterMann();
          }else{
            this.setState({alert:"Deine Rolle kann nur genutzt werden, wenn du noch nicht gezogen hast!", warningshow:true,modalClose:closeModal.bind(this)});
          }
            break;
          case "buerokrat":
            this.buerokrat();
            break;
          case "gottheit":
            this.gottheit();
            break;
          case "haendler":
            this.haendler();
            break;
          case "kobold":
          this.kobold();
            break;
          case "koenig":
          this.koenig();
            break;
          case "prediger":
          if(!this.state.predigerused){
            this.prediger();
          }else{
            this.setState({alert:"Deine Rolle kann nur einmal im Zug verwendet werden", warningshow:true,modalClose:closeModal.bind(this)});
          }
            break;
          case "wanderer":
            this.wanderer();
            break;
          default:
            this.setState({alert:"Du hast im Moment keine Rolle", warningshow:true, modalClose:this.closeModal.bind(this)});
            break;
        }
    }

      //DEACTIVATE ROLE // ABENTEURER

        function deactivateRole(playerRole){
          for (let i = 0; i < this.gameBoard.players.length; i++) {
            if(this.gameBoard.players[i].playerRole == playerRole){
              if(playerRole == "abenteurer"){
                if(CardStore.chosenCard!=undefined){
                    var chosenCardIndex;
                      for(let j = 0; j < this.gameBoard.players[i].playerCards.length; j++){
                        if(this.gameBoard.players[i].playerCards[j]==CardStore.chosenCard){
                          chosenCardIndex=j;
                        }
                      }
                    let playerCard = this.gameBoard.players[i].playerCards.splice(chosenCardIndex,1);
                    this.gameBoard.usedCards.splice(0,0,playerCard[0]);
                        this.gameBoard.players[i].playerRole = " ";
                }else{
                  this.setState({alert:"Such dir eine deiner Karten aus, die abgelegt werden soll, um die Rolle abzulegen.", warningshow:true, modalClose:this.closeModal})
                }
              }else{
                  this.gameBoard.players[i].playerRole = " ";
              }
              CardStore.unselectCards();
            }
          }
        }

        //HAENDLER

        function haendler(){
          for (let i = 0; i < this.gameBoard.players.length; i++) {
            if(this.gameBoard.players[i].playerRole == "haendler"){

                var c=0;
                for(let j = this.gameBoard.players[i].playerCards.length-1; j >= 0 ; j--){

                   setTimeout(() => {
                   console.log("Block 1, Karte " + j);
                   let playerCard = this.gameBoard.players[i].playerCards.splice(j,1);
                   this.gameBoard.usedCards.splice(0,0,playerCard[0]);
                   CardStore.selectStackCard(this.gameBoard.cardsInMiddle[0]);
                 }, 500+c*2000);

                  setTimeout(() => {

                    console.log("Block 2, Karte " + j)

                  let stackCard = this.gameBoard.cardsInMiddle.splice(0,1);
                  this.gameBoard.players[i].playerCards.splice(0,0,stackCard[0]);
                  CardStore.selectShowCard(this.gameBoard.players[i].playerCards[0]);
                }, (c+1)*2000);

                CardStore.unselectCards();
                  c++;
                }
                setTimeout(()=>{
                CardStore.unselectCards();
                this.deactivateRole("haendler")},
                (c+1)*2000);

            }
          }
        }

        //ALTER MANN

        function alterMann(){
          this.deactivateRole("alter-mann");
          this.setState({drawn:this.state.drawn+1});
          CardStore.selectCircleUsedCard(this.gameBoard.usedCards[0]);
          CardStore.selectStackCard(this.gameBoard.usedCards[0]);
        }

        function circleBack(){
          let thrownCard = this.gameBoard.usedCards.splice(0,1);
          this.gameBoard.usedCards.splice(this.gameBoard.usedCards.length,0,thrownCard[0]);
          CardStore.unselectCards();
          this.alterMann();
        }

        //WANDERER

        function wanderer(){
          CardStore.unselectCards();
          this.setState({alert:"Sucht alle eine Karte aus, die nach links weitergegeben werden soll.", warningshow:true, playerCardClick:CardStore.selectWanderCard, modalClose:closeModal.bind(this)});
        }

        function cardsToLeft(){
          let indices = {};
          for (let i = 0; i < this.gameBoard.players.length; i++) {
            for (let j = 0; j < this.gameBoard.players[i].playerCards.length; j++) {
              if(Object.values(CardStore.wanderCards).includes(this.gameBoard.players[i].playerCards[j])){
                indices[i]=j;
              }
            }
          }

          let tmp = this.gameBoard.players[0].playerCards.splice(indices[0],1);
          let target;
          for (let s = 1; s < this.gameBoard.players.length; s++) {
            target = this.gameBoard.players[s].playerCards.splice(indices[s],1);
            this.gameBoard.players[s].playerCards.splice(indices[s],0,tmp[0]);
            tmp = target;
          }
          this.gameBoard.players[0].playerCards.splice(indices[0],0,tmp[0]);

          this.setState({playerCardClick:""});
          this.deactivateRole("wanderer");
        }


        //KOBOLD

        function kobold(){
          this.setState({playerClick:(player) => {this.setState({koboldSelect:player})}, alert:"Such dein Opfer aus", warningshow:true, modalClose:this.closeModal,});
        }

        function setKoboldVictim(player){
          CardStore.selectKoboldVictim(player);
          let playerIndex;
          for (let i = 0; i < this.gameBoard.players.length; i++) {
            if(this.gameBoard.players[i].playerRole == "kobold"){
              playerIndex = i-1;
              if(playerIndex < 0){
                playerIndex= this.gameBoard.players.length-1;
              }
            }
          }
          this.setState({koboldEndIndex:playerIndex,koboldEndRound:this.state.round+1, koboldSelect:{}, playerClick:""});
          this.deactivateRole("kobold");
        }

        function checkKoboldEnd(){
          if(this.state.round>=this.state.koboldEndRound && this.state.activePlayerIndex >= this.state.koboldEndIndex){
            CardStore.unselectKoboldVictim();
          }
        }

        //GOTTTHEIT

        function gottheit(){
          this.setState({alert:"In einer Runde werden alle Karten nach rechts weitergegeben.", warningshow:true, modalClose:this.closeModal, gottheitRound:this.state.round+1});
        }

        function checkGottheit(){
          if(this.state.round == this.state.gottheitRound && this.gameBoard.players[this.state.activePlayerIndex+1].playerRole == "gottheit"){
            this.setState({alert:"Karten werden nach rechts weitergegeben", warningshow:true, modalClose:this.closeModal, gottheitRound:""});
            let last = this.gameBoard.players[this.gameBoard.players.length-1].playerCards;
            for (let i = 0; i < this.gameBoard.players.length-1 ; i++) {
                let tmp = this.gameBoard.players[i].playerCards;
                if (i-1 < 0) {
                  this.gameBoard.players[this.gameBoard.players.length-1].playerCards = tmp;
                }else{
                  this.gameBoard.players[i-1].playerCards = tmp;
                }
            }
            this.gameBoard.players[this.gameBoard.players.length-2].playerCards=last;
            this.deactivateRole("gottheit");
          }
        }

        //BÜROKRAT

        function buerokrat(){
          if(this.state.round > 3 && !this.state.actionDrawn){
            this.setState({endRound:this.state.round, endPlayer:this.state.activePlayerIndex});
              this.setState({alert:"Die Runde wird nach deinem Zug beendet", warningshow:true, modalClose:this.closeModal});
          }else{
            this.setState({alert:"Du darfst die Runde erst nach Runde 3 beenden und keine Aktionskarte einsetzen", warningshow:true, modalClose:this.closeModal});
          }
        }

        //KÖNIG

        function koenig(){
          this.setState({drawn:0, direction:"right"});
          this.deactivateRole("koenig");
        }

        //PREDIGER

        function prediger(){
          this.setState({predigerused:true});
          this.setState({alert:"Such dir nun einen Gegner und zwei seiner Karten aus, die du richtig benennen kannst", warningshow:true, modalClose:this.closeModal.bind(this), playerCardClick:CardStore.predigerCardSelect, playerClick:CardStore.predigerSelect});
          CardStore.unselectCards;
        }

        function predigerCheck(rightAnswer,userAnswer){
          console.log(userAnswer);
          console.log(rightAnswer);
          let same = true;
          for (let i = 0; i < rightAnswer.length; i++) {
            if(rightAnswer[i]!=userAnswer[i]){
              same=false;
            }
          }
            let stackCard = new Card("swap","util");
            CardStore.selectStackCard(stackCard);
          if(same){
            this.setState({predigershow:false, alert:"Dein Tipp war richtig! Du darfst nun eine der beiden Karten mit deinen eigenen tauschen", warningshow:true, playerClick:"", playerCardClick:""});
          }else{
            this.setState({predigershow:false, alert:"Dein Tipp war falsch. Lass deinen Gegner auswählen welche Karten getauscht werden", warningshow:true, playerClick:"", playerCardClick:""});
          }
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
          rerender:false,
          drawn:0,
          actionDrawn:false,
          playerCardClick:"",
          playerClick:() => {},
          koboldEndIndex:"",
          koboldEndRound:"",
          koboldSelect:{},
          gottheitRound:"",
          direction:"left",
          predigershow:false,
          predigerused:false,
        };
    this.endRound=endRound.bind(this);
    this.endTurn=endTurn.bind(this);
    this.checkEndGame=checkEndGame.bind(this);
    this.closeModal=closeModal.bind(this);
    this.show=show.bind(this);
    this.showFirst=showFirst.bind(this);
    this.deactivateRole=deactivateRole.bind(this);
    this.haendler=haendler.bind(this);
    this.alterMann=alterMann.bind(this);
    this.wanderer=wanderer.bind(this);
    this.kobold=kobold.bind(this);
    this.setKoboldVictim=setKoboldVictim.bind(this);
    this.checkKoboldEnd=checkKoboldEnd.bind(this);
    this.gottheit = gottheit.bind(this);
    this.checkGottheit=checkGottheit.bind(this);
    this.buerokrat=buerokrat.bind(this);
    this.koenig=koenig.bind(this);
    this.prediger = prediger.bind(this);

    CardStore.fetchSavings();
  }
    render() {
     console.log(this.gameBoard);
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
      const playerCards = this.gameBoard.players.map((item, key) =>{

          let cardClick;
          let roleFunction;
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
                roleFunction = useRole.bind(this,item.playerRole);
              }else{
                cardClick=CardStore.selectEnemyCard;
              }
              if(item == this.state.koboldSelect || item == CardStore.predigerVictim){
                deckClass += " bg-primary";
              }
          }
          if(this.state.playerCardClick!=""){
            cardClick=this.state.playerCardClick;
          }

          let playerClick ="";
          if(this.state.playerClick!=""){
            playerClick =this.state.playerClick.bind(this,item);
          }

          let predigerSwap = false;
          if(CardStore.predigerVictim.playerCards != undefined && this.state.playerCardClick == "" && item != this.gameBoard.players[this.state.activePlayerIndex]){
            cardClick=()=>{};
            if(CardStore.predigerVictim == item){
              cardClick = cardClick=CardStore.selectEnemyCard;
            }
            predigerSwap=true;
          }

          return(<div key={item.playerName} class="player center" onClick={playerClick}>
            <PlayerCards player={item} cardClick={cardClick} deckClass={deckClass} end={this.state.end} roleCard={true} roleFunction={roleFunction} predigerSwap={predigerSwap}/>
            </div>);
      });

      //Only Show Info once Game has really started
      let gameInfo = <Alert variant="primary">Schau deine Karten an, {this.gameBoard.players[this.state.activePlayerIndex].playerName}
      <Button class="save-button" onClick={save.bind(this)}>Speichern</Button></Alert>;
      let drawButton;
      let usedButton;
      let throwButton;
      let actionButton;
      let endGameButton;
      let useRoleButton;

      if(this.state.playerCardClick == CardStore.selectWanderCard){
        let disabl = true;
        if(Object.values(CardStore.wanderCards).length == this.gameBoard.players.length){
          disabl=false;
        }
        useRoleButton = <Button disabled={disabl} onClick={cardsToLeft.bind(this)}>Karten nach links geben</Button>;
      }

      if(this.state.koboldSelect.playerName != undefined && CardStore.koboldVictim.playerName == undefined ){
        useRoleButton = <Button onClick={setKoboldVictim.bind(this, this.state.koboldSelect)}>Opfer auswählen</Button>;
      }

      if(CardStore.predigerVictim != {} && CardStore.predigerCards.length>=2 && this.state.playerClick!=""){
        useRoleButton = <Button onClick={() => {this.setState({predigershow:true})}}>Spieler und Karten auswählen</Button>;
      }


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

        if(stackCard==undefined && !this.state.end && this.state.drawn==0){

          drawButton= <Button onClick={draw.bind(this)}>Ziehen</Button>;

          if(this.gameBoard.usedCards[0]!=undefined && !isNaN(parseInt(this.gameBoard.usedCards[0].value,10))){
            usedButton=
            <Button onClick={swapUsedCard.bind(this,chosenCard)}>Vom Ablegestapel tauschen</Button>;
          }

        }else if(stackCard == undefined && this.state.drawn < 2 && this.gameBoard.players[this.state.activePlayerIndex].playerRole=="abenteurer"){
            drawButton= <Button onClick={draw.bind(this)}>Ziehen</Button>;

        }else{
          throwButton = <Button onClick={endTurn.bind(this)}>Zug beenden</Button>;
        }

        if(stackCard!=undefined && !this.state.end){
          if(this.gameBoard.cardsInMiddle[0]==stackCard){
            throwButton = <Button onClick={throwCards.bind(this)}>Wegwerfen</Button>;
          }else if(this.gameBoard.usedCards[0]==stackCard && this.gameBoard.usedCards[0]==circleUsedCard){
              throwButton = <Button onClick={circleBack.bind(this)}>Wegwerfen</Button>;
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

                  <PredigerModal
                  show={this.state.predigershow}
                  onHide={()=>this.setState({predigershow:false})}
                  compare={predigerCheck.bind(this)}
                  />

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
                {useRoleButton}
              </div>
            </div>
        );
    }
}
