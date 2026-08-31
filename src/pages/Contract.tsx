import { useState, type FormEvent } from "react";
import AsciiIcon from "../ascii/AsciiIcon";
import FileHeader from "../system/FileHeader";
import "./Contract.css";

const BUDGETS = ["< R$2K", "R$2K – R$5K", "R$5K – R$15K", "R$15K+", "NOT SURE YET"];

export default function Contract() {
  const [submitted, setSubmitted] = useState(false);
  const [budget, setBudget] = useState(BUDGETS[0]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="contract-page contract-page--confirmed">
        <AsciiIcon name="contract" size="lg" animate interactive={false} />
        <h1 className="contract-confirmed__title">CONTRACT RECEIVED</h1>
        <p className="contract-confirmed__body">
          Request logged. Expect a response within 48 hours to review scope
          and terms.
        </p>
      </div>
    );
  }

  return (
    <div className="contract-page">
      <div className="contract-page__intro">
        <FileHeader index="04" title="CONTRACT" />
        <h1 className="contract-page__headline">INITIATE CONTRACT</h1>
        <p className="contract-page__lede">
          Describe the operation. Every field helps scope it accurately.
        </p>
      </div>

      <form className="contract-form" onSubmit={handleSubmit}>
        <label className="contract-field">
          <span>NAME</span>
          <input type="text" name="name" required placeholder="Your name" />
        </label>

        <label className="contract-field">
          <span>EMAIL</span>
          <input type="email" name="email" required placeholder="you@domain.com" />
        </label>

        <label className="contract-field">
          <span>PROJECT</span>
          <input type="text" name="project" required placeholder="Working title / brief summary" />
        </label>

        <fieldset className="contract-field contract-field--budget">
          <legend>BUDGET</legend>
          <div className="contract-budget-options">
            {BUDGETS.map((b) => (
              <button
                type="button"
                key={b}
                className={`contract-budget-option ${budget === b ? "is-selected" : ""}`}
                onClick={() => setBudget(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="contract-field">
          <span>BRIEF</span>
          <textarea name="brief" required rows={6} placeholder="Scope, references, deadline, anything relevant." />
        </label>

        <button type="submit" className="contract-submit">
          <span className="contract-submit__bracket">[</span>
          SEND CONTRACT REQUEST
          <span className="contract-submit__bracket">]</span>
        </button>
      </form>
    </div>
  );
}
