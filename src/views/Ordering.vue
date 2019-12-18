<template>
<div id="ordering">
  <button id='langButton' v-on:click='switchLang()'>
    <img id='langPic' v-if='flag_en' src='@/assets/englishflag.jpg' width="30px" height="20px">
    <img id='langPic' v-if='flag_sv' src='@/assets/swedishflag.jpg' width="30px" height="20px">
  </button>
  <div class="startpage-container">
    <div class='startpage'>
      <h1 id="startHead"> {{uiLabels.welcomeSite}} </h1>
    </div>
  </div>

  <div id="placeOrderBox">
    <div v-for="ingredCounter in countAllIngredients" v-if="ingredCounter.count>0" :key="countAllIngredients.indexOf(ingredCounter)">
     {{ingredCounter.name}}:  {{ingredCounter.count}}x
    </div>
    {{uiLabels.totalPrice}}: {{price}} kr
    <button id="placeOrderButton" type="button" v-on:click="placeOrderClick"> <span> {{ uiLabels.placeOrder }} </span> </button>
  </div>

  <modal id="deliveryModal" name="payment">
    <form>
      <p><label for="firstname">Full name</label><br>
        <input type="text" id="fullname" name="fn" required="required" placeholder="First- and Last Name" size="30"></p>
      <p><label for="email">Email address</label><br>
        <input type="email" id="email" name="em" required="required" placeholder="Skurk.skurksson@skurson.com" size="30"></p>
      <p><label for="Street">Street name</label><br>
        <input type="text" id="streetname" name="sn" placeholder="Street name" size="30"></p>
      <p><label for="House">House number</label><br>
        <input type="number" id="House" name="Ho" placeholder="House number"></p>
      <p><label for="paymentmethod">Payment method</label><br>
        <select id="paymentmethod" name="pmmt">
          <option>Credit card</option>
          <option>Swish</option>
          <option>Invoice (Klarna)</option>
          <option>Cash on delivery</option>
        </select></p>
      <p id="gender">
        <label for="gender">Please select your gender:</label><br>
        <input type="radio" name="gender" value="Female"> Female<br>
        <input type="radio" name="gender" value="Male"> Male<br>
        <input type="radio" name="gender" value="Do not wish to provide"> Undisclosed<br>
      </p>
      <button id="placeOrderButton" type="button" v-on:click="placeOrder()"> {{ uiLabels.placeOrder }} </button>
    </form>
  </modal>
  <modal id="eatHereModal" name="confirmation">
  <h2 id="modalHeader">  Order confirmation </h2>
  <div id="modalIngredients" v-for="ingredCounter in countAllIngredients" v-if="ingredCounter.count>0" :key="countAllIngredients.indexOf(ingredCounter)">
   {{ingredCounter.name}}:  {{ingredCounter.count}}x
  </div>
<div id="modalPrice">  {{uiLabels.totalPrice}}: {{price}} kr </div>
    <button id="placeOrderButtonModal" type="button" v-on:click="placeOrder()"> <span>{{ uiLabels.placeOrder }} </span> </button>
  </modal>



  <button id="backButtons" type="button" onclick="window.location = '/';"> {{uiLabels.goBack}} </button>

  <div class="all-ingredients">

    <div id="fixedCategoryTab">

      <div class="categoryList">
        <button v-on:click="changeCategory(1)"> {{uiLabels.categoryMeat}} </button>
        <button v-on:click="changeCategory(2)"> {{uiLabels.categorySides}}</button>
        <button v-on:click="changeCategory(3)"> {{uiLabels.categorySauce}} </button>
        <button v-on:click="changeCategory(4)"> {{uiLabels.categoryBread}}</button>
      </div>
    </div>


    <!-- <h1 id="ingredientTitle">{{ uiLabels.ingredients }}</h1>  HEADER FÖR INGERDIENTS-->
    <div class="ingredient-container">
      <div v-for="item in ingredients" class="ingredient-box" v-if="item.category===currentCategory">
        <Ingredient ref="ingredient" v-on:increment="addToOrder(item)" v-on:decrease="reduceOrder(item)" :count="item.counter" :item="item" :categoryNumber="currentCategory"
          :lang="lang" :key="item.ingredient_id">
        </Ingredient>
      </div>
    </div>

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
      displayOrder: false
    }
  },
  created: function() {
    this.$store.state.socket.on('orderNumber', function(data) {
      this.orderNumber = data;
    }.bind(this));
  },
  computed: {
    eatHome() {
      return this.$route.query.eat === 'home'
    },
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
    show (name) {
      this.$modal.show(name);
    },
    hide (name) {
      this.$modal.hide(name);
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

    placeOrderClick() {
      if (this.eatHome) {
        this.show('payment')
      }
      else {
        this.show('confirmation')
      }
    },
    confirmOrder() {
      this.hide('payment')
      this.show('confirmation')
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
  background: linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('~@/assets/background.jpg');
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
  font-size: 18px;
  font-variant: small-caps;
  background-color:lightgray;
  color: black;
  display:block;
  box-sizing:border-box;
  height: 36.5%;
  margin-top:8%;
  margin-left:80%;
  border-top:4px solid rgb(196, 196, 196);
  border-left: 4px solid rgb(196, 196, 196);
  border-bottom: 6px solid rgb(196, 196, 196);
  border-color:white;
  overflow-y:scroll;
}

#placeOrderButton{
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
}
#placeOrderButton span {
   cursor: pointer;
   display: inline-block;
   position: relative;
   transition: 0.4s;
 }
