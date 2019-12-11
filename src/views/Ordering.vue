<template>
<div id="ordering">

<div id="head">
  <button v-on:click="switchLang()">{{ uiLabels.language }}</button>
  <div class="hamburgerIngredients">
    <div class="grid-button-item-1"><button v-on:click="changeCategory(1)"> KÖTT </button> </div>
    <div class="grid-button-item-2"><button v-on:click="changeCategory(2)"> PÅLÄGG </button></div>
    <div class="grid-button-item-3"> <button v-on:click="changeCategory(3)"> SÅS </button></div>
    <div class="grid-button-item-4"> <button v-on:click="changeCategory(4)"> BRÖD </button></div>
  </div>
</div>

</br>

<h1 id="header"> Välkomna till skurknästet </h1>
  <h1>{{ uiLabels.ingredients }}</h1>

  <div id="gridInner">
    <Ingredient ref="ingredient"
    v-for="item in ingredients"
    v-show="item.category==currentCategory"
    v-on:increment="addToOrder(item)"
    v-on:decrease="reduceOrder(item)"
    :item="item"
    :categoryNumber="currentCategory"
    :lang="lang"
    :key="item.ingredient_id">
    </Ingredient>
  </div>

  <div id="test">
    <h1>{{ uiLabels.order }}</h1> {{ chosenIngredients.map(item => item["ingredient_"+lang]).join(', ') }}, {{ price }} kr
    <button v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
  </div>
  <h1>{{ uiLabels.ordersInQueue }}</h1>
  <div>
    <OrderItem v-for="(order, key) in orders" v-if="order.status !== 'done'" :order-id="key" :order="order" :ui-labels="uiLabels" :lang="lang" :key="key">
    </OrderItem>
  </div>


</div>
</template>
<script>
//import the components that are used in the template, the name that you
//use for importing will be used in the template above and also below in
//components
import Ingredient from '@/components/Ingredient.vue'
import OrderItem from '@/components/OrderItem.vue'

//import methods and data that are shared between ordering and kitchen views
import sharedVueStuff from '@/components/sharedVueStuff.js'

/* instead of defining a Vue instance, export default allows the only
necessary Vue instance (found in main.js) to import your data and methods */
export default {
  name: 'Ordering',
  components: {
    Ingredient,
    OrderItem
  },
  mixins: [sharedVueStuff], // include stuff that is used in both
  // the ordering system and the kitchen
  data: function() { //Not that data is a function!
    return {
      chosenIngredients: [],
      price: 0,
      orderNumber: "",
      currentCategory: 1,
      hamburgerButtons: false,
      displayOrder: false
    }
  },
  created: function() {
    this.$store.state.socket.on('orderNumber', function(data) {
      this.orderNumber = data;
    }.bind(this));
  },
  methods: {
    showBurger: function(boolean) {
      this.hamburgerButtons = boolean;
    },

    showOrder: function(boolean) {
      this.displayOrder = boolean;
    },

    changeCategory: function(int) {
      this.currentCategory = int;
    },

    addToOrder: function(item) {
      this.chosenIngredients.push(item);
      this.price += +item.selling_price;
    },

    reduceOrder: function(item) {
      this.chosenIngredients.splice(item, 1);
      this.price += -item.selling_price;
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
    }
  }
}
</script>
<style scoped>
/* scoped in the style tag means that these rules will only apply to elements, classes and ids in this template and no other templates. */

#ordering {
  width: 40em;
}

#header {
  color: green;
  font-family: "Trebuchet MS", Helvetica, sans-serif;
  font-size: 50px;
  font-style: italic;
  position: relative;
  top:85px;
  left: 450px;
}

#gridInner {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto auto;
  justify-content: space-evenly;
}

#test {
  position: fixed;
  top:0;
  right:0;
  border: 3px solid #73AD21;
  color: green;
  font-family: "Trebuchet MS", Helvetica, sans-serif;
}
#head {
position: fixed;
top: 0;
right: 0;
left: 0;
z-index: 101;
background-color:black;
}

.example-panel {
  position: fixed;
  background-image: url('~@/assets/exampleImage.jpg');
  width: 200px;
  left: 0;
  top: 0;
  z-index: 2;
}

.hamburgerIngredients {

  display: grid;
  grid-template-columns: auto auto auto auto;

}

.hamburgerIngredients button {
  color: #FFFFFF;
  border-style:dashed;
  opacity: 0.9;
  width: 275px;
  padding: 50px;
  border-radius: 20px;
  background-color: black;
}

.hamburgerIngredients button:hover {
  background-color: green;
  color: white;
}

.grid-button-item-1 {
  grid-column: 1;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}

.grid-button-item-2 {
  grid-column: 2;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}
.grid-button-item-3 {
  grid-column: 3;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}
.grid-button-item-4 {
  grid-column: 4;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}


.ingredient {
  border: 3px solid #ccd;
  padding: 10px;
  color: white;
  font-family: "Trebuchet MS", Helvetica, sans-serif;
  background-image: url('~@/assets/exampleImage.jpg');
}
</style>
