<template>
  <div class='startpage'>
  <img id="backgr" src= "@/assets/background.jpg">
  <h1 id="startHead"> {{uiLabels.welcomeSite}} </h1>
  <div id="flags">
    <button id='langButton' v-on:click='switchLang()'>
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_en' src= '@/assets/englishflag.jpg' width="30px" height="20px">
      <img id='langPic' v-on:click='switchFlag()' v-if='flag_sv' src= '@/assets/swedishflag.jpg' width="30px" height="20px">
    </button>
  </div>
  <div id = "buttons">
    <div class = "buttonEh">
      <button class="startButtons" type="button" onclick="window.location = '/#/';" > {{uiLabels.eatHere}}  </button>
    </div>
    <div class = "buttonEa">
      <button class="startButtons" type="button" onclick="window.location = '/#/';" > {{uiLabels.eatAway}} </button>
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
      }
    },
    methods: {
    }
  }
  </script>

<style>

#backgr{
  position: relative;
  left: 0px;
  top: 0px;
  width:100%;
  height:100%;
  opacity:0.85;
}

.startButtons {
    background-color: #white;
    border-radius: 20px;
    border: 5px solid grey;
    color: black;
    font-size: 16pt;
    font-variant: small-caps;
    padding: 10px;
    text-align: center;
  }

#buttons {
  position: absolute;
  display: grid;
  bottom: 300px;
  left: 550px;
  grid-gap: 30px;
  grid-template-columns:25% 25%;
  justify-content: center;
}
.buttonEh{
  grid-column: 1;
  grid-row: 2;
}
.buttonEa{
  grid-column: 2;
  grid-row: 2;
}

#startHead {
  position: absolute;
  top: 180px;
  left: 300px;
  font-family: 'Special Elite';
  font-style: bold;
  font-weight: 550;
  font-display:swap ;
  font-size: 50pt;
  color: black;
  font-variant: small-caps;
  margin:inherit;
  width: auto;
}

#langButton{
  position: absolute;
  right: 50px;
  top: 50px;
  background: transparent;
  border-color: transparent;
  }

</style>
