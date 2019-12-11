<template>
<div id="ordering">

<div id="fixedCategoryTab">

  <button id='langButton' v-on:click='switchLang()'>
    <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src= '@/assets/englishflag.jpg' width="30px" height="20px">
    <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src= '@/assets/swedishflag.jpg' width="30px" height="20px">
  </button>

  <div class="categoryList">
    <div class="categoryList-item-1"><button v-on:click="changeCategory(1)"> {{uiLabels.categoryMeat}} </button> </div>
    <div class="categoryList-item-2"><button v-on:click="changeCategory(2)"> {{uiLabels.categorySides}}</button></div>
    <div class="categoryList-item-3"> <button v-on:click="changeCategory(3)"> {{uiLabels.categorySauce}} </button></div>
    <div class="categoryList-item-4"> <button v-on:click="changeCategory(4)"> {{uiLabels.categoryBread}}</button></div>
  </div>
</div>


<h1 id="header"> {{uiLabels.welcomeSite}} </h1>
  <h1>{{ uiLabels.ingredients }}</h1>

  <div id="ingredientBox">
    <Ingredient ref="ingredient"
    v-for="item in ingredients"
    v-show="item.category===currentCategory"
    v-on:increment="addToOrder(item)"
    v-on:decrease="reduceOrder(item)"
    :count="item.counter"
    :item="item"
    :categoryNumber="currentCategory"
    :lang="lang"
    :key="item.ingredient_id">
    </Ingredient>
  </div>

  <div id="placeOrderBox">
  <!--  <h1>{{ uiLabels.order }}</h1> {{ chosenIngredients.map(item => item["ingredient_"+lang]).join(', ') }}, {{ price }} kr -->
  <div v-for="ingredCounter in countAllIngredients"
                     v-if="ingredCounter.count>0"
                     :key="countAllIngredients.indexOf(ingredCounter)">
                    {{ingredCounter.name}}: {{ingredCounter.count}} {{uiLabels.parts}},
                </div>
                {{uiLabels.totalPrice}}: {{price}} kr
    <button v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
  </div>

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
  computed: {
    countAllIngredients: function () {
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
    countNumberOfIngredients: function (id) {
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
/* scoped in the style tag means that these rules will only apply to elements, classes and ids in this template and no other templates. */
#langButton{
  position: absolute;
  right: 50px;
  top: 150px;
  background: transparent;
  border-color: transparent;
  }

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

#ingredientBox {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto auto;
  justify-content: space-evenly;
}

#placeOrderBox {
  position: fixed;
  display:block;
  box-sizing:border-box;
  top:250px;
  right:0;
  border: 3px solid #73AD21;
  color: green;
  font-family: "Trebuchet MS", Helvetica, sans-serif;
}
#fixedCategoryTab {
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

.categoryList {

  display: grid;
  grid-template-columns: auto auto auto auto;

}

.categoryList button {
  color: #FFFFFF;
  border-style:dashed;
  opacity: 0.9;
  width: 275px;
  padding: 50px;
  border-radius: 20px;
  background-color: black;
}

.categoryList button:hover {
  background-color: green;
  color: white;
}

.categoryList-item-1 {
  grid-column: 1;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}

.categoryList-item-2 {
  grid-column: 2;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}
.categoryList-item-3 {
  grid-column: 3;
  padding: 1px;
  font-size: 30px;
  text-align: center;
}
.categoryList-item-4 {
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
