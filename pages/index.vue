<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>

<template>
  <div>
    <h1>{{ content.title }}</h1>
    <p>{{ content.description }}</p>
  </div>
</template>

<script>
export default {
  asyncData({$croct}) {
    return $croct.fetch('lp-preview-hero-section', {
      fallback: {
        title: 'Hello World',
        description: 'This is a subtitle'
      },
    });
  }
}
</script>
