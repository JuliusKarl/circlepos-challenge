describe('All Books Page', () => {
  it('is the home screen', () => {
    cy.visit('/')
    cy.contains('h1', 'All Books')
  })
})
