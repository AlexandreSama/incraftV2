import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    email: '',
    password: '',
    profile: null
  }),
  actions: {
    setCredentials(email, password) {
      this.email = email
      this.password = password
    },
    setProfile(profile) {
      this.profile = profile
    },
    clearCredentials() {
      this.email = ''
      this.password = ''
      this.profile = null
    }
  }
})
