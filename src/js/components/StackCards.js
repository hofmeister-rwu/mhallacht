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
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {
        var cardClass = "bg-warning";
        if(card ==chosenCard){
          cardClass = "bg-danger";
        }
        if(card!=stackCard && this.props.stack==true){
          cardClass+=" card-down";
        }
          return (
            <Card key={card.id} className={cardClass}>
              <Card.Body>
                <Card.Title type="dark">{card.value}</Card.Title>
              </Card.Body>
            </Card>
          );
        });
        return (
          <CardDeck>
          {cards}
          </CardDeck>
        );
    }
}
export default PlayerCards;