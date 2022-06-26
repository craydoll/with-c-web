<template>
    <main class="record">
      <div class="ly_contInner ly_contInner_bg">
        <h2 class="cmp_heading_05 el_deco_line">学習記録</h2>
        <section id="record">
          <div class="ly_contInner">
            <div class="recordBox">
              <div class="col2">
                <div class="col2_item">
                  <h3 class="cmp_heading_04">学習総量</h3>
                  <ul class="cmp_heading_03">
                    <li
                      v-for="(item, i) in totalTimes"
                      :key="i"
                    >{{item.subject}}：{{item.totalTime}}時間</li>
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
                  <p class="recordBox_item_time">{{item.start_date | format-date}} {{item.start_date | format-time}} ～ {{item.end_date | format-time}}</p>
                  <p class="recordBox_item_subject">教科：{{item.subject}}  ポイント：{{item.point}}</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
export default {
  layout: 'protected',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
      totalTimes: [],
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    this.studyRecords = await StudyRecords.getItems(this.user.id)
    this.totalTimes = await StudyRecords.getTotalBySubject(this.user.id)
    console.log('in mounted:' + JSON.stringify(this.studyRecords))
  },
}
</script>

