import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game";
import RoleCard from "../components/RoleCard"
import Button from 'react-bootstrap/Button'


class PlayerCards extends React.Component{
    render() {
      //Get ChosenCard from CardStore
      let {chosenCard} = CardStore;
      let {enemyCard} = CardStore;
      let {showCard} = CardStore;
      //Load Parts of Deck in {cards}
      const cards =this.props.player.playerCards.map((card, key) => {

        var cardClick;
        if(this.props.cardClick!=undefined){
          cardClick=this.props.cardClick.bind(this,card,this.props.player);
        }

        var cardClass = "value-"+card.value;
        if(card ==chosenCard){
          cardClass += " chosenCard";
        }
        if(card ==enemyCard){
          cardClass += " enemyCard";
        }
        if(card != showCard && this.props.end==false && this.props.player != CardStore.koboldVictim){
          cardClass+=" card-down";
        }
        if(card == showCard){
          cardClass += " show-card";
        }
        //console.log(Object.values(CardStore.wanderCards));
        if(Object.values(CardStore.wanderCards).includes(card)){
          cardClass+=" chosenCard";
        }

        if(CardStore.predigerCards.includes(card)){
          cardClass+=" predigerCard";
        }

        if(CardStore.predigerVictim.playerCards!=undefined && this.props.predigerSwap){
          cardClick=()=>{};
          if(CardStore.predigerCards.includes(card)){
            cardClick = this.props.cardClick.bind(this,card,this.props.player);
          }
        }

        return (
          <Card key={card.id} className={cardClass} onClick={cardClick}>
            <Card.Body>
              <div class="card-front">
               <p> {card.value}</p>
              </div>
              <div class="card-back">
              <p> Back </p>
              </div>
            </Card.Body>
          </Card>);
        });
        let roleCard;
        if(this.props.roleCard){
          roleCard= <RoleCard player={this.props.player} roleFunction={this.props.roleFunction}/>;
        }
        return (
          <div class={this.props.deckClass}>
            <h2 class="deckHeading">{this.props.player.playerName}</h2>
            <div class="deck playerCards">{cards} {roleCard}</div>
          </div>
        );
    }
}
export default PlayerCards;
