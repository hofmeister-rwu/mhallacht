//Classes that make up the Board Game
class Card {
    constructor(value,id) {
        this.value = value;
        this.id= id;
    }
}class Deck {
    constructor() {
        this.cards = [];
        this.roleCards = [];
    }
    createDeck() {
        let values = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, "show", "swap", "show", "swap", "show", "swap","end","skip","double"];
        let id =0;
        for (let j = 0; j < values.length; j++) {
          for (let i=0; i < 4; i++){
              this.cards.push(new Card(values[j],id));
              id++;
          }
        }
        let roles = ["abenteurer", "haendler", "alter-mann", "wanderer", "kobold", "prediger", "gottheit", "buerokrat", "koenig", "fremdling", "jaeger", "oberhaupt"];
        //let roles =["kobold","kobold","kobold","kobold","kobold","kobold","kobold"];
        for (let i = 0; i < roles.length; i++) {
              this.roleCards.push(roles[i]);
        }
    }

    shuffleDeck() {
       let location1, location2, tmp;
       for (let i = 0; i < 2000; i++) {
           location1 = Math.floor((Math.random() * this.cards.length));
           location2 = Math.floor((Math.random() * this.cards.length));
           tmp = this.cards[location1];
           this.cards[location1] = this.cards[location2];
           this.cards[location2] = tmp;


           location1 = Math.floor((Math.random() * this.roleCards.length));
           location2 = Math.floor((Math.random() * this.roleCards.length));
           tmp = this.roleCards[location1];
           this.roleCards[location1] = this.roleCards[location2];
           this.roleCards[location2] = tmp;
        }
    }
}class Player {
    constructor(name, role) {
        this.playerName = name;
        this.playerCards = [];
        this.playerValue;
        this.playerRole = role;
        this.roleActive = true;
    }
}class Board {
    constructor() {
        this.cardsInMiddle = [];
        this.usedCards = [];
        this.players = [];
    }
    start(playerNames) {
        let d = new Deck();
        d.createDeck();
        d.shuffleDeck();
        for (let i = 0; i < playerNames.length; i++) {
          let role = d.roleCards.splice(0,1)
          this.players.push(new Player(playerNames[i],role[0]));
          if(role[0]=="abenteurer"){
              this.players[i].playerCards = d.cards.splice(0, 5);
          }else{
            this.players[i].playerCards = d.cards.splice(0, 4);
          }
        }
        this.cardsInMiddle=d.cards;
    }
    load(playersDB, middleDB, usedDB) {
      console.log(playersDB);
      this.players.length=0;
      for (let i = 0; i < playersDB.length; i++) {
          this.players.push(new Player(playersDB[i].playerName));
          var cardOne =  new Card(playersDB[i].playerCardOne,playersDB[i].playerName+"-Card-One");
          var cardTwo =  new Card(playersDB[i].playerCardTwo,playersDB[i].playerName+"-Card-Two");
          var cardThree =  new Card(playersDB[i].playerCardThree,playersDB[i].playerName+"-Card-Three");
          var cardFour =  new Card(playersDB[i].playerCardFour,playersDB[i].playerName+"-Card-Four");
          if(playersDB[i].playerCardFive != ""){
            var cardFive =  new Card(playersDB[i].playerCardFive,playersDB[i].playerName+"-Card-Five");
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour,cardFive];
          }else{
            this.players[i].playerCards=[cardOne,cardTwo,cardThree,cardFour];
          }
          this.players[i].playerRole = playersDB[i].playerRole;
      }
      this.cardsInMiddle.length =0;
      for (let i = 0; i < middleDB.length; i++) {
         this.cardsInMiddle.push(new Card (middleDB[i].value,middleDB[i].idCard));
      }
      this.usedCards.length =0;
      for (let i = 0; i < usedDB.length; i++) {
         this.usedCards.push(new Card (usedDB[i].value,usedDB[i].idCard));
      }
    }
}
