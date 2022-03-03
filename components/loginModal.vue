<template>
    <v-dialog
      id="profile-modal"
      v-model="show"
      max-width="500"
      persistent
    >
  <v-card>
    <v-app-bar>
      <v-card-title>
        ログイン
      </v-card-title>
    </v-app-bar>
      <firebase-auth :success-url="nextUrl" />
  </v-card>
    </v-dialog>
</template>

<script>
import FirebaseAuth from '@/components/firebaseAuth'

export default {
  components: {
    FirebaseAuth,
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data () {
    return {
      message: '',
      level: 'success',
      show: false,
      nextUrl: '/'
    }
  },
  watch: {
    modalShow() {
      this.show = this.modalShow
    },
  },
  mounted () {
    if (this.$route.query) {
      const path = this.$router.resolve({
        name: 'index',
        query: this.$route.query
      }).href
      console.log('nextUrl=', path)
      this.nextUrl = path
    }
  }
}
</script>
