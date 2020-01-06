<template>
  <div id="orders">

    <div id="fixedCategoryTab">
    <button id='langButton' v-on:click='switchLang()'>
      <img id='langPic' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
      <img id='langPic' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
    </button>

      <button id="doneordersButton" type="button" onclick="window.location = '/#/doneorders';"> {{uiLabels.doneorders}} </button>
      <button id="stockButton" type="button" onclick="window.location = '/#/stock';"> {{uiLabels.stockCurrent}} </button>
      <button id="backButton" type="button" onclick="window.location = '/#/';"> {{uiLabels.goBack}} </button>
      

    </div>
    <div class = "row" align = "center">
    <div class = "column left">
      <h1>{{ uiLabels.ordersInQueue }}</h1>


      <div align = "left">
        <OrderItemToPrepare
                id = "orders_in_queue"
                v-for="(order, key) in orders"
                v-if="order.status === 'not-started'"
                v-on:next="markStarted(key)"
                :order-id="key"
                :order="order"
                :ui-labels="uiLabels"
                :lang="lang"
                :key="key">
        </OrderItemToPrepare>
      </div>
    </div>

    <div class = "column right">
      <h1>{{ uiLabels.startedOrders }}</h1>
      <div align = "left">
        <OrderItemToPrepare
                id = "started_orders"
                v-for="(order, key) in orders"
                v-if="order.status === 'started'"
                v-on:back="markBack(key)"
                v-on:next="markDone(key)"
                :order-id="key"
                :order="order"
                :ui-labels="uiLabels"
                :lang="lang"
                :key="key">
        </OrderItemToPrepare>
      </div>
    </div>
</div>




  </div>
</template>
<script>
  import OrderItem from '@/components/OrderItem.vue'
  import OrderItemToPrepare from '@/components/OrderItemToPrepare.vue'

  //import methods and data that are shared between ordering and kitchen views
  import sharedVueStuff from '@/components/sharedVueStuff.js'

  export default {
    name: 'Ordering',
    components: {
      OrderItem,
      OrderItemToPrepare
    },
    mixins: [sharedVueStuff], // include stuff that is used in both
                              //the ordering system and the kitchen
    data: function(){
      return {
        chosenIngredients: [],
        price: 0
      }
    },
    computed: {
      countAllIngredients: function() {
        let ingredientTuples = []
        for (let i = 0; i < this.chosenIngredients.length; i += 1) {
          ingredientTuples[i] = {};
          ingredientTuples[i].name = this.chosenIngredients[i]['ingredient_' + this.lang];
          ingredientTuples[i].count = this.countNumberOfIngredients(this.chosenIngredients[i].ingredient_id);
        }
        let allIngredients = Array.from(new Set(ingredientTuples.map(arrayName => arrayName.name))).map(name => {
          return {
            name: name,
            count: ingredientTuples.find(arrayName => arrayName.name === name).count
          };
        });
        return allIngredients;
      }
    },
    methods: {
      markDone: function (orderid) {
        this.$store.state.socket.emit("orderDone", orderid);
      },
      markStarted: function (orderid) {
        this.$store.state.socket.emit("orderStarted", orderid);
      },
      markBack: function (orderid){
        this.$store.state.socket.emit("orderNotStarted", orderid);
      },
      placeOrder: function() {
        var i,
          //Wrap the order in an object
          order = {
            ingredients: this.chosenIngredients,
            price: this.price

          };
        // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
        this.$store.state.socket.emit('order', {
          order: order
        });

        //set all counters to 0. Notice the use of $refs
        for (i = 0; i < this.$refs.ingredient.length; i += 1) {
          this.$refs.ingredient[i].resetCounter();
        }
        this.price = 0;
        this.chosenIngredients = [];
        this.allIIngredients.clear
      },
      countNumberOfIngredients: function(id) {
        let counter = 0;
        for (var amountOfIngred in this.chosenIngredients) {
          //Now we have an array of ingredients in an order which is checked with the id that being sent from countAllIngredients in the call
          if (this.chosenIngredients[amountOfIngred].ingredient_id === id) {
            counter += 1;
          }
        }
        return counter;
      }
    }
  }



</script>
<style scoped>
  #orders {
    font-size:24pt;
  }

  h1 {
    text-transform: uppercase;
    font-size: 1.4em;
    color: dimgray;
  }
  .row {
    display: flex;
    height: 90%;
    color: black;
  }
  .column {
    border: solid #5a1800;
    border-width: 5px;
    margin: -1px;
    padding: 20px;
    height: 800px;
  }

  .left {
    width: 50%;
    float: left;
    overflow: scroll;
  }

  #stockButton {
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    text-transform: uppercase;
    text-align: center;
    margin-left: 20%;
    margin-right: 1em;
    font-family: 'Montserrat', sans-serif;
    flex: 1 0 0;
  }

  #backButton {
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    text-transform: uppercase;
    text-align: center;
    margin-left: 31%;
    margin-right: 1em;
    font-family: 'Montserrat', sans-serif;
    flex: 1 0 0;
  }
  #doneordersButton {
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 7%;
  margin-right: 1em;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
  }
  #langButton {
    position: absolute;
    top: 10px;
    left: 20px;
    padding: 0;
    margin: 0;
    background: transparent;
    border: transparent;
  }
  #langPic {
    height: 100%;
  }

</style>
