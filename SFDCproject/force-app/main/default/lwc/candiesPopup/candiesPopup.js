import { LightningElement, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import createOrder from "@salesforce/apex/OrderClass.createOrder";
import deleteOrder from "@salesforce/apex/OrderClass.deleteOrder";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CandiesPopup extends NavigationMixin(LightningElement) {

  @track isModalOpen = false;
  @api ParentMessageName = "";
  @api ParentMessageImage = "";
  @api ParentMessagePrice = "";
  @api ParentMessageId = "";
  @api ParentMessageQuantity = "";
  @api count = 1;
  @track flagsold;
  @track flagcart;
  @track checkButton;
  @track calsum;
  @api orders;
  @api orderId = "";
  @api cart = "";
  a;
  status;

  /**
  * desc: sets the isModalOpen property to true if cart is not empty
  */
  showModal() {
    if (this.cart != 1) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Warning",
          message: "Cart is Empty!!!",
          variant: "warning"
        })
      );
    } else {
      this.isModalOpen = true;
    }
  }

  /**
  * desc: sets the isModalOpen property to false, indicating that the Modal is Closed
  */
  closeModal() {
    this.isModalOpen = false;
  }

  /* 
  can be used instead of the above two methods - showModal() & closeModal()
  just toggles the isModalOpen property - true if false, false if true 
  */
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  //compute the CSS classes of the Modal(popup) based on the value of isModalOpen property
  get modalClass() {
    return `slds-modal ${this.isModalOpen ? "slds-fade-in-open" : ""}`;
  }

  //compute the CSS classes of the Modal Backdrop(grey overlay) based on the value of isModalOpen property
  get modalBackdropClass() {
    return `slds-backdrop ${this.isModalOpen ? "slds-backdrop_open" : ""}`;
  }

  areDetailsVisible = false;

  handleChange(event) {
    this.areDetailsVisible = event.target.checked;
  }

  /**
  * desc: handles the increment
  */
  handleincrement() {
    if (this.count < this.ParentMessageQuantity - 5) {
      this.count = this.count + 1;
      this.a = this.ParentMessagePrice;
      this.calsum = this.calsum + this.a;
      console.log("val" + this.calsum);
      console.log("val" + this.a);
    }
  }

  /**
  * desc: sets the isModalOpen property to true if cart is not empty
  */
  handledecrement() {
    if (this.count > 1) {
      this.count = this.count - 1;
      this.a = this.ParentMessagePrice;
      this.calsum = this.calsum - this.a;
    }
  }

  /**
  * desc: this function is called whenever component is loaded
  */
  connectedCallback() {
    setTimeout(() => {
      if (this.ParentMessageQuantity < 12) {
        this.flagsold = false;
        this.flagcart = true;
      }
      this.flagsold = true;
      this.flagcart = false;
      this.calsum = this.ParentMessagePrice;
      console.log(this.calsum);
    }, 1500);
  }

  /**
  * desc: calling the apex method imperativily to save the new order into order object
  */
  saveOrder() {
    if (this.cart != 1) {
      this.status = "In Cart";
      createOrder({
        status: this.status,
        amount: this.calsum,
        prodId: this.ParentMessageId,
        quant: this.count,
        quantity: this.ParentMessageQuantity
      })
        .then((result) => {
          console.log(result);
          this.orders = result;
          this.orderId = this.orders.Id;
          this.cart = 1;
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Added To Cart Successfully",
              variant: "success"
            })
          );
        })
        .catch((error) => {
          this.error = error;
          console.log(this.error);
        });
    } else {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Warning",
          message: "You Already have item in cart",
          variant: "warning"
        })
      );
    }
  }

  /**
  * desc: calling the apex method imperativily to save the new order into order object
  */
  removeOrder() {
    deleteOrder({
      oId: this.orderId
    })
      .then((result) => {
        this.cart = 0;
        this.closeModal();
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Removed From Cart Successfully",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        this.error = error;
        console.log(this.error);
      });
  }

   /** 
  * desc: navigate to the orderPage
  */
  navigateToOrderPage(event) {
    console.log("Checkout done!!!");
    let compDefinition = {
      componentDef: "c:orderPage",
      attributes: {
        Name: this.ParentMessageName,
        Image: this.ParentMessageImage,
        Price: this.ParentMessagePrice,
        quantity: this.ParentMessageQuantity,
        subtotal: this.calsum,
        Count: this.count,
        total: this.calsum + 10,
        prodId: this.ParentMessageId,
        OrderId: this.orderId,
        cartItem: this.cart
      }
    };
    // Base64 encode the compDefinition JS object
    let encodedCompDef = btoa(JSON.stringify(compDefinition));
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/one/one.app#" + encodedCompDef
      }
    });
  }

  remove1() {
    this.checkButton = true;
    this.ParentMessageName = "";
    this.ParentMessageImage = "";
    this.ParentMessagePrice = "";
    this.calsum = "";
    this.count = 1;
  }
}
