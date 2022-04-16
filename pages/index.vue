<template>
<v-container fluid class="ma-0 pa-0">
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
            <nuxt-link class="el_btn el_btn__arrowRight" to="/measureConc">測定スタート</nuxt-link>
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
            <a class="el_btn el_btn__arrowRight" href="">測定スタート</a>
          </div>
        </div>
      </section>

      <section id="record">
        <div class="ly_contInner">
          <div class="recordBox">
            <h2 class="cmp_heading_01 el_deco_line">学習記録</h2>
            <div class="col2">
              <div class="col2_item">
                <h3 class="cmp_heading_04">学習総量</h3>
                <ul class="cmp_heading_03">
                  <li>算数：〇〇時間</li>
                  <li>国語：〇〇時間</li>
                  <li>社会：〇〇時間</li>
                  <li>理科：〇〇時間</li>
                </ul>
              </div>
              <div class="col2_item">
                <h3 class="cmp_heading_04">おすすめ勉強法</h3>
                <p class="cmp_heading_03">
                  テキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りますテキストが入りま
                </p>
              </div>
            </div>
            <h3 class="cmp_heading_04">これまでの学習記録</h3>
            <ul class="recordBox_list">
              <li
                v-for="(item, i) in studyRecords"
                :key="i"
                class="recordBox_item"
                >
                <p class="recordBox_item_time">{{item.date.toDate() | format-date}}</p>
                <p class="recordBox_item_subject">教科：{{item.subject}}  時間：{{item.study_hours | miliSecToTime}} 集中力：{{item.concentration}}</p>
              </li>
            </ul>
            <!-- グラフ -->
            <ChartContainer
              :labels="labels"
              :val="data"
            >
            </ChartContainer>
          </div>
        </div>
      </section>

      <Charactors />
      <Terms/>
      <Contacts/>
    </main>
    <footer class="bgc_br tac">
      <img class="footer_logo" src="assets/img/logo/logo.svg" alt="" />
    </footer>
  </body>
</v-container>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
import ChartContainer from '@/components/ChartContainer'

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
    ChartContainer,
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