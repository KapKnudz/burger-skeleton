<template>
  <div class='startpage'>
  <div id="flags">
    <button id='langButton' v-on:click='switchLang()'>
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src= '@/assets/englishflag.jpg' width="30px" height="20px">
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src= '@/assets/swedishflag.jpg' width="30px" height="20px">
    </button>
  </div>
  <h1 id="startHead"> {{ uiLabels.startText}}</h1>
  <img id="backgr" src= "@/assets/background.jpg">

  <div class = "buttons">
    <div class = "buttonEh">
      <button class="startButtons" type="button" onclick="window.location = '/#/';" > {{uiLabels.eatHere}} </button>
    </div>
    <div class = "buttonEa">
      <button class="startButtons" type="button" onclick="window.location = '/#/';" > {{uiLabels.eatAway}} </button>
    </div>
  </div>

  <Ingredient
    ref="ingredient"
    v-for="item in ingredients"
    v-on:increment="addToOrder(item)"
    :item="item"
    :lang="lang"
    :key="item.ingredient_id">
  </Ingredient>
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
      }
    },
    methods: {
    }
  }
  </script>

<style>
#backgr{
  position: inherit;
  overflow:hidden;
  width:100%;
  height:100%;
  opacity:0.75;
}

.startButtons {
    background-color: #grey;
    border-radius: 50px;
    border: 5px solid grey;
    color: black;
    font-size: 12pt;
    font-variant: small-caps;
    padding: 10px 10px 10px 10px;
    margin: 0px 15px 15px 15px;
    text-align: center;
    display: inline-block;
  }

.buttons {
  display: grid;
  grid-gap: 30px;
  grid-template-columns:25% 25%;
  justify-content: center;
}
.buttonEh{
  grid-column: 1;
  grid-row: 1;
}
.buttonEa{
  grid-column: 2;
  grid-row: 1;
}

#flags{
  position: auto;
}


#startHead {
  font-family: "Snell Roundhand", cursive, sans-serif;
  font-size: 80pt;
  color: black;
  margin:100px;
  width: 40em;
}
#langButton{
  position: absolute;
  right: 50px;
  top: 50px;
  background: transparent;
  border-color: transparent;
  }

</style>
