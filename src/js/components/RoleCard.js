import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import CardColumns from 'react-bootstrap/CardColumns';
import CardStore from "../stores/cardStore";
import Game from "../components/Game"

import RoleModal from "../components/RoleModal"

class RoleCard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      roleShow: false,
    }
    this.closeRoleModal= ()=>{this.setState({roleShow:false})};
    this.openRoleModal =()=>{this.setState({roleShow:true})};
  }
    render() {
      //Get ChosenCard from CardStore
      let roleClass= "roleCard value-"+this.props.player.playerRole;
      if(this.props.player.playerRole == " "){
        roleClass += " card-down";
      }

        return (
          <div>
            <RoleModal show={this.state.roleShow} dismiss={this.closeRoleModal} playerRole={this.props.player.playerRole} roleFunction ={this.props.roleFunction}/>
            <Card className={roleClass} onClick={this.openRoleModal.bind()}>
              <Card.Body>
                <div class="card-front">
                  <p> {this.props.player.playerRole}</p>
                </div>
                <div class="card-back">
                  <p> Back </p>
                </div>
              </Card.Body>
            </Card>
            </div>
        );
    }
}
export default RoleCard;
