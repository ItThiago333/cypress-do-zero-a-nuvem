describe('Central de Atendimento ao Cliente TAT', () => {
    beforeEach(() => {
        cy.visit('./src/index.html')

    })
    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })


    it('preenche os campos obrigatórios e envia o formulário', () => {
        Cypress._.times(2, () => { // cypress ._. chama a biblioteca lodash do javascript , times é a função que repete o teste, primeiro passo a quantidade depois o que vou realizar
            const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxzy ', 10)

            cy.clock() //congela o tempo
            cy.get('#firstName').type('Italo')
            cy.get('#lastName').type('Thiago')
            cy.get('#email').type('italo.thiago@teste.com')
            cy.get('#open-text-area').type(longText, { delay: 0 })
            cy.contains('button', 'Enviar').click()
            cy.get('.success').should('be.visible')

            cy.tick(3000) // avança no tempo 3 segundos

            cy.get('.success').should('not.be.visible')
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        Cypress._.times(2, () => { // chamando a blibioteca lodash (Cypress ._.) e repeetindo o teste 2 vezes com a função times
            cy.clock() // congela o tempo
            cy.get('#firstName').type('Italo')
            cy.get('#lastName').type('Thiago')
            cy.get('#email').type('italo.thiago@teste,com')
            cy.get('#open-text-area').type('teste')
            cy.contains('button', 'Enviar').click()

            cy.get('.error').should('be.visible')

            cy.tick(3000)// avança n tempo 3 segundos
            cy.get('.error').should('not.be.visible')
        })
    })

    it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Italo')
        cy.get('#lastName').type('Thiago')
        cy.get('#email').type('italo.thiago@teste.com')
        cy.get('#open-text-area').type('teste')
        cy.get('#phone-checkbox').check()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
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

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', () => {

        cy.clock()
        const data = {
            firstName: 'Italo',
            lastName: 'Thiago',
            email: 'italo.thiago@teste.com',
            text: 'Teste.'

        }

        cy.preencheOsCamposPadraoEEnvia()

        cy.get('.success').should('be.visible')

        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
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

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product')
            .select(1)//indice é a posição do elemento na lista, começando do 0
            .should('have.value', 'blog')

    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')       

     })


    it('marca cada tipo de atendimento', () => {

        cy.get('input[type="radio"]')//radio é igua a checkbox, mas só pode selecionar um
            .each(tipoDeServico => {
                cy.wrap(tipoDeServico)
                    .check()
                    .should('be.checked')
            })       
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')   
            .last() //seleciona o último elemento
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
        cy.fixture('example.json').as('arquivoExemplo')//dando um alias para o arquivo, o cypress vai procurar na pasta fixtures por padrão
        cy.get('#file-upload')
            .selectFile('@arquivoExemplo')//@ para referenciar o alias
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')//verifica se o nome do arquivo é igual ao esperado
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a') //seleciona o link dentro do elemento com id privacy
            .should('have.attr', 'target', '_blank') //verifica se o atributo target é igual a _blank, que indica que o link abre em outra aba
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //remove o atributo target para abrir na mesma aba
            .click()
        cy.get('#title').should('be.visible') //verifica se o título da página de política de privacidade está visível')
    })

    it('testa a página da política de privacidade de forma independente', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //remove o atributo target para abrir na mesma aba
            .click()    
        cy.get('#white-background').should('be.visible')
    })

    it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show') // força a exibição de um elemento oculto
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide') // oculta um elemento que esta visivel
            .should('not.be.visible')
       
    })

    it('preenche o campo da área de texto usando o comando invoke', () => {
        cy.get('#open-text-area')
            .invoke('val', 'um texto qualquer')
            .should('have.value', 'um texto qualquer')

    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')  //fazendo uma requisição
            .as('TesteRequisicao')  //Dando um nome para a requisição
            .its('status')  //pega o valor da propriedade de um objeto
            .should('be.equal', 200)
        cy.get('@TesteRequisicao')  //Como dei um alias a minha requisição, não preciso passar a URL novamente
            .its('statusText')  // Chamando a propiedade di statusText
            .should('be.equal', 'OK') //Verificando se ela retorna 'ok'
        cy.get('@TesteRequisicao')
            .its('body')
            .should('include', 'CAC TAT')  //Verificando se no body contém o texto 'CAC TAT'
    })

    it.only('Encontrando o gato', () => {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')  // força a exibição de um elemento oculto
            .should('be.visible')
            .invoke('hide')  // oculta um elemento que esta visivel
            .should('not.be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'Italo Thiago P L')
            



    })

})




