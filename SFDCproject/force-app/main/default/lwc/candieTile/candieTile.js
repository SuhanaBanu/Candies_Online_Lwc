import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class CandieTile extends NavigationMixin(LightningElement) {
  @api pass_val;
  @api selectedrecID = "";

  /** 
  * desc: navigate to candiesPopup page
  * param: event attribute
  */
  navigateToDetailsPage(event) {
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
    //console.log('eventId:'+event.target.dataset.recordId);
    console.log("base 64" + encodedCompDef);
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        // apiName:'Candies_Popup',
        url: "/one/one.app#" + encodedCompDef
      }
    });
    console.log("/one/one.app#" + encodedCompDef);
  }  
}
