import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import GameStore from "../stores/gameStore";
import Game from "../components/Game"


class StackCards extends React.Component{
    render() {
      let clickFunction;

      let stackClass = "col-md-6 stack-"+this.props.stack;

      let counter = 1;
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {
        let cardClass = "value-"+card.value;

        //all up cards
        if(card!=CardStore.stackCard && this.props.stack==true && !CardStore.doubleCards.includes(card)){
          cardClass+=" card-down";
        }

        //StackCard
        if(card==CardStore.stackCard){
          cardClass+=" front-card";
          stackClass+=" z-index-100";
          switch(card.value){
            case 0: case "0": case 1: case "1": case 2: case "2": case 3: case "3": case 4: case "4": case 5: case "5": case 6: case "6": case 7: case "7": case 8: case "8": case 9: case "9":
              clickFunction= GameStore.swapStackCard.bind(this,CardStore.chosenCard);
              break;
            case "swap":
              clickFunction =  GameStore.swapPlayerCard.bind(CardStore.chosenCard,CardStore.enemyCard);
              break;
            case "show":
              clickFunction = GameStore.showCardModal.bind(this,CardStore.chosenCard);
              break;
            case "skip":
              clickFunction = GameStore.skipNext;
              break;
            case "double":
              clickFunction = GameStore.drawDouble;
              break;
            case "role-swap":
              clickFunction = GameStore.drawRole;
              break;
            case "end":
              if(GameStore.endingRound == ""){
                clickFunction = GameStore.setEndGame;
              }else{
                clickFunction = () => {
                  GameStore.setAlert("Die Runde wurde schon beendet!");
                  GameStore.setModalClose(GameStore.closeModal);
                  GameStore.setWarningShow(true);
                };
              }
              break;
          }

        }else if(this.props.stack == true && CardStore.stackCard == undefined &&GameStore.round>0 &&GameStore.drawn == 0){
          clickFunction = GameStore.draw;
        }else if( this.props.stack == true && CardStore.stackCard == undefined &&GameStore.round>0 &&GameStore.drawn == 1 && GameStore.gameBoard.players[GameStore.activePlayerIndex].playerRole =="abenteurer"){
            clickFunction = GameStore.draw;
        }else if(GameStore.drawn==0 && this.props.stack == false && counter == 1 &&  !isNaN(parseInt(card.value))){
            clickFunction = GameStore.swapUsedCard.bind(this,CardStore.chosenCard);
        }
        //DoubleCards
        if(CardStore.doubleCards.includes(card)){
          cardClass+=" double-card";
          clickFunction = () => {
            for (var i = 0; i < CardStore.doubleCards.length; i++) {
              if(CardStore.doubleCards[i]!=card){
                this.props.deleteFunction(CardStore.doubleCards[i]);
              }
            }
            CardStore.unselectCards();
            CardStore.selectStackCard(card);};
        }

        //Class to make Cards Overlap
        cardClass+=" card-"+counter;
        counter++;
          return (
            <Card key={card.id} className={cardClass} onClick={clickFunction}>
              <Card.Body>
                <div class="card-front">
                <p> {card.value}</p>
                </div>
                <div class="card-back">
                <p>Back</p>
                </div>
              </Card.Body>
            </Card>
          );
        });
        return (
          <div class={stackClass}>
            <div class="deckContainer">
              <h2 class="deckHeading">{this.props.heading}</h2>
              <div class="stackCards deck">{cards}</div>
            </div>
          </div>
        );
    }
}
export default StackCards;
