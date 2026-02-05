describe('Full Production Flow (E2E)', () => {
  
  const timestamp = Date.now();
  const rawMaterialName = `Raw Material E2E ${timestamp}`;
  const productName = `Product E2E ${timestamp}`;
  const modalSelector = '.fixed.inset-0';

  beforeEach(() => {
    Cypress.config('defaultCommandTimeout', 10000);
    cy.visit('/');
  });

  it('Should create raw material and product successfully (CRUD Integration)', () => {
    
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
    
    cy.contains('500').should('be.visible');
    
    cy.log('Integration Test Passed: Data was persisted correctly.');
  });
});