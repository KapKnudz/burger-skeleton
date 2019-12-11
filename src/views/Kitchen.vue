<template>
  <div id="orders">

    <button v-on:click="switchLang()">{{ uiLabels.language }}</button>

    <div class = "column left">
      <div align = "left">
       
        <OrderItemToPrepare
                id = "order_in_que"
                v-for="(order, key) in orders"
                v-if="order.status !== 'done'"
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
      <div align = "right">
        <h1>{{ uiLabels.startedOrders }}</h1>
        <OrderItemToPrepare
                id = "started_orders"
                v-for="(order, key) in orders"
                v-if="order.status === 'started'"
                v-on:cancelOrder="markBack(key)"
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
        this.$store.state.socket.emit("startedOrder", orderid);
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
  }
</style>
