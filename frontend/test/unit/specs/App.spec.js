import App from '@/App'

describe('App.vue', () => {
  it('should be initialized with proper values', () => {
    const items = []

    expect(App.data().clipped).to.equal(false)
    expect(App.data().drawer).to.equal(false)
    expect(App.data().fixed).to.equal(false)
    expect(App.data().miniVariant).to.equal(false)
    expect(App.data().right).to.equal(true)
    expect(App.data().rightDrawer).to.equal(false)
    expect(App.data().title).to.equal('Book your flight')
    //expect(App.data().items).to.be.deep.equal(items)
  })
})
