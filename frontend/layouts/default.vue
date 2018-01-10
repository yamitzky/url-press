<template>
  <v-app>
    <v-toolbar class="cyan darken-1 white--text" fixed>
      <v-toolbar-title>URL Press - URL Shortener for Team</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <v-flex>
            <nuxt/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sidebar: false
    }
  }
}
</script>

<style scoped>
  .title {
    padding-left: 20px;
  }
</style>
