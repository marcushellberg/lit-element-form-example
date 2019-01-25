import { LitElement, html, property } from 'lit-element';
import '../components/snack-order-form';
import '@vaadin/vaadin-grid';
import { SnackOrder } from '../models/snack-order';

class SnackApp extends LitElement {
  @property()
  private orders: SnackOrder[] = [];

  render() {
    return html`
      <snack-order-form @order=${this.placeOrder}></snack-order-form>

      <vaadin-grid .items=${this.orders}>
        <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
        <vaadin-grid-column
          path="quantity"
          header="Quantity"
        ></vaadin-grid-column>
        <vaadin-grid-column path="snack" header="Snack"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  placeOrder(e: { detail: SnackOrder }) {
    this.orders = [...this.orders, e.detail];
  }
}

customElements.define('snack-app', SnackApp);
