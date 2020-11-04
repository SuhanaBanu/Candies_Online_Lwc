import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class CandieTileListView extends NavigationMixin(LightningElement) {
  @api pass_val;

  
  /** 
  * desc: Navigate to the ProductStore__c home page
  * param: event attribute
  */
  redirectToContactPage(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.target.dataset.id,
        objectApiName: "ProductStore__c",
        actionName: "view"
      }
    });
  }

  /** 
  * desc: Navigate to the candiesPopup page
  * param: event attribute
  */
  navigateToTabPage(event) {
    let compDefinition = {
      componentDef: "c:candiesPopup",
      attributes: {
        ParentMessageName: this.pass_val.Name,
        ParentMessageImage: this.pass_val.Image__c,
        ParentMessagePrice: this.pass_val.Price__c,
        ParentMessageQuantity: this.pass_val.Quantity__c,
        ParentMessageId: this.pass_val.Id
      }
    };
    // Base64 encode the compDefinition JS object
    let encodedCompDef = btoa(JSON.stringify(compDefinition));
    console.log("eventId:" + event.target.dataset.recordId);
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: "/one/one.app#" + encodedCompDef
      }
    });
  }
}
