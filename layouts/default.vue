<template>
  <v-app>
    <v-app-bar app absolute prominent flat color="#c9bc9c">
      <div class="ly_headerInner header_flx">
        <v-spacer/>
        <v-app-bar-title>
          <a href=""><img src="assets/img/logo/logo.svg" alt="ロゴ" /></a>
        </v-app-bar-title>
        <v-spacer/>
        <nav class="max768_n">
          <ul class="header_nav">
            <li class="nav__item"><a href="">使い方</a></li>
            <li class="nav__item"><a href="">これまでの学習記録</a></li>
            <li class="nav__item"><a href="">ポイントについて</a></li>
            <li class="nav__item"><a href="">規約</a></li>
            <li class="nav__item"><a href="">お問合せ</a></li>
          </ul>
        </nav>
      </div>
        <v-spacer/>
        <div class="align-self-center">
        <v-btn name="profile" fab @click="showModal=true">
          <v-avatar size="62">
            
          </v-avatar>
        </v-btn>
        </div>
    </v-app-bar>
     <v-main>
      <v-container fluid class="ma-0 pa-0">
        <Nuxt />
      </v-container>
    </v-main>
  <ProfileModal
    :modal-show="showModal"
    @close="modalClosed"
  />
  </v-app>

</template>
<script>
import ProfileModal from '@/components/profileModal'
export default {
  name: 'DefaultLayout',
  components: {
    ProfileModal,
  },
  data() {
    return {
      isLogin: '',
      showModal: false
    }
  },
  head() {
    return {
      script: [
      { rel: 'stylesheet', type: 'text/css', href: '~assets/css/reset.css' },
      { rel: "stylesheet", type: "text/css", href: '~assets/css/style.css' },
      { rel: "stylesheet", type: "text/css", href: "https://use.fontawesome.com/releases/v5.6.1/css/all.css" }, 
      ],
      link: [
      ]
    }
  },

  mounted() {
    this.$adobeFonts(document)
  },
  methods: {
    modalClosed() {
      this.showModal = false
    }
  }
}
</script>
<style>
.v-application{
    font-family: "corporate-logo-ver2" !important;
}
.v-application a {color: #000;}
</style>