<template>
  <div id="orders">


    <div id="fixedCategoryTab">
      <button id='langButton' v-on:click='switchLang()'>
        <img id='langPic' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
        <img id='langPic' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
      </button>

      <button id="backButton" type="button" onclick="window.location = '/#/kitchen';"> {{uiLabels.goBack}} </button>


    </div>    <div class = "row" align = "left">

      <div class = "column left">
    <h1>{{ uiLabels.ordersFinished }}</h1>
    <div>
      <OrderItemToPrepare
              v-for="(order, key) in orders"
              v-if="order.status === 'done'"
              :order-id="key"
              v-on:back="markBack(key)"
              :order="order"
              :lang="lang"
              :ui-labels="uiLabels"
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
      markBack: function (orderid){
        this.$store.state.socket.emit("orderStarted", orderid);
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
    color: black;
    display: flex;
    height: 90%;
  }
  .column {
    border: solid #5a1800;
    border-width: 5px;
    margin: -1px;
    padding: 20px;
    height: 1000px;
  }

  .left {
    width: 100%;
    float: left;
    overflow: scroll;
  }

  #backButton {
    margin-left:90%;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    background-color: #grey;
    border-radius: 5px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    flex: 1 0 0;
  }
  #langPic {
    height: 100%;
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
</style>