#placeOrderButton span:after {
   content: '\00bb';
   position: absolute;
   opacity: 0;
   top: 0;
   right: -20px;
   transition: 0.5s;
 }
 #placeOrderButton:hover span {
   padding-right: 25px;
 }
#placeOrderButton:hover span:after {
   opacity: 1;
   right: 0;
 }

#backButtons {
  margin-left:90%;
  text-align: center;
  display: inline-flex;
  justify-content: left;
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
}
#backButtons:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 30px 0 rgba(0,0,0,0.19);
  color: #a6a6a6;
  text-shadow: 3px 3px rgba(0,0,0,0.05);
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
.all-ingredients {
  margin-right: 400px;
  margin-bottom: 100px;
}
.categoryList {
  display: flex;
  flex-direction: row;

}
.categoryList button {
  background-color: #grey;
  border: 5px solid grey;
  font-variant: small-caps;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
  padding: 25px;
  border-top-right-radius:7em;
  border-top-left-radius:4em;
  border-top-style:groove;
  margin:0.05em;
  font-size: 1.3em;
}
.categoryList button:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 30px 0 rgba(0,0,0,0.19);
  color: #a6a6a6;
  text-shadow: 3px 3px rgba(0,0,0,0.05);
}
.ingredient-container {
  display: flex;
  flex-wrap: wrap;
}
.ingredient-box {
  text-align:center;
  font-variant: small-caps;
  padding:1em;
  width: 25%;
  display: flex;
}

.payment{
  color: black;
  padding: 20px;
}
/*.ingredient-container > .ingredientBox {
	display: flex;
	flex-wrap: wrap;
  text-align: center;
}
.ingredient-container > .ingredientBox > .ingredientBox {
	flex-grow: 1;
	width: 33%;
}
.ingredient-container > .ingredientBox> .ingredientBox :nth-child(even) {
}
.ingredient-container > .ingredientBox > .ingredientBox:nth-child(odd) {
}
*/
#deliveryModal {
  overflow-y:scroll;
  color:black;
}
#eatHereModal {
  max-height:100%;
  max-width:100%;
  color:black;
}

#modalHeader {
margin-left:28%;

}
#placeOrderButtonModal{
  background-color: #grey;
  border-radius: 5px;
  border: 5px solid grey;
  color: black;
  font-size: 16pt;
  text-transform: uppercase;
  text-align: center;
  margin-left:0%;
  margin-top:0%;
  font-family: 'Montserrat', sans-serif;
  flex: 1 0 0;
}
#placeOrderButtonModal span {
   cursor: pointer;
   display: inline-block;
   position: relative;
   transition: 0.4s;
 }
#placeOrderButtonModal span:after {
   content: '\00bb';
   position: absolute;
   opacity: 0;
   top: 0;
   right: -20px;
   transition: 0.5s;
 }
 #placeOrderButtonModal:hover span {
   padding-right: 25px;
 }
#placeOrderButtonModal:hover span:after {
   opacity: 1;
   right: 0;
 }
#modalIngredients {
font-size:1.2em;
}

#modalPrice {

}
.ingredient {
  border: 5px solid grey;
  padding: 0.8em;
  border-color:#grey;
  border-radius:2em;
  color: black;
  flex-grow: 1;
  background-color: white;
}
.allergiGluten {
  color:black;
}
.allergiLaktos {
  color:black;
}
.vegan {
  color:black;
}

</style>
