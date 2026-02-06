describe('Full Production Flow (E2E)', () => {
  
  const timestamp = Date.now();
  const rawMaterialName = `Insumo E2E ${timestamp}`;
  const productName = `Produto E2E ${timestamp}`;
  const modalSelector = '.fixed.inset-0';

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 10000);
    cy.visit('/');
  });

  it('Should perform a full CRUD cycle (Create, Read, Delete)', () => {
    cy.log('Step 1: Creating Raw Material');
    cy.visit('/raw-materials'); 

    cy.contains('button', 'Novo Insumo').click();
    
    cy.get(modalSelector).should('be.visible').within(() => {
        cy.get('input[type="text"]').clear().type(rawMaterialName);
        cy.get('input[type="number"]').clear().type('100');
        cy.get('select').select('KG'); 
        cy.contains('button', 'Salvar').click();
    });

    cy.contains(modalSelector).should('not.exist'); 
    cy.contains(rawMaterialName).should('be.visible');
    cy.wait(1000); 

    cy.log('Step 2: Creating Product');
    cy.visit('/products'); 
    cy.reload(); 

    cy.contains('button', 'Novo Produto').click();

    cy.get(modalSelector).should('be.visible').within(() => {
        cy.get('input[type="text"]').first().clear().type(productName);
        cy.get('input[type="number"]').first().clear().type('500'); 

        cy.root().then(($modal) => {
            if ($modal.find('select').length === 0) {
                cy.get('svg.lucide-plus').closest('button').click();
            }
        });

        cy.get('select').should('exist');

        cy.get('select').last().find('option')
          .contains(rawMaterialName)
          .then(($option) => {
              const value = $option.val();
              cy.get('select').last().select(value as string);
          });
        
        cy.get('input[type="number"]').last().clear().type('2'); 

        cy.contains('button', 'Salvar').click();
    });

    cy.contains(modalSelector).should('not.exist');
    cy.contains(productName).should('be.visible');

    cy.log('Step 3: Verifying Data');
    cy.contains(productName).should('be.visible');

        cy.log('Step 4: Cleaning up (Deleting Product)');
    
    cy.visit('/products');
    
    cy.contains('tr', productName).within(() => {
        cy.get('svg.lucide-trash-2, svg.lucide-trash').closest('button').click();
    });

    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Confirmar"), button:contains("Sim"), button:contains("Excluir")').length > 0) {
             cy.contains('button', /Confirmar|Sim|Excluir|Deletar/i).click();
        }
    });

    cy.contains(productName).should('not.exist');
    cy.wait(500);


    cy.log('Step 5: Cleaning up (Deleting Raw Material)');
    cy.visit('/raw-materials');

    cy.contains('tr', rawMaterialName).within(() => {
        cy.get('svg.lucide-trash-2, svg.lucide-trash').closest('button').click();
    });

    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Confirmar"), button:contains("Sim"), button:contains("Excluir")').length > 0) {
             cy.contains('button', /Confirmar|Sim|Excluir|Deletar/i).click();
        }
    });

    cy.contains(rawMaterialName).should('not.exist');

    cy.log('Test Finished: Environment is Clean! ✨');
  });
});