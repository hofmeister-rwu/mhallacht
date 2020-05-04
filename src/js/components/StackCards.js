import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"


class StackCards extends React.Component{
    render() {
      let clickFunction;

      var counter = 1;
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {
        var cardClass ="bg-warning";
        if(card!=CardStore.stackCard && this.props.stack==true && !CardStore.doubleCards.includes(card)){
          cardClass+=" card-down";
        }
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
        cardClass+=" card-"+counter;
        counter++;
          return (
            <Card key={card.id} className={cardClass} onClick={clickFunction}>
              <Card.Body>
                <Card.Title type="dark">{card.value}</Card.Title>
              </Card.Body>
            </Card>
          );
        });
        return (
          <div class="deckContainer">
            <h2 class="deckHeading">{this.props.heading}</h2>
            <div class="stackCards deck">{cards}</div>
          </div>
        );
    }
}
export default StackCards;
