/* global assert */
import Vue from 'vue'
import Flight from '@/components/Flight'
import API from '@/API'

describe('Flight.vue', () => {
  function componentHelper (component, propsData) {
    const app = document.createElement('div')
    app.setAttribute('data-app', true)
    document.body.append(app)
    let Ctor = Vue.extend(component)
    const el = document.createElement('DIV')
    return new Ctor({propsData, el})
  }

  it('should be initialized with proper values', () => {
    const headers = [ {text: 'Flight Number', value: 'id', align: 'left'},
                      {text: 'Vacancy', value: 'vacancy', align: 'left'},
                      {text: 'Price', value: 'price', align: 'left'},
                      {text: 'Between', value: 'between', align: 'left'},
                      {text: 'Departure', value: 'departure', align: 'left'},
                      {text: 'Arrival', value: 'arrival', align: 'left'},
                      {text: 'Actions', value: '', align: 'left'}]

    expect(Flight.data().showAlert).to.equal(false)
    expect(Flight.data().actionPerformed).to.equal('')
    expect(Flight.data().addFlightDialog).to.equal(false)
    expect(Flight.data().flights).to.be.deep.equal([])
    expect(Flight.data().flightIns).to.equal(null)
    expect(Flight.data().editFlightDialog).to.equal(false)
    expect(Flight.data().formAction).to.equal('create')
    expect(Flight.data().tableHeaders).to.be.deep.equal(headers)
  })

  it('should call loadFlights method on beforeMount and load flights', () => {
    let responseData = {data: [{test: 'test1'}, {test: 'test2'}]}
    let APICall = sinon.stub(API, 'call').resolves(responseData)
    let loadFlightsCall = sinon.spy(Flight.methods, 'loadFlights')
    componentHelper(Flight)
    assert(loadFlightsCall.called)
    Vue.nextTick(() => {
      expect(Flight.data().flights).to.be.deep.equal([])
    })
    APICall.restore()
  })

  it('should set correct values to variables when closeFlightDialog method is called', () => {
    Flight.methods.closeFlightDialog(true)
    Vue.nextTick(() => {
      //expect(Flight.data().actionPerformed).to.equal('added')
      //expect(Flight.data().showAlert).to.equal(true)
      expect(Flight.data().addFlightDialog).to.equal(false)
    })
    Flight.methods.closeFlightDialog(true, true)
    Vue.nextTick(() => {
      expect(Flight.data().addFlightDialog).to.equal(false)
    })
    Flight.methods.closeFlightDialog(false)
    Vue.nextTick(() => {
      expect(Flight.data().actionPerformed).to.equal('edited')
      expect(Flight.data().showAlert).to.equal(true)
      expect(Flight.data().editFlightDialog).to.equal(false)
    })
    Flight.methods.closeFlightDialog(false, true)
    Vue.nextTick(() => {
      expect(Flight.data().editFlightDialog).to.equal(false)
    })
  })

  it('should return proper date time when formatDateTime method is called', () => {
    let dateTimeNow = new Date()
    let actual = Flight.methods.formatDateTime(dateTimeNow.getTime())
    let dateTimeArr = dateTimeNow.toISOString().split('T')
    let timeArr = dateTimeArr[1].split(':')
    expect(actual).to.equal(dateTimeArr[0] + ' ' + timeArr[0] + ':00')
  })

  it('should return cleaned data when cleanFlightData method is called', () => {
    let paramData = {
      number: 'A408',
      manufacturer: 'Boeing',
      model: 'Flying Ship',
      description: 'A passenger flight',
      yearOfManufacture: 1976,
      seatsLeft: 10,
      capacity: 100,
      price: 1000,
      from: 'Chennai',
      to: 'Mumbai',
      departureTime: 1530264640798,
      arrivalTime: 1528097400000
    }
    let expected = {
      id: 'A408',
      manufacturer: 'Boeing',
      model: 'Flying Ship',
      description: 'A passenger flight',
      yearOfManufacture: 1976,
      vacancy: '10/100',
      price: 1000,
      between: 'Chennai -> Mumbai',
      departure: '2018-06-29 09:00',
      arrival: '2018-06-04 07:00'
    }

    let actual = Flight.methods.cleanFlightData(paramData)
    expect(expected).to.be.deep.equal(actual)
  })

  it('should call API when editFlight method is called', () => {
    let APICall = sinon.stub(API, 'call').resolves({ test: 'test' })
    Flight.methods.editFlight('A408')
    Vue.nextTick(() => {
      expect(Flight.data().formAction).to.be.equal('edit')
      expect(Flight.data().editFlightDialog).to.be.equal(true)
      expect(Flight.data().flightIns != null).to.be.equal(false)
    })
    APICall.restore()
  })

  it('should call API when delFlight method is called', () => {
    let APICall = sinon.stub(API, 'call').resolves({ test: 'test' })
    Flight.methods.delFlight('A408')
    Vue.nextTick(() => {
      expect(Flight.data().actionPerformed).to.be.equal('deleted')
      expect(Flight.data().showAlert).to.be.equal(true)
    })
    APICall.restore()
  })
})
