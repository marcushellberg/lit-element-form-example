import { IsNotEmpty, Min } from 'class-validator';
export class SnackOrder {
  @IsNotEmpty({ message: 'Please enter your name' })
  public name = '';
  @Min(1, { message: 'Quantity must be 1 or more' })
  @IsNotEmpty({ message: 'Please enter quantity' })
  public quantity = 1;
  @IsNotEmpty({ message: 'Please select a snack' })
  public snack = '';

  constructor(order?: SnackOrder) {
    if (order) {
      this.name = order.name;
      this.quantity = order.quantity;
      this.snack = order.snack;
    }
  }
}
