<template>
  <div id="generator">
    <generator-type-selector v-if="generatorType"></generator-type-selector>

    <form>
      <div class="settings type-settings" v-if="generatorType && settings">
        <image-settings v-if="generatorType === 'image'"></image-settings>
        <grid-settings v-if="generatorType === 'grid'"></grid-settings>
        <template-settings v-if="generatorType === 'template'"></template-settings>
      </div>
      <common-settings class="settings common-settings"></common-settings>
    </form>

    <preview></preview>
  </div>
</template>

<script>
import generators from './../generators'
import commonSettings from './commonSettings.vue'
import preview from './preview.vue'
import generatorTypeSelector from './gridTypeSelector.vue'
import imageSettings from './imageSettings.vue'
import gridSettings from './gridSettings.vue'
import templateSettings from './templateSettings.vue'


export default {
  name: 'generator',
  components: {
    commonSettings,
    preview,
    generatorTypeSelector,
    gridSettings,
    imageSettings,
    templateSettings
  },
  mounted () {
    this.$store.dispatch('generateGrid')
  },
  data: function () {
    return {
    }
  },
  computed: {
    generatorType() {
      return this.$store.getters.getGeneratorType
    },
    commonSettings() {
      return this.$store.getters.getCommonSettings
    },
    settings() {
      return this.$store.getters.getSettings
    }
  },
  methods: {
  }
}
</script>

<style>
#generator {

}
form {
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px;
}
.settings, .setting {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.input {
  text-align: left;
  min-width: 200px;
  padding: 5px;
}
input {
  padding: 7px;
  width: 60px;
  margin: 10px
}
label, span {
  font-size: 1.3em;
  display: inline-block;
  height: 100%;
}
span {
  margin-left: 15px;
}
</style>