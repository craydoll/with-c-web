<template>
  <div class="container">
    <v-toolbar flat color="white">
      <v-toolbar-title>その他ダウンロード</v-toolbar-title>
      <v-divider
        class="mx-4"
        inset
        vertical
      />
      <v-spacer />
    </v-toolbar>
    <ul>
      <li>
        全学習記録<v-btn @click="studyRecordsDl"> ダウンロード </v-btn>
      </li>
      <li>
        全カウント<v-btn @click="countingDl"> ダウンロード </v-btn>
      </li>
    </ul>
  </div>
</template>
<script>
import CsvUtil from '@/plugins/csvUtil'
import StudyRecords from '@/plugins/firestore/studyRecords'
import Counting from '@/plugins/firestore/counting'
import appError, { ApplicationError } from '@/plugins/firestore/appError'

export default {
  layout: 'admin',
  data() {
    return {
      message: '',
      level: 'info',
      loading: false,
    }
  },
  methods: {
    async studyRecordsDl() {
      try {
        this.loading = true
        const fields = [
          { key: 'user_nm', label: '氏名' },
          { key: 'start_date', label: '開始', type: 'date' },
          { key: 'end_date', label: '終了', type: 'date' },
          { key: 'subject_nm', label: '教科' },
          { key: 'point', label: 'ポイント' },
        ]

        const objList = await StudyRecords.getAllItems()
        const csv = CsvUtil.arrayToCsv(objList, fields)

        this.download(csv, 'CounterLogList.csv')
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          console.log('in Error')
          this.message =
            'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'otherDownload:counterDl')
        }
      } finally {
        this.loading = false
      }
    },
    async countingDl() {
      try {
        this.loading = true
        const fields = [
          { key: 'user_nm', label: '氏名' },
          { key: 'start_date', label: '開始', type: 'date' },
          { key: 'end_date', label: '終了', type: 'date' },
          { key: 'subject_nm', label: '教科' },
          { key: 'point', label: 'ポイント' },
        ]

        const objList = await Counting.getAllItems()
        const csv = CsvUtil.arrayToCsv(objList, fields)

        this.download(csv, 'CountingList.csv')
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          console.log('in Error')
          this.message =
            'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'otherDownload:counterDl')
        }
      } finally {
        this.loading = false
      }
    },
    download(csvFile, fileName) {
      const bom = new Uint8Array([0xef, 0xbb, 0xbf])
      const blob = new Blob([bom, csvFile], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileName
      link.click()
    },
  },
}
</script>
<style scoped>
html {
  font-size: 16px;
}
.v-data-table {
    font-size: 16px;
}
</style>
