<template>
<div>
  <body>
    <main>
      <Fv/>
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
            <nuxt-link class="el_btn el_btn__arrowRight" to="/record">測定スタート</nuxt-link>
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
            <NuxtLink class="el_btn el_btn__arrowRight" to="/record">測定スタート</NuxtLink>
          </div>
        </div>
      </section>
      <Charactors />
      <Terms/>
      <Contacts/>
    </main>
  </body>
</div>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'

import Fv from '@/components/contents/firstView'
import HowTo from '@/components/contents/howTo'
import AboutRecording from '@/components/contents/aboutRecording'
import AboutPoint from '@/components/contents/aboutPoint'
import Charactors from '@/components/contents/charactorsIntro'
import Terms from '@/components/contents/termsOfService'
import Contacts from '@/components/contents/contContacts'

import moment from '@/plugins/moment-ja'

export default {
  name: 'IndexPage',
  components: {
    Fv,
    HowTo,
    AboutRecording,
    AboutPoint,
    Charactors,
    Terms,
    Contacts
  },
  layout: 'protected',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    if (this.user) {
      this.studyRecords = await StudyRecords.getItems(this.user.id)
      this.labels = this.studyRecords.map((item) => {
        return moment(item.date.toDate()).format('MM/DD')
      })
      this.data = this.studyRecords.map((item) => {
        return item.concentration
      })
    } else {
      // ダミー
      this.labels = ['3/1','3/2','3/3','3/4','3/5']
      this.data = [50,74,68,70,78]
    }
  },
}
</script>