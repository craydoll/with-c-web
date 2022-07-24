<template>
<body>
  <v-container>
    <v-data-table
      :headers="fields"
      :items="rows"
      sort-by="id"
      fixed-header
      hide-default-footer
      disable-pagination
      :height="$vuetify.breakpoint.height - 350"
    >
      <template #top>
        <v-toolbar flat color="white">
          <v-toolbar-title>会場一覧</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-dialog v-model="dialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn
                color="green"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                新規登録
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field v-model="editedItem.name" label="名称" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.address" label="住所" />
                  </v-row>
                  <v-row>
                    <v-text-field v-model="editedItem.mail" label="通知先メール" />
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="close">
                  キャンセル
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.edit`]="data">
        <v-icon
          small
          class="mr-2"
          @click="editItem(data.item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(data.item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #[`item.avatar`]="data">
        <v-img width="50" :src="data.item.img" />
      </template>
      <template #[`item.isAdmin`]="data">
        <v-icon
          v-if="data.item.isAdmin"
          class="mr-2"
        >mdi-account-wrench</v-icon>
        <v-icon
          v-if="data.item.isTeacher"
          class="mr-2"
        >mdi-account-school</v-icon>
      </template>
      <template #no-data>
        明細はありません
      </template>
    </v-data-table>
  </v-container>
</body>
</template>
<script>
import Places from '@/plugins/firestore/places'
import appError, { ApplicationError } from '@/plugins/firestore/appError'

export default {
  layout: 'admin',
  data () {
    return {
      dialog: false,
      fields: [
        { value: 'edit', text: '編集' },
        { value: 'name', text: '名称' },
        { value: 'address', text: '住所' },
        { value: 'mail', text: '通知先メール' },
      ],
      rows: [],
      editedItem: {},
      defaultItem: {},
      editedIndex: -1,
      message: '',
      level: '',
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新規登録' : '編集'
    }
  },
  async mounted () {
    await this.getRows()
  },
  methods: {
    async getRows () {
      try {
        console.log('in getRows')
        const ret = await Places.getAllItems()
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
    editItem (item) {
      this.editedIndex = this.rows.indexOf(item)
      this.editedItem = item
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        await Places.delete(item.id)
        return await this.getRows()
      } catch (err) {
        if (err instanceof ApplicationError) {
          this.message = err.message
          this.level = 'Alert'
        } else {
          this.message = 'システムでエラーが発生しました。管理者に連絡してください'
          this.level = 'Error'
          const user = this.$store.state.auth.username
          appError.sendError(user, err, 'notifyList:delRow')
        }
      }
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    async save () {
      const doc = {
        name: this.editedItem.name,
        address: this.editedItem.address,
        mail: this.editedItem.mail,
      }
      if (this.editedItem.id) {
        await Places.save(this.editedItem.id, doc)
      } else {
        await Places.save('', doc)
      }
      this.close()
      return await this.getRows()
    },
  }
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
