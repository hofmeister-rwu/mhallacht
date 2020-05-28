import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"

function useRole(role){
    switch(role){
      case "abenteurer":
        Game.deactivateRole(role);
        break;
      case "alter-mann":
        console.log("Alter Mann");
        break;
      case "buerokrat":
        console.log("Bürokrat");
        break;
      case "gottheit":
        console.log("Gottheit");
        break;
      case "haendler":
        console.log("Händler");
        break;
      case "kobold":
        console.log("Kobold");
        break;
      case "koenig":
        console.log("König");
        break;
      case "prediger":
        console.log("Prediger");
        break;
      case "wanderer":
        console.log("Wanderer");
        break;
      default:
        console.log("Default");
        break;
    }
}


class RoleCard extends React.Component{
    render() {
      //Get ChosenCard from CardStore
      let roleClass= "roleCard value-"+this.props.player.playerRole;
      if(this.props.player.roleActive == false){
        roleClass += " card-down";
      }

        return (
            <Card className={roleClass} onClick={useRole.bind(this,this.props.player.playerRole)}>
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
