import SearchBar from "@/app/find_tutor/components/SearchBar";

describe("SearchBar Component", () => {

  it("should render search input and button", () => {

    cy.mount(
      <SearchBar
        value=""
        onChange={() => {}}
      />
    );

    cy.get("input").should("exist");

    cy.get("button").should("exist");

  });

  it("should call onChange when user types", () => {

    const onChange = cy.stub();

    cy.mount(
      <SearchBar
        value=""
        onChange={onChange}
      />
    );

    cy.get("input")
      .type("Physics");

    cy.wrap(onChange)
      .should("have.been.called");

  });

});