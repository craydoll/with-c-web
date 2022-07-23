<template>
  <body>
    <main class="user">
      <section>
        <div class="ly_contInner ly_contInner_bg">
          <h2 class="cmp_heading_05">利用者一覧</h2>
          <div class="scroll">
            <v-data-table
              class="userList"
              :headers="fields"
              :items="userList"
              sort-by="id"
              fixed-header
              hide-default-footer
              disable-pagination
              :height="$vuetify.breakpoint.height - 350"
              @click:row="rowClicked"         
              >
                <template #[`item.img`]="data">
                  <v-img max-width="50px" :src="data.item.img" />
                </template>
            </v-data-table>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>
<script>
import Users from '@/plugins/firestore/users'
export default {
  layout: 'teacher',
  data() {
    return {
      fields: [
        { value: 'area', text: 'エリア' },
        { value: 'img', text: 'アバター' },
        { value: 'gender', text: '性別' },
        { value: 'name', text: '氏名' },
        { value: 'nickname', text: 'ニックネーム' },
      ],
      userList: [],
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    if (this.user) {
      this.userList = await Users.getAllItems()
    }
  },
  methods: {
    rowClicked(row) {
      this.$router.push({
        path: '/studyLog',
        query: {
          id: row.id,
        },
      })     
    }
  }
}
</script>

