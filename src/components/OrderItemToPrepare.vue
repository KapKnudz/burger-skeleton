<template>
  <!-- Note in this component that it is using another component -->
  <div>
    <OrderItem
            :ui-labels="uiLabels"
            :lang="lang"
            :order-id="orderId"
            :order="order">
    </OrderItem>


            <button class = "button" v-show = "order.status === 'started' || order.status === 'done' || order.status === 'done'" @click="back"> {{ uiLabels.goBack }} </button>
            <button class = "button" v-show = "order.status === 'not-started' || order.status === 'started'" @click="next"> {{ uiLabels.next }} </button>


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
            this.$emit('next');

          },
          back: function () {
            this.$emit('back');
          }
        }
      }

    </script>
    <style scoped>


    </style>