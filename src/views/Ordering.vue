<template>
<div id="ordering">
  <div class="startpage-container">
    <div class='startpage'>
      <h1 id="startHead"> {{uiLabels.welcomeSite}} </h1>
    </div>
  </div>

  <div id="placeOrderBox">
    <div v-for="ingredCounter in countAllIngredients" v-if="ingredCounter.count>0" :key="countAllIngredients.indexOf(ingredCounter)">
      {{ingredCounter.name}}: {{ingredCounter.count}} {{uiLabels.parts}},
    </div>
    {{uiLabels.totalPrice}}: {{price}} kr
    <button id="placeOrderButton" type="button" v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
  </div>

  <div id="fixedCategoryTab">

    <button id='langButton' v-on:click='switchLang()'>
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
    </button>

    <button id="backButtons" type="button" onclick="window.location = '/#/start';"> {{uiLabels.goBack}} </button>

    <div class="categoryList">
      <button v-on:click="changeCategory(1)"> {{uiLabels.categoryMeat}} </button>
      <button v-on:click="changeCategory(2)"> {{uiLabels.categorySides}}</button>
      <button v-on:click="changeCategory(3)"> {{uiLabels.categorySauce}} </button>
      <button v-on:click="changeCategory(4)"> {{uiLabels.categoryBread}}</button>
    </div>
  </div>


  <h1>{{ uiLabels.ingredients }}</h1>

  <div id="ingredientBox">
    <Ingredient ref="ingredient" v-for="item in ingredients" v-show="item.category===currentCategory" v-on:increment="addToOrder(item)" v-on:decrease="reduceOrder(item)" :count="item.counter" :item="item" :categoryNumber="currentCategory"
      :lang="lang" :key="item.ingredient_id">
    </Ingredient>
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
  mixins: [sharedVueStuff],
  // include stuff that is used in both
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
      this.chosenIngredients.splice(this.chosenIngredients.indexOf(item), 1);
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
.startpage-container {
  text-align: center;
}
.startpage {
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('~@/assets/background.jpg');
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  text-transform: uppercase;
  text-align: center;
}
#placeOrderBox {
  position: fixed;
  font-size: 24px;
  color: white;
  text-align:center;
  display:block;
  box-sizing:border-box;
  height: 10em;
  margin-top:5em;
  margin-left:50em;
  border-top:1px solid rgb(196, 196, 196);
  border-left: 1px solid rgb(196, 196, 196);
}

#placeOrderButton{
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
}

#backButtons {
  margin-left:97%;
  text-align: center;
  display: inline-flex;
  justify-content: center;

}
#langButton {
  position: absolute;
  top: 30px;
  right: 50px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: transparent;
}
#langPic {
    height: 100%;
  }
.categoryList {
  display: flex;
  flex-direction: row;
  border-color:white;
  margin-top:-1.3em;
}
.categoryList button {
  color: #FFFFFF;
  width: 150px;
  padding: 40px;
  opacity:0.6;
  background: black;
  border-radius:5em;
  font-size: 1em;
}
.categoryList button:hover {
  box-shadow: 0 20px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  background-color: green;
  color: white;
}
#ingredientBox {
  display: flex;
  flex-flow:row wrap;
  font-size: 1.1em;
  width:10em;
}
.example-panel {
  background-image: url('~@/assets/exampleImage.jpg');
  width: 18em;
  z-index: 2;
}
.ingredient {
  border: 3px solid #ccd;
  padding: 0.8em;
  color: white;
  background-image: url('~@/assets/exampleImage.jpg');
}

</style>
