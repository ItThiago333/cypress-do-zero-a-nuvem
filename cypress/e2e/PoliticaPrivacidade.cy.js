it.only('testa a p�gina da pol�tica de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')
    cy.get('#title').should('be.visible')
    //cy.contains('p', 'Talking About Testing').Should('be.visible') - 'p' de paragrafo
})

