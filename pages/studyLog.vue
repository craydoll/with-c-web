<template>
  <body>
    <main class="user_detail">
      <section>
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">利用者詳細</h2>
          <dl class="userName">
            <dt class="userName__ttl">利用者</dt>
            <dd class="userName__body">{{user.name}}</dd>
          </dl>
          <div class="user_record">
            <p class="user_record_ttl">学習記録</p>
            <ul class="recordBox_list">
              <li class="recordBox_item">
                <div v-if="!studyRecords.length">記録はありません</div>
                <div
                  v-for="(item, i) in studyRecords"
                  :key="i"
                  class="recordBox_term"
                >
                  <p class="recordBox_item_date_txt">
                    <span>{{item.start_date | format-date}}</span>
                  </p>
                  <p class="recordBox_item_subject" :class="item.subject">{{item.subject_nm}}</p>
                  <p class="recordBox_item_time">
                    <span>開始時間：{{item.start_date | format-time}}</span>
                    <span>終了時間：{{item.end_date | format-time}}</span>
                    <!-- ここはミリ秒 -->
                    <span>総学習時間：{{Math.round((item.end_date - item.start_date)/(60 * 1000))}}分</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="el_btn_location">
            <NuxtLink class="el_btn el_btn__lor record_screen_btn" to="/userList2">
              戻る
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>
<script>
import StudyRecords from '@/plugins/firestore/studyRecords'
import Users from '@/plugins/firestore/users'
export default {
  layout: 'teacher',
  data() {
    return {
      studyRecords: [],
      labels: [],
      data: [],
      totalTimes: [],
      user: {},
    }
  },
  async mounted() {
    // クエリよりユーザー取ってくる
    const id = this.$route.query.id
    if (id) {
    this.user = await Users.getItem(id)
    if (this.user) {
      this.studyRecords = await StudyRecords.getItems(this.user.id)
      this.totalTimes = await Users.getTotalBySubject(this.user.id)
      console.log('in mounted:' + JSON.stringify(this.totalTimes))
      this.totalTimes.forEach((item) => {
        this.labels.push(item.subject)
        // 時間は秒で保存されている
        this.data.push(item.time / 60)
      })
    }

    }
  },
}
</script>

