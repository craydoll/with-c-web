<template>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            :label="label"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          :active-picker.sync="activePicker"
          color="green lighten-1"
          :max="max"
          min="1950-01-01"
          locale="ja-jp"
          @change="save"
        ></v-date-picker>
      </v-menu>  
</template>
<script>
export default {
props: {
    label: {
      type: String,
      default: '日付',
      required: false,
    },
    adate: {
      type: String,
      default: '',
      required: true,
    },
    max: {
      type: String,
      default: '',
      requierd: false,
    }
  },
  data () {
    return {
      activePicker: null,
      date: null,
      menu: false,
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    adate () {
      console.log('in DatePicker watch adate:' + this.date + '/' + this.adate)
      if (this.adate) {
        this.date = this.adate
      } else {
        this.date = ''
      }
    }
  },
  mounted () {
    console.log('in DatePicker mounted:' + this.date + '/' + this.adate)
    if (this.adate) {
      this.date = this.adate
    } else {
      this.date = ''
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
      this.$emit('ok',date)
    },

  }

}
</script>

