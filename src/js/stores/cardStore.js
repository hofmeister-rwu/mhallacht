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
    @observable circleUsedCard;
    @action.bound selectCircleUsedCard(card) {
        this.circleUsedCard = card;
    };
    @observable doubleCards=[];
    @action.bound selectDoubleCards(cardOne,cardTwo) {
        this.doubleCards.push(cardOne);
        this.doubleCards.push(cardTwo);
        console.log(this.doubleCards);
    };
    @observable wanderCards={};
    @action.bound selectWanderCard(card,player) {
        let tmp = Object.assign({}, this.wanderCards);
        tmp[player.playerName]=card;
        this.wanderCards=tmp;
    };

    @observable koboldVictim={};
    @action.bound selectKoboldVictim(player){
      this.koboldVictim = player;
      console.log(this.koboldVictim);
    }
    @action.bound unselectKoboldVictim(){
      this.koboldVictim = {};
    }

    @observable predigerVictim={};
    @action.bound predigerSelect(player){
      if(this.predigerVictim !=player && this.predigerVictim != {}){
        this.predigerCards=[];
      }
      this.predigerVictim = player;
    }
    @observable predigerCards=[];
    @action.bound predigerCardSelect(card){
      if(this.predigerCards.length < 2){
        this.predigerCards.push(card);
      }else{
        this.predigerCards[1]=this.predigerCards[0];
        this.predigerCards[0]=card;
      }
    }

    @action.bound unselectCards() {
        this.chosenCard = undefined;
        this.enemyCard=undefined;
        this.showCard=undefined;
        this.stackCard=undefined;
        this.circleUsedCard=undefined;
        this.doubleCards=[];
        this.wanderCards={};
        this.predigerVictim = {};
        this.predigerCards=[];

    };

    @observable error = '';
    @observable playersFromServer = [];
    @observable middleFromServer = [];
    @observable usedFromServer = [];
    @observable round = {value:undefined};

    @action.bound fetchSavings(){
      //this.fetchPlayers();
      //this.fetchMiddle();
      //this.fetchUsed();
      //this.fetchRound();
      this.fetchAll();
    }

    @action.bound fetchAll() {
        return fetch('http://localhost:3000/save/all', {
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
                        this.middleFromServer = json.cardsInMiddle;
                        this.usedFromServer = json.usedCards;
                        this.round = json.round[0];
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

    @action.bound fetchPlayers() {
        return fetch('http://localhost:3000/save/players', {
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

    @action.bound fetchMiddle() {
        return fetch('http://localhost:3000/save/middle', {
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
                        this.middleFromServer = json.cardsInMiddle;
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


    @action.bound fetchUsed() {
        return fetch('http://localhost:3000/save/used', {
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
                        this.usedFromServer = json.usedCards;
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

    @action.bound fetchRound() {
        return fetch('http://localhost:3000/save/round', {
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
                        this.round = json.round[0];
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

    @action.bound addPlayers(newPlayer) {
        return fetch('http://localhost:3000/save/save-all', {
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
              playerCardFour : newPlayer.playerCards[3].value.toString(),
              playerRole : newPlayer.playerRole,
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("player added");
                       this.fetchSavings();
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

    @action.bound addNewPlayer(newPlayer,active) {
        return fetch('http://localhost:3000/save/new', {
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
                playerCardFour : newPlayer.playerCards[3].value.toString(),
                playerRole : newPlayer.playerRole,
                activePlayer: active,
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("player added");
                       this.fetchSavings();
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

    @action.bound addNewAbenteurer(newPlayer,active) {
        return fetch('http://localhost:3000/save/new', {
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
                playerCardFour : newPlayer.playerCards[3].value.toString(),
                playerCardFive : newPlayer.playerCards[4].value.toString(),
                playerRole : newPlayer.playerRole,
                activePlayer: active,
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("player added");
                       this.fetchSavings();
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

    @action.bound addMiddleCard(newCard) {
        return fetch('http://localhost:3000/save/newMiddle', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                value: newCard.value.toString(),
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("MiddleCard added");
                       this.fetchSavings();
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


    @action.bound addUsedCard(newCard) {
        return fetch('http://localhost:3000/save/newUsed', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                value: newCard.value.toString(),
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("UsedCard added");
                       this.fetchSavings();
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

    @action.bound addRound(round) {
        return fetch('http://localhost:3000/save/newRound', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                value: round,
            })
          })
          .then(response => {
              if (response.status >= 200 && response.status < 300) {
                  response.json().then(json => {
                      console.log("Round added");
                       this.fetchSavings();
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

    @action.bound deleteAll() {
        return fetch('http://localhost:3000/save/delete/', {
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
                        console.log("everything deleted");
                         this.fetchSavings();
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
        return fetch('http://localhost:3000/save/edit/' + editPlayer.playerName, {
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
                         this.fetchSavings();
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
