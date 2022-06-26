<template>
  <v-container>
  <h2 class="cmp_heading_01">規約</h2>
  <Terms/>
  </v-container>
</template>

<script>
import Terms from '@/components/contents/termsOfService'
export default {
  components: {
    Terms
  },  
  layout: 'protected',
}
</script>
