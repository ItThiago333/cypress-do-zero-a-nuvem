describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')

    })
    it('verifica o t�tulo da aplica��o', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigat�rios e envia o formul�rio', () => {
        const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxzy ', 10)

        cy.get('#firstName').type('Italo')
        cy.get('#lastName').type('Thiago')
        cy.get('#email').type('italo.thiago@teste.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formul�rio com um email com formata��o inv�lida', () => {
        cy.get('#firstName').type('Italo')
        cy.get('#lastName').type('Thiago')
        cy.get('#email').type('italo.thiago@teste,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor n�o num�rico', () => {
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigat�rio mas n�o � preenchido antes do envio do formul�rio', () => {
        cy.get('#firstName').type('Italo')
        cy.get('#lastName').type('Thiago')
        cy.get('#email').type('italo.thiago@teste.com')
        cy.get('#open-text-area').type('teste')
        cy.get('#phone-checkbox').check()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('Italo')
            .should('have.value', 'Italo')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Thiago')
            .should('have.value', 'Thiago')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('italo.thiago@teste.com')
            .should('have.value', 'italo.thiago@teste.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456789')
            .should('have.value', '123456789')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formul�rio sem preencher os campos obrigat�rios', () => {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('envia o formul�rio com sucesso usando um comando customizado', () => {
        const data = {
            firstName: 'Italo',
            lastName: 'Thiago',
            email: 'italo.thiago@teste.com',
            text: 'Teste.'

        }

        cy.preencheOsCamposPadraoEEnvia()

        cy.get('.success').should('be.visible')

    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu �ndice', () => {
        cy.get('#product')
            .select(1)//indice � a posi��o do elemento na lista, come�ando do 0
            .should('have.value', 'blog')

    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')       

     })


    it('marca cada tipo de atendimento', () => {

        cy.get('input[type="radio"]')//radio � igua a checkbox, mas s� pode selecionar um
            .each(tipoDeServico => {
                cy.wrap(tipoDeServico)
                    .check()
                    .should('be.checked')
            })       
    })

    it('marca ambos checkboxes, depois desmarca o �ltimo', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')   
            .last() //seleciona o �ltimo elemento
            .uncheck() //desmarca checkbox
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    }) 

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json', { arrasta: 'drag-drop' }) // grag-drop simula o arrastar e soltar
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('arquivoExemplo')//dando um alias para o arquivo, o cypress vai procurar na pasta fixtures por padr�o
        cy.get('#file-upload')
            .selectFile('@arquivoExemplo')//@ para referenciar o alias
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')//verifica se o nome do arquivo � igual ao esperado
            })
    })

    it('verifica que a pol�tica de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a') //seleciona o link dentro do elemento com id privacy
            .should('have.attr', 'target', '_blank') //verifica se o atributo target � igual a _blank, que indica que o link abre em outra aba
    })

    it('acessa a p�gina da pol�tica de privacidade removendo o target e ent�o clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //remove o atributo target para abrir na mesma aba
            .click()
        cy.get('#title').should('be.visible') //verifica se o t�tulo da p�gina de pol�tica de privacidade est� vis�vel')
    })

    it('testa a p�gina da pol�tica de privacidade de forma independente', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //remove o atributo target para abrir na mesma aba
            .click()    
        cy.get('#white-background').should('be.visible')
    })
})




