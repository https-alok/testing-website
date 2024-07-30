import JsonEditor from '~/components/JsonEditor';
import React from 'react';
import mockNextRouter from '../support/mockNextRouterUtils';

const initialCode = {
  name: 'Product',
  properties: {
    id: {
      type: 'number',
      description: 'Product identifier',
    },
    name: {
      description: 'Name of the product',
      type: 'string',
    },
    city: {
      description: 'Name of the product',
      type: 'string',
    },
    price: {
      type: 'number',
      minimum: 0,
    },
    tags: {
      optional: true,
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  links: [
    {
      rel: 'full',
      href: '{id}',
    },
    {
      rel: 'comments',
      href: 'comments/?id={id}',
    },
  ],
};

describe('MyComponent', () => {
  // eslint-disable-next-line
  let mockRouter;

  beforeEach(() => {
    // Create mock router object

    mockRouter = mockNextRouter();
  });

  it('should navigate correctly for all "string" type spans', () => {
    cy.viewport(1200, 800);
    cy.mount(<JsonEditor initialCode={JSON.stringify(initialCode, null, 2)} />);

    // Find all spans containing "string"
    cy.get('span')
      .contains('"string"', { matchCase: false })
      .then(($spans) => {
        cy.log(`Found ${$spans.length} spans containing "string"`);

        $spans.each((index, span) => {
          cy.wrap(span).click();

          cy.get('@routerPush').should(
            'have.been.calledWith',
            '/understanding-json-schema/reference/string',
          );

          cy.get('@routerPush').invoke('reset');

          cy.log(`Clicked span ${index}:`, Cypress.$(span).text());
        });
      });
  });

  it('should render with schema props', () => {
    const withSchemaProps = {
      ...initialCode,
      $schema: 'https://swc.rs/schema.json',
    };
    cy.viewport(1200, 800);
    cy.mount(
      <JsonEditor initialCode={JSON.stringify(withSchemaProps, null, 2)} />,
    );
  });

  it('should return meta data', () => {
    const metaProps = '// props {"someProperty": "someValue"}}';
    cy.viewport(1200, 800);
    cy.mount(<JsonEditor initialCode={JSON.stringify(metaProps, null, 2)} />);
  });

  it('should handle invalid meta data', () => {
    const invalidMetaProps = `// props {"invalidJson":}
    {
      "name": "Product",
      "properties": {}
    }`;

    cy.viewport(1200, 800);
    cy.mount(<JsonEditor initialCode={invalidMetaProps} />);
  });

  it('should handle valid meta data', () => {
    const validMetaProps = `// props {"someProperty": "someValue"}
    {
      "name": "Product",
      "properties": {}
    }`;

    cy.viewport(1200, 800);
    cy.mount(<JsonEditor initialCode={validMetaProps} />);
  });

  it('should check not meta string', () => {
    const notMetaString = `
      "name": "Product",
      "properties": {}
    }`;

    cy.viewport(1200, 800);
    cy.mount(<JsonEditor initialCode={notMetaString} />);
  });
});
