<template>
<body>
  <v-container>
    <v-select
      v-model="place"
      :items="placeList"
      item-text="name"
      item-value="id"
      label="交換場所"
      @change="getRows"
    />
    <v-switch
      v-model="status"
      color="red"
      label="受付済を含む"
      @change="getRows"      
    ></v-switch>
    <v-data-table
      :headers="fields"
      :items="rows"
      :item-class="rowClass"
      sort-by="id"
      fixed-header
      hide-default-footer
      disable-pagination
      :height="$vuetify.breakpoint.height - 300"
    >
      <template #top>
        <v-toolbar flat color="white">
          <v-toolbar-title>商品交換依頼一覧</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
        </v-toolbar>
      </template>
      <template #[`item.req_date`]="data">
        {{ data.item.req_date | format-date }}
      </template>
      <template #[`item.prize_nm`]="data">
        {{data.item.prize_nm}} <v-img width="50" :src="data.item.prize_img" />
      </template>
      <template #[`item.button`]="data">
        <v-btn @click="accept(data.item)">受付</v-btn>
        <v-btn @click="cancel(data.item)">取消</v-btn>
      </template>
      <template #no-data>
        明細はありません
      </template>
    </v-data-table>
  </v-container>
</body>
</template>
<script>
import PrizeExReq from '~/plugins/firestore/prizeExReq'
import Places from '~/plugins/firestore/places'
import appError, { ApplicationError } from '@/plugins/firestore/appError'

export default {
  layout: 'productAdmin',
  data () {
    return {
      dialog: false,
      fields: [
        { value: 'req_date', text: '申込日' },
        { value: 'user_nm', text: '氏名' },
        { value: 'place_nm', text: '交換場所' },
        { value: 'prize_nm', text: '商品' },
        { value: 'button', text: '処理' },
      ],
      rows: [],
      placeList: [],
      status: false,
      place: '',
      message: '',
      level: '',
    }
  },
  async mounted() {
    this.placeList = await Places.getAllItems()
    this.place = this.placeList[0].id
    await this.getRows()
  },
  methods: {
    async getRows () {
      try {
        console.log('in getRows')
        const ret = await PrizeExReq.getItemsByPlace(this.place, this.status)
        this.rows = ret
        this.message = ''
        return ret
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          this.message = 'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'notifyList:getRows')
        }
      }
    },
    accept(item) {
      
    },
    cancel(item) {

    },
    rowClass(item) {
      console.log(item)
      if (item.accepted) {
        return 'accepted'
      } 
    }
  }
}
</script>
<style>
.v-data-table {
    font-size: 16px;
}
.v-data-table .accepted {
  text-decoration: line-through;
  color: gray;
}
</style>
