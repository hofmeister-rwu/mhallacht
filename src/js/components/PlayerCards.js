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
      let {enemyCard} = CardStore;
      let {showCard} = CardStore;
      //Load Parts of Deck in {cards}
      const cards =this.props.item.map((card, key) => {

        var cardClass = "value-"+card.value;
        if(card ==chosenCard){
          cardClass += " chosenCard";
        }
        if(card ==enemyCard){
          cardClass += " enemyCard";
        }
        if(card != showCard && this.props.end==false){
          cardClass+=" card-down";
        }
        var cardClick;
        if(this.props.cardClick!=undefined){
          cardClick=this.props.cardClick.bind(this,card);
        }

        return (
          <Card key={card.id} className={cardClass} onClick={cardClick}>
            <Card.Body>
              <div class="card-front">
              </div>
              <div class="card-back">
              </div>
            </Card.Body>
          </Card>);
        });

        return (
          <div class={this.props.deckClass}>
            <h2 class="deckHeading">{this.props.heading}</h2>
            <div class="deck playerCards">{cards}</div>
          </div>
        );
    }
}
export default PlayerCards;
