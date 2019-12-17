<template>
<div class="ingredient">
  <label>

    {{item["ingredient_"+ lang]}}<br> {{item.selling_price}}:- <br> {{item.stock}} pcs
  </label>
  <div class="gridBackground">
    <button class="minusButton" type="button" v-if="moreThanZeroOrders===false" v-on:click="decreaseCounter">-</button>
<div class="counterClass">
 {{ this.counter }}
</div>
    <button v-on:click="incrementCounter">+</button>
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
.ingredient {

}
.gridBackground {
  display:flex;
  justify-content: space-evenly;
  font-size: 1.1em;
  padding:1em;
  color: black;

}
.minusButton {
width:2em;
}
.counterClass {

}
</style>
