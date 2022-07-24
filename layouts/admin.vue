<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="#c9bc9c" scroll-target="#body">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <NuxtLink to="/"><img src="/assets/img/logo/logo.svg" alt="withプラス" /></NuxtLink>
      <v-app-bar-title class="text-h3">
        管理システム
      </v-app-bar-title>
              <v-spacer></v-spacer>
    </v-app-bar>
    <v-main id="#body">
      <v-container fluid class="ma-0 pa-0">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  name: 'DefaultLayout',
  middleware: 'adminAuth',
  data() {
    return {
      drawer: false,
      miniVariant: false,
      clipped: true,
      items:[
        {title:'景品登録',to:'/productList',icon:'mdi-shopping'},
        {title:'ユーザー登録',to:'/userList',icon:'mdi-account-group'},
        {title:'キャラクタ登録',to:'/avatarList',icon:'mdi-cat'},
        {title:'会場登録',to:'/placeList',icon:'mdi-home-city'},
      ]
    }
  },
  async mounted() {
    this.$adobeFonts(document)
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    console.log('user is ' + JSON.stringify(this.user))
    // ログインしている場合
    if (this.isLoggedIn) {
      if (this.user !== null) {
        // ユーザー登録されている場合
        this.avatar = this.user.avatar
      } else {
        // まだユーザー登録されていない
        this.showProfile = true
      }
    }
  },
  methods: {
    modalClosed(avatar) {
      this.showProfile = false
      if (avatar) {
        this.avatar = avatar
      }
      location.reload();
    },
    loginBtn() {
      console.log('in loginBtn')
      this.showLogin = true
    }
  }
}
</script>
<style scoped>
html {
  font-size: 16px
}
</style>