import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore"


class PlayerCards extends React.Component{
    render() {
        const cards = this.props.item.map((item, key) =>
        <Card key={item.id} className="bg-warning" onClick={CardStore.selectCard.bind(this,item)}>
          <Card.Body>
            <Card.Title type="dark">{item.value}</Card.Title>
          </Card.Body>
        </Card>
        );
        return (
          <CardDeck>
          {cards}
          </CardDeck>
        );
    }
}
export default PlayerCards;
