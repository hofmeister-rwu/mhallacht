import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"


class PlayerCards extends React.Component{
    render() {
      //Get ChosenCard from CardStore
      let {chosenCard} = CardStore;
      let {stackCard} = CardStore;
      var counter = 1;
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {
        var cardClass ="bg-warning";
        if(card!=stackCard && this.props.stack==true){
          cardClass+=" card-down";
        }
        cardClass+=" card-"+counter;
        counter++;
          return (
            <Card key={card.id} className={cardClass}>
              <Card.Body>
                <Card.Title type="dark">{card.value}</Card.Title>
              </Card.Body>
            </Card>
          );
        });
        return (
          <div class="deck-block">
            <h2 class="deckHeading">{this.props.heading}</h2>
            <div class="stackCards deck">{cards}</div>
          </div>
        );
    }
}
export default PlayerCards;
