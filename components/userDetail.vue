<template>
  <v-container class="pa-0">
    <v-card>
      <v-row no-gutters>
        <v-col>
          QR
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          <img :src="qrUrl" alt="QRコード">
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center">
          {{ user.id }}
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          利用者情報
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="4" class="text-right body-2 pa-1">
          氏名
        </v-col>
        <v-col cols="8" class="pa-1">
          {{ user.name }}
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="4" class="text-right body-2 pa-1">
          メール
        </v-col>
        <v-col cols="8" class="pa-1">
          {{ user.mail }}
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dispMonth: new Date(),
      level: '',
      message: '',
      loading: true
    }
  },
  computed: {
    qrUrl () {
      return 'https://chart.apis.google.com/chart?chs=150x150&cht=qr&chl=' + this.user.id
    }
  },
  methods: {
  }
}
</script>
