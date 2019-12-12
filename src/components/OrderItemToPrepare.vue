<template>
  <!-- Note in this component that it is using another component -->
  <div>
    <OrderItem
            :ui-labels="uiLabels"
            :lang="lang"
            :order-id="orderId"
            :order="order">
    </OrderItem>

    
            <button class = "button" v-show = "order.status === 'started' || order.status === 'done'" @click="cancelOrder"> {{ uiLabels.cancelOrder }} </button>
            <button class = "button" v-show = "order.status === 'notStarted' || order.status === 'started'" @click="next"> {{ uiLabels.next }} </button>


          <button v-on:click="next">
            {{uiLabels.startOrder}}
          </button>


  </div>
    </template>
    <script>
      import OrderItem from '@/components/OrderItem.vue'

      export default {
        name: 'OrderItemToPrepare',
        components: { OrderItem },
        props: {
          uiLabels: Object,
          order: Object,
          orderId: String,
          lang: String
        },
        methods: {
          next: function () {
            // sending 'done' message to parent component or view so that it
            // can catch it with v-on:done in the component declaration
            this.$emit('next');

          },
          cancelOrder: function () {
            this.$emit('cancelOrder');
          }
        }
      }
    </script>
    <style scoped>
      .button {
        background-color: #df21db;
        border-radius: 15px;
        border: 3px solid #4cc742;
        color: black;
        font-size: 13px;
        font-variant: small-caps;
        text-align: center;
        display: inline-block;
      }

    </style>