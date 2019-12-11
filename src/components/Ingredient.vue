<template>
<div class="ingredient">
  <label>

    {{item["ingredient_"+ lang]}}, {{item.selling_price}}:-, {{item.stock}} pcs
  </label>
  <div class="gridBackground">
    <button v-if="moreThanZeroOrders===false" v-on:click="decreaseCounter">
      <img v-on:click: src="@/assets/minus_sign.png" width=25px;>
    </button>

    {{ this.counter }}

    <button v-on:click="incrementCounter">
      <img v-on:click: src="@/assets/plus_sign.jpg" width=25px;>
    </button>
  </div>


</div>
</template>
<script>
export default {
  name: 'Ingredient',
  props: {
    item: Object,
    lang: String,
    orderDoesNotExist: Boolean,
    moreThanZeroOrders: Boolean

  },
  data: function() {
    return {
      counter: 0,

    };
  },
  methods: {
    incrementCounter: function() {


      this.counter += 1;
      // sending 'increment' message to parent component or view so that it
      // can catch it with v-on:increment in the component declaration
      this.$emit('increment');

    },
    decreaseCounter: function() {
      if (this.counter > 0) {
        this.counter -= 1;
        this.$emit('decrease');
      }
    },
    resetCounter: function() {
      this.counter = 0;
    }
  }
}
</script>
<style scoped>
.gridBackground {
  margin-right: 0px;
  color: white;
  background-image: url('~@/assets/exampleImage.jpg');


}

#counterBackground {

}
</style>
