import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"


class RoleCard extends React.Component{
    render() {
      //Get ChosenCard from CardStore
      let roleClass= "roleCard value-"+this.props.player.playerRole;
      if(this.props.player.playerRole == " "){
        roleClass += " card-down";
      }

        return (
            <Card className={roleClass} onClick={this.props.roleFunction}>
              <Card.Body>
                <div class="card-front">
                </div>
                <div class="card-back">
                </div>
              </Card.Body>
            </Card>
        );
    }
}
export default RoleCard;
