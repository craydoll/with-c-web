<template>
  <div>
    <NuxtLink v-if="loggedin" class="el_btn el_btn__arrowRight" to="/recSetting">測定スタート</NuxtLink>
    <div v-else class="el_btn el_btn__arrowRight" @click="login">ログインして測定</div>
  </div>
</template>
<script>
export default {
  props: {
    loggedin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  methods: {
    login() {
      console.log('in loginButton')
      this.$emit('login')
    }
  }
}
</script>
