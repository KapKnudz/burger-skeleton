<template>
  <div id="orders">
    <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
    <div class = "row" align = "left">

      <div class = "column left">
    <h1>{{ uiLabels.ordersFinished }}</h1>
    <div>
      <OrderItem
              v-for="(order, key) in orders"
              v-if="order.status === 'done'"
              :order-id="key"
              v-on:cancelOrder="markStarted(key)"
              :order="order"
              :lang="lang"
              :ui-labels="uiLabels"
              :key="key">
      </OrderItem>
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
</style>
