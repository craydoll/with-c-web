<template>
<div>
  <body>
    <main>
      <Fv :loggedin="isLoggedIn"/>
      <HowTo/>
      <section class="ctaArea bgc_br">
        <div class="ly_contInner flx">
          <div class="ctaArea_chr flx">
            <p class="el_bubble">
              ホッホッホッ<br />使い方が分かったら<br />さっそく<span>測定</span>じゃ！
            </p>
            <img src="assets/img/chr/fig_chr_shougun_top.png" alt="" />
          </div>
          <div class="ctaArea_btn el_btn_location">
            <p class="el_deco_bracket">キミの集中力レベルは？</p>
            <RecordButton :loggedin="isLoggedIn" @login="pressLogin"/>
          </div>
        </div>
      </section>

      <AboutRecording/>
      <AboutPoint/>

      <section class="ctaArea bgc_br">
        <div class="ly_contInner flx">
          <div class="ctaArea_chr flx">
            <p class="el_bubble">
              オホホホホ<br />
              さっそく<span>集中力</span>を<br />
              測るでありんす！
            </p>
            <img
              class="adjust_chrSize w40"
              src="assets/img/chr/fig_chr_hime.png"
              alt="エコ姫（えこひめ）"
            />
          </div>
          <div class="ctaArea_btn el_btn_location">
            <p class="el_deco_bracket">キミの集中力レベルは？</p>
            <RecordButton :loggedin="isLoggedIn" @login="pressLogin"/>
          </div>
        </div>
      </section>
      <Charactors />
      <Contacts/>
    </main>
  </body>
</div>
</template>
<script>

import Fv from '@/components/contents/firstView'
import HowTo from '@/components/contents/howTo'
import AboutRecording from '@/components/contents/aboutRecording'
import AboutPoint from '@/components/contents/aboutPoint'
import Charactors from '@/components/contents/charactorsIntro'
import Contacts from '@/components/contents/contContacts'
import RecordButton from '@/components/recordButton'

export default {
  name: 'IndexPage',
  components: {
    Fv,
    HowTo,
    AboutRecording,
    AboutPoint,
    Charactors,
    Contacts,
    RecordButton
  },
  layout: 'protected',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
      isLoggedIn: false,
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
  },
  methods: {
    pressLogin() {
      console.log('in pressLogin')
      this.$nuxt.$emit('showLoginModal')
    }
  }
}
</script>