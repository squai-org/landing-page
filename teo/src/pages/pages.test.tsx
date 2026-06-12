import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import Index from "./Index";
import Terms from "./Terms";
import Privacy from "./Privacy";
import { t } from "@/lib/content";

const renderPage = (page: React.ReactElement, path = "/") =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>
    </HelmetProvider>,
  );

describe("Index", () => {
  it("renders the hero headline and pricing", () => {
    renderPage(<Index />);
    expect(screen.getByText(t().hero.sub)).toBeInTheDocument();
    expect(screen.getByText("29.900")).toBeInTheDocument();
  });

  it("links to the legal pages from the footer", () => {
    renderPage(<Index />);
    expect(screen.getByRole("link", { name: "Términos y condiciones" })).toHaveAttribute("href", "/terminos");
    expect(screen.getByRole("link", { name: "Política de privacidad" })).toHaveAttribute("href", "/privacidad");
  });
});

describe("Terms", () => {
  it("renders every section heading", () => {
    renderPage(<Terms />, "/terminos");
    for (const section of t().terms.sections) {
      expect(screen.getByText(section.heading)).toBeInTheDocument();
    }
  });
});

describe("Privacy", () => {
  it("renders the legal basis and every section heading", () => {
    renderPage(<Privacy />, "/privacidad");
    expect(
      screen.getByText("En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013."),
    ).toBeInTheDocument();
    for (const section of t().privacy.sections) {
      expect(screen.getByText(section.heading)).toBeInTheDocument();
    }
  });
});
