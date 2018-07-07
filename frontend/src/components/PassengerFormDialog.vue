<template>
  <v-form>
    <v-text-field
      v-model="firstName"
      :counter="nameMaxLength"
      :error-messages="firstNameErr"
      label="First name"
      required
    />
    <v-text-field
      v-model="lastName"
      :counter="nameMaxLength"
      :hook="passengerins"
      :error-messages="lastNameErr"
      label="Last name"
      required
    />
    <v-text-field
      v-model="age"
      :error-messages="ageErr"
      label="Age"
      required
    />
    <v-select
      :items="genders"
      v-model="gender"
      :error-messages="genderErr"
      single-line
      label="Gender"
      required
    />
    <v-text-field
      v-model="phone"
      label="Phone"
      :error-messages="phoneErr"
      required
    />
    <v-btn @click="submit">submit</v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>

<script>
/* global BASE_URL */
import API from '../API'

export default {
  name: 'PassengerFormDialog',
  props: {
    passengerins: {
      type: Object,
      required: false,
      default: () => ({
        id: null,
        firstName: null,
        lastName: null,
        age: null,
        gender: null,
        phone: null
      })
    },
    actionname: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      relativeURLPath: 'passenger',
      nameMaxLength: 20,
      getDataFirstTime: true,
      genders: ['Male', 'Female', 'Other'],
      passengerId: null,
      firstName: null,
      lastName: null,
      age: null,
      gender: null,
      phone: null,
      firstNameErr: [],
      lastNameErr: [],
      ageErr: [],
      genderErr: [],
      phoneErr: [],
      apiResponse: {}
    }
  },
  updated () {
    this.loadPassengerData()
  },
  methods: {
    loadPassengerData () {
      if (this.actionname === 'edit' && this.getDataFirstTime) {
        this.firstName = this.passengerins.firstName
        this.lastName = this.passengerins.lastName
        this.age = this.passengerins.age
        this.gender = this.passengerins.gender
        this.phone = this.passengerins.phone
        this.passengerId = this.passengerIns.id
        this.getDataFirstTime = false
      } else if (this.actionname === 'create' && !this.getDataFirstTime) {
        this.clear()
        this.getDataFirstTime = true
      }
    },
    submit () {
      if (!this.validateInputs()) {
        var reqParams = {
          firstname: this.firstName,
          lastname: this.lastName,
          age: this.age,
          gender: this.gender,
          phone: this.phone
        }
        var reqType = 'post'
        if (this.actionname === 'edit') {
          reqParams.id = this.passengerId
          reqType = 'put'
        }
        API.call(
          BASE_URL,
          reqType,
          this.relativeURLPath,
          reqParams
        ).then((response) => {
          this.apiResponse = response
          this.$emit('close-dialog')
          this.clear()
        })
      }
    },
    clearErrArr () {
      this.firstNameErr = []
      this.lastNameErr = []
      this.ageErr = []
      this.genderErr = []
      this.phoneErr = []
    },
    validateInputs () {
      this.clearErrArr()
      if (this.firstName == null || this.firstName.length === 0 ||
        this.firstName.length > this.nameMaxLength) {
        this.firstNameErr.push(
          'First name cannot be empty or exceed ' +
          this.nameMaxLength +
          ' letters'
        )
      }
      if (this.lastName == null || this.lastName.length === 0 ||
        this.lastName.length > this.nameMaxLength) {
        this.lastNameErr.push(
          'Last name cannot be empty or exceed '+
          this.nameMaxLength +
          ' letters'
        )
      }
      if (this.age == null || isNaN(this.age) || this.age < 0) {
        this.ageErr.push('Age must be a valid number more than zero')
      }
      if (this.gender == null || this.gender.length === 0 ||
        this.genders.indexOf(this.gender) === -1) {
        this.genderErr.push('Gender must be a valid entry')
      }
      if (this.phone == null | isNaN(this.phone)) {
        this.phoneErr.push('Phone must be a valid entry')
      }
      return (this.firstNameErr.length > 0 && this.lastNameErr.length > 0 &&
            this.ageErr.length > 0 && this.genderErr.length > 0 &&
            this.phoneErr.length > 0)
    },
    clear () {
      this.firstName = null
      this.lastName = null
      this.age = null
      this.gender = null
      this.phone = null
    }
  }
}
</script>
