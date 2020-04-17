import { observable, action } from 'mobx';
import config from "../../config/main.config";
import { observer } from "mobx-react";



class CardStore {
    @observable chosenCard;
    @action.bound selectCard(card) {
      if(this.chosenCard != card){
        this.chosenCard = card;
      }else{
        this.chosenCard= undefined;
      }
    };
    @observable enemyCard;
    @action.bound selectEnemyCard(card) {
      if(this.enemyCard!=card){
          this.enemyCard = card;
      }else{
        this.enemyCard=undefined;
      }
    };
    @observable stackCard;
    @action.bound selectStackCard(card) {
        this.stackCard = card;
    };
    @observable showCard;
    @action.bound selectShowCard(card) {
        this.showCard = card;
    };
    @action.bound unselectCards() {
        this.chosenCard = undefined;
        this.enemyCard=undefined;
        this.showCard=undefined;
        this.stackCard=undefined;
    };

    @observable error = '';
    @observable playersFromServer;
    @action.bound fetchPlayers() {
        return fetch('http://localhost:3000/players', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(json => {
                        this.playersFromServer = json.players;
                        console.log(this.playersFromServer);
                    });

                } else {
                    this.error = "Error on fetching";
                }
            })
            .catch(
                error => {
                    this.error = "Error on fetching";
                    throw error;
                }
            );
    }


    @action addNewPlayer(newPlayer) {
        return fetch('http://localhost:3000/players/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                playerName : newPlayer.playerName,
                playerCardOne : newPlayer.playerCards[0].value.toString(),
                playerCardTwo : newPlayer.playerCards[1].value.toString(),
                playerCardThree : newPlayer.playerCards[2].value.toString(),
                playerCardFour : newPlayer.playerCards[3].value.toString()
            })
          }).then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(json => {
                        console.log(json);
                        this.fetchPlayers();
                    });

                } else {
                    this.error = "Error on fetching";
                }
            })
            .catch(
                error => {
                    this.error = "Error on fetching";
                    throw error;
                }
            );
    }



    @action deletePlayer(playerName) {
        return fetch('http://localhost:3000/players/delete/' + playerName, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },

        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(json => {
                        console.log("player deleted");
                         this.fetchCats();
                    });

                } else {
                    this.error = "Error on fetching";
                }
            })
            .catch(
                error => {
                    this.error = "Error on fetching";
                    throw error;
                }
            );
    }

    @action editPlayer(editPlayer) {
        return fetch('http://localhost:3000/players/edit/' + editPlayer.playerName, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                playerName : editPlayer.playerName,
                playerCardOne : editPlayer.playerCards[0].value,
                playerCardTwo : editPlayer.playerCards[1].value,
                playerCardThree : editPlayer.playerCards[2].value,
                playerCardFour : editPlayer.playerCards[3].value
            })
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    response.json().then(json => {
                        console.log("Player updated");
                         this.fetchPlayers();
                    });

                } else {
                    this.error = "Error on fetching";
                }
            })
            .catch(
                error => {
                    this.error = "Error on fetching";
                    throw error;
                }
            );
    }
}
const store = new CardStore();

export default store;
