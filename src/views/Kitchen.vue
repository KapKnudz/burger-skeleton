<template>
  <div id="orders">

    <div id="fixedCategoryTab">
    <button id='langButton' v-on:click='switchLang()'>
      <img id='langPic' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
      <img id='langPic' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
    </button>

      <button id="stockButtons" type="button" onclick="window.location = '/#/stock';"> {{uiLabels.stockCurrent}} </button>
    <button id="backButtons" type="button" onclick="window.location = '/#/';"> {{uiLabels.goBack}} </button>
      <button id="doneordersButtons" type="button" onclick="window.location = '/#/doneorders';"> {{uiLabels.doneorders}} </button>


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
    methods: {
      markDone: function (orderid) {
        this.$store.state.socket.emit("orderDone", orderid);
      },
      markStarted: function (orderid) {
        this.$store.state.socket.emit("orderStarted", orderid);
      },
      markBack: function (orderid){
        this.$store.state.socket.emit("orderNotStarted", orderid);
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

  #stockButtons {
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    text-transform: uppercase;
    text-align: center;
    margin-left: 10%;
    margin-right: 1em;
    font-family: 'Montserrat', sans-serif;
    flex: 1 0 0;
  }

  #backButtons {
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    text-transform: uppercase;
    text-align: center;
    margin-left: 10%;
    margin-right: 1em;
    font-family: 'Montserrat', sans-serif;
    flex: 1 0 0;
  }
  #doneordersButtons {
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 10%;
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
