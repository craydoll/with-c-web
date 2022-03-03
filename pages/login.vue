<template>
  <div class="container">
    <firebase-auth :success-url="nextUrl" />
  </div>
</template>

<script>
import FirebaseAuth from '@/components/firebaseAuth'

export default {
  components: {
    FirebaseAuth,
  },
  fetch () {
    console.log('in login')
  },
  data () {
    return {
      message: '',
      level: 'success',
      nextUrl: '/'
    }
  },
  async mounted () {
    console.log('in login:mounted')
    this.message = this.$route.query.mes
    if (this.$route.query) {
      const path = this.$router.resolve({
        name: 'index',
        query: this.$route.query
      }).href
      console.log('nextUrl=', path)
      this.nextUrl = path
    }
    return await this.$store.dispatch('auth/logout')
  }
}
</script>
