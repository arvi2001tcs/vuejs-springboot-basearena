import Vue from 'vue'
import FlightFormDialog from '@/components/FlightFormDialog'
import { mount } from '@vue/test-utils'
import API from '@/API'

describe('FlightFormDialog.vue', () => {
  it('should be initialized with proper values', () => {
    const lengthValidations = {
      maxVal1: 20,
      maxVal2: 25,
      maxVal3: 50,
      maxVal4: 6
    }
    const flightins = {
      id: null,
      manufacturer: null,
      model: null,
      description: null,
      yearOfManufacture: null,
      vacancy: null,
      price: null,
      between: null,
      departure: null,
      arrival: null
    }

    expect(FlightFormDialog.data().lengthValidations).to.be.deep.equal(lengthValidations)
    expect(FlightFormDialog.data().relativeURLPath).to.equal('flight')
    expect(FlightFormDialog.data().getDataFirstTime).to.equal(true)
    expect(FlightFormDialog.data().yomItems).to.be.deep.equal([])
    expect(FlightFormDialog.data().flightNumber).to.equal(null)
    expect(FlightFormDialog.data().manufacturer).to.equal(null)
    expect(FlightFormDialog.data().model).to.equal(null)
    expect(FlightFormDialog.data().description).to.equal(null)
    expect(FlightFormDialog.data().yearOfManufacture).to.equal(null)
    expect(FlightFormDialog.data().fromLocation).to.equal(null)
    expect(FlightFormDialog.data().toLocation).to.equal(null)
    expect(FlightFormDialog.data().price).to.equal(null)
    expect(FlightFormDialog.data().departureTime).to.equal(null)
    expect(FlightFormDialog.data().arrivalTime).to.equal(null)
    expect(FlightFormDialog.data().capacity).to.equal(null)
    expect(FlightFormDialog.data().flightNumberErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().manufacturerErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().modelErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().descriptionErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().yomErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().fromLocErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().toLocErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().priceErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().depTimeErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().arrTimeErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().capacityErr).to.be.deep.equal([])
    expect(FlightFormDialog.data().apiResponse).to.be.deep.equal({})
    expect(FlightFormDialog.props.flightins.default()).to.be.deep.equal(flightins)
  })

  it('should call loadFlightData method when a variable is updated', () => {
    var wrapper = mount(FlightFormDialog, {
      propsData: {
        actionname: 'create'
      },
      data () {
        return {
          getDataFirstTime: false,
          model: ''
        }
      }
    })
    wrapper.setData({ model: 'A model' })
    Vue.nextTick(() => {
      expect(wrapper.vm.getDataFirstTime).to.equal(true)
    })
    wrapper = mount(FlightFormDialog, {
      propsData: {
        actionname: 'edit',
        flightins: {
          price: 1000,
          between: 'Chennai -> Mumbai',
          description: 'A flight',
          departure: '2018-09-09 09:00',
          arrival: '2018-09-09 10:00',
          vacancy: '10/100',
          model: 'Big Boat',
          manufacturer: 'Boeing',
          yearOfManufacture: 1976,
          id: 'A408'
        }
      },
      data () {
        return {
          getDataFirstTime: true,
          model: ''
        }
      }
    })
    wrapper.setData({ model: 'A model' })
    Vue.nextTick(() => {
      expect(wrapper.vn.getDataFirstTime).to.equal(false)
    })
  })

  it('should call clearErrArr method when submit method is called to create without errors', () => {
    clearErrArr()
    let APICall = sinon.stub(API, 'call').resolve({ test: 'test' })
    var wrapper = mount(FlightFormDialog, {
      propsData: {
        actionname: 'create'
      },
      data () {
        return {
          price: 1000,
          fromLocation: 'Chennai',
          toLocation: 'Mumbai',
          departureTime: '2018-09-09 09',
          description: 'Big Boat',
          arrivalTime: '2018-09-09 10',
          capacity: 100,
          model: 'A flight',
          manufacturer: 'Boeing',
          yearOfManufacture: 1976,
          flightNumber: 'A408'
        }
      }
    })
    wrapper.findAll('form button').at(0).trigger('click')
    expect(wrapper.vm.price).to.equal(1000)
    APICall.restore()
  })

  it('should return a proper error message when stringErrMsg method is called', () => {
    let fieldName = 'Model'
    let maxLength = 5
    let actual = FlightFormDialog.methods.stringErrMsg(fieldName, maxLength)
    let expected = fieldName + ' cannot be empty or exceed ' + maxLength + ' letters'
    expect(expected).to.equal(actual)
  })
})
