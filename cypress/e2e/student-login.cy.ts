describe("Student Login", () => {

  it("logs in successfully", () => {

    cy.visit("http://localhost:3000/auth/login");

    cy.get('[data-testid="login-email"]')
      .type("student@gmail.com");

    cy.get('[data-testid="login-password"]')
      .type("password123");

    cy.intercept("POST", "http://localhost:5000/auth/login").as("login");

    cy.get('[data-testid="login-button"]').click();

    cy.wait("@login")
      .its("response.statusCode")
      .should("eq", 200);

    cy.url().should("include", "/dashboard/student");

  });

});