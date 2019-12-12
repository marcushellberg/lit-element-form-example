import { LitElement, html, property, css } from 'lit-element';
import { SnackOrder } from '../models/snack-order';
import { validate } from 'class-validator';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-combo-box';

class SnackOrderForm extends LitElement {
  @property()
  private availableSnacks: string[] = [];
  @property()
  private snackType = '';
  @property()
  private errors: string[] = [];
  @property()
  private order = new SnackOrder();
  @property()
  private buttonDisabled = true;

  private allSnacks = new Map<string, string[]>();

  constructor() {
    super();
    this.allSnacks.set('Fruits', ['Banana', 'Apple', 'Orange', 'Avocado']);
    this.allSnacks.set('Candy', ['Chocolate bar', 'Gummy bears', 'Granola bar']);
    this.allSnacks.set('Drinks', ['Soda', 'Water', 'Coffee', 'Tea']);
  }

  static styles = [
    css`
      .form {
        display: grid;
        grid-template-columns: repeat(auto-fill, 200px);
        gap: 10px;
        align-items: baseline;
        padding-bottom: 10px;
      }
    `
  ];

  render() {
    return html`
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-text-field
          label="Name"
          name="name"
          .value=${this.order.name}
          required
        ></vaadin-text-field>
        <vaadin-text-field
          label="Quantity"
          name="quantity"
          .value=${this.order.quantity}
          pattern="\\d+"
          required
          prevent-invalid-input
          error-message="Quantity must be a number"
        ></vaadin-text-field>
        <vaadin-combo-box
          label="Type"
          .value=${this.snackType}
          .items=${Array.from(this.allSnacks.keys())}
          @change=${this.snackTypeChanged}
        ></vaadin-combo-box>
        <vaadin-combo-box
          label="Snack"
          name="snack"
          .value=${this.order.snack}
          required
          .items=${this.availableSnacks}
          ?disabled=${this.availableSnacks.length === 0}
        ></vaadin-combo-box>

        <vaadin-button theme="primary" @click=${this.placeOrder} ?disabled=${this.buttonDisabled}
          >Order</vaadin-button
        >
      </div>
      <div class="errors">
        ${this.errors.map(
          error =>
            html`
              <p>${error}</p>
            `
        )}
      </div>
    `;
  }

  async formValueUpdated(e: { target: HTMLInputElement }) {
    if (e.target.name) {
      this.order = new SnackOrder({
        ...this.order,
        [e.target.name]: e.target.value
      });

      this.updateButtonState();
    }
  }

  async updateButtonState() {
    this.buttonDisabled = (await validate(this.order)).length > 0;
  }

  snackTypeChanged(e: { target: HTMLInputElement }) {
    this.snackType = e.target.value;
    this.availableSnacks = this.allSnacks.get(this.snackType) || [];
  }

  async placeOrder() {
    const errors = await validate(this.order);
    if (errors.length > 0) {
      this.errors = errors.map(e =>
        Object.entries(e.constraints)
          .map(([, msg]) => msg)
          .join(', ')
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('order', {
          detail: this.order,
          bubbles: true
        })
      );
      this.reset();
    }
  }

  reset() {
    this.order = new SnackOrder();
    this.errors = [];
    this.snackType = '';
    this.buttonDisabled = true;
  }
}

customElements.define('snack-order-form', SnackOrderForm);
