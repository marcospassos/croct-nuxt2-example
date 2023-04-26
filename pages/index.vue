<template>
  <div>
    <h1>{{ banner.title }}</h1>
    <p>{{ banner.description }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>

<script>
export default {
  async asyncData({$croct}) {
    const post = await $croct.fetch('lp-preview-hero-section', {
      fallback: {
        title: 'Hello World',
        description: 'This is a subtitle'
      },
    });

    return {
      banner: post,
    }
  }
}
</script>
