import { LitElement, html, property } from 'lit-element';
import { SnackOrder } from '../models/snack-order';
import { validate } from 'class-validator';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-combo-box';

class SnackOrderFormState {
  availableSnacks: string[] = [];
  snackType = '';
  errors: string[] = [];
  order = new SnackOrder();
  buttonDisabled = true;
}

class SnackOrderForm extends LitElement {
  @property()
  private state = new SnackOrderFormState();
  private allSnacks = new Map<string, string[]>();

  constructor() {
    super();
    this.allSnacks.set('Fruits', ['Banana', 'Apple', 'Orange', 'Avocado']);
    this.allSnacks.set('Candy', ['Chocolate bar', 'Gummy bears', 'Granola bar']);
    this.allSnacks.set('Drinks', ['Soda', 'Water', 'Coffee', 'Tea']);
  }

  render() {
    const { order, snackType, buttonDisabled, availableSnacks, errors } = this.state;

    return html`
      <style>
        .form {
          display: grid;
          grid-template-columns: repeat(auto-fill, 200px);
          gap: 10px;
          align-items: baseline;
          padding-bottom: 10px;
        }
      </style>
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-text-field
          label="Name"
          name="name"
          .value=${order.name}
          required
        ></vaadin-text-field>
        <vaadin-text-field
          label="Quantity"
          name="quantity"
          .value=${order.quantity}
          pattern="\\d+"
          required
          prevent-invalid-input
          error-message="Quantity must be a number"
        ></vaadin-text-field>
        <vaadin-combo-box
          label="Type"
          .value=${snackType}
          .items=${Array.from(this.allSnacks.keys())}
          @change=${this.snackTypeChanged}
        ></vaadin-combo-box>
        <vaadin-combo-box
          label="Snack"
          name="snack"
          .value=${order.snack}
          required
          .items=${availableSnacks}
          ?disabled=${availableSnacks.length === 0}
        ></vaadin-combo-box>

        <vaadin-button theme="primary" @click=${this.placeOrder} ?disabled=${buttonDisabled}
          >Order</vaadin-button
        >
      </div>
      <div class="errors">
        ${
          errors.map(
            error =>
              html`
                <p>${error}</p>
              `
          )
        }
      </div>
    `;
  }

  async formValueUpdated(e: { target: HTMLInputElement }) {
    if (e.target.name) {
      this.state = {
        ...this.state,
        order: new SnackOrder({
          ...this.state.order,
          [e.target.name]: e.target.value
        })
      };

      this.updateButtonState();
    }
  }

  async updateButtonState() {
    this.state = {
      ...this.state,
      buttonDisabled: (await validate(this.state.order)).length > 0
    };
  }

  snackTypeChanged(e: { target: HTMLInputElement }) {
    const snackType = e.target.value;
    const availableSnacks = this.allSnacks.get(snackType) || [];
    this.state = {
      ...this.state,
      snackType,
      availableSnacks
    };
  }

  async placeOrder() {
    const errors = await validate(this.state.order);
    if (errors.length > 0) {
      this.state = {
        ...this.state,
        errors: errors.map(e =>
          Object.entries(e.constraints)
            .map(([, msg]) => msg)
            .join(', ')
        )
      };
    } else {
      this.dispatchEvent(
        new CustomEvent('order', {
          detail: this.state.order,
          bubbles: true
        })
      );
      this.state = new SnackOrderFormState();
    }
  }
}

customElements.define('snack-order-form', SnackOrderForm);
