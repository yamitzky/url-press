<template>
  <v-card flat class="elevation-1 container">
    <v-card-text>
      <v-form>
        <v-layout row wrap>
          <v-flex style="padding-right: 1em" xs9 sm10>
            <v-text-field
              v-model="url"
              label="URL to Shorten"
              hint="e.g. https://yamitzky.com"
              required
              v-validate="{ required: true, regex: /^https?:\/\// }"
              data-vv-name="url"
              :error-messages="errors.collect('url')"
              >
            </v-text-field>
          </v-flex>
          <v-flex xs3 sm2>
            <v-btn block color="primary" @click="shorten">
              Shorten
            </v-btn>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              label="Custom URL"
              :prefix="`${origin}/`"
              v-model="customURL"
              @keyup="onChangeCustomURL"
              persistent-hint
              required
              v-validate="'required'"
              data-vv-name="customURL"
              :error-messages="errors.collect('customURL')"
              >
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-alert dismissible outline transition="slide-y-transition" color="success" icon="check_circle" v-model="alert" v-if="lastOperation && lastOperation.success">
          <a :href="lastOperation.from" target="_blank">{{lastOperation.from}}</a> will be redirected to <a :href="lastOperation.to" target="_blank">{{lastOperation.to}}</a>
        </v-alert>
        <v-alert dismissible outline transition="slide-y-transition" color="error" icon="warning" v-model="alert" v-else-if="lastOperation && !lastOperation.success">
          {{lastOperation.message}}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import bs58 from 'bs58'

export default {
  data () {
    let customURL = ''
    if (process.browser) {
      const hash = decodeURIComponent(location.hash).slice(1)
      if (hash) {
        customURL = hash
      } else {
        const randomBytes = new Uint8Array(16)
        window.crypto.getRandomValues(randomBytes)
        customURL = bs58.encode(randomBytes).slice(0, 8)
      }
    }
    return {
      customURL,
      url: '',
      origin: process.browser ? location.origin : 'http://.....',
      lastOperation: null,
      alert: false
    }
  },
  methods: {
    async fetchURL (id) {
      const { data: { url } } = await this.$axios.get(`/urls/${id}`)
      return url
    },
    async shorten () {
      const valid = await this.$validator.validateAll()
      if (valid) {
        try {
          const { data: { id, url } } = await this.$axios.post('/urls', {
            id: this.customURL,
            url: this.url
          })
          this.lastOperation = {
            success: true,
            from: `${origin}/${id}`,
            to: url
          }
        } catch (e) {
          this.lastOperation = {
            success: false,
            message: e.message
          }
        }
        this.alert = true
      }
    },
    onChangeCustomURL () {
      location.replace(`#${encodeURIComponent(this.customURL)}`)
    }
  },
  async mounted () {
    if (this.customURL) {
      const url = await this.fetchURL(this.customURL)
      this.url = url
    }
  }
}
</script>

<style scoped>
  .container {
    max-width: 640px;
  }
</style>
