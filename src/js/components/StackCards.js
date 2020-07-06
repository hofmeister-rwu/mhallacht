import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"


class StackCards extends React.Component{
    render() {
      let clickFunction;

      let stackClass = "col-md-6";

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
            case "swap":
              clickFunction =  ;
              break;
          }

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
