import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import SAMPLEMC from "@salesforce/messageChannel/sfdcdemo__c";
import cattable from "@salesforce/apex/CatProd.getCategories";
import brandtable from "@salesforce/apex/CatProd.getBrands";
import makerstable from "@salesforce/apex/CatProd.getMakers";

export default class CandieFilter extends LightningElement {
  brandOptionList;
  makersOptionList;
  categoriesOptionList;
  selectedBrand;
  selectedCategory;
  selectedMaker;
  test1;
  searchKey = "";
  
  @wire(MessageContext)
  messageContext;

  /**
  * desc: wiring apex method to retrive all category names
  */
  @wire(cattable)
  retrieveCats({ error, data }) {
    let tempArray = [];
    if (data) {
      for (let key in data) {
        tempArray.push({ label: data[key], value: key });
      }
    }
    this.categoriesOptionList = tempArray;
  }

  /**
  * desc: wiring apex method to retrive all brand names
  */
  @wire(brandtable)
  retrieveBrands({ error, data }) {
    let tempArray = [];
    if (data) {
      for (let key in data) {
        tempArray.push({ label: data[key], value: key });
      }
    }
    this.brandOptionList = tempArray;
  }

  /**
  * desc: wiring apex method to retrive all maker names
  */
  @wire(makerstable)
  retrieveMakers({ error, data }) {
    let tempArray = [];
    if (data) {
      for (let key in data) {
        tempArray.push({ label: data[key], value: key });
      }
    }
    this.makersOptionList = tempArray;
  }

  /**
  * desc: function to get the value entered on search box and publish the message to other components
  * param: event attribute
  */
  handleTextChange(event) {
    this.searchKey = event.target.value;
    console.log("start " + this.searchKey);
    const message = {
      conlist: this.searchKey
    };
    publish(this.messageContext, SAMPLEMC, message);
    console.log("handletextchangepublished" + this.searchKey);
  }
  
  /**
  * desc: function to assign the value entered on search box to message parameter
  */
  resethandler() {
    this.searchKey = "";
    const message = {
      conlist: this.searchKey
    };
    publish(this.messageContext, SAMPLEMC, message);
    console.log("resethandlerpublished" + this.searchKey);
  }

  /**
  * desc: this function is called whenever the component is loaded
  */
  connectedCallback() {
    setTimeout(() => {
      this.resethandler();
      console.log("timeout over");
    }, 1000);
  }

  /** 
  * desc: function to get the category selected on combo box and assign it to message parameter to publish
  * param: event attribute
  */
  handleCategoryChange(event) {
    this.selectedCategory = event.target.value;
    const message = {
      brandSelected: this.selectedBrand,
      makerSelected: this.selectedMaker,
      categorySelected: this.selectedCategory
    };
    publish(this.messageContext, SAMPLEMC, message);
    console.log("handleCategoryChangepublished" + this.selectedCategory);
  }

  /** 
  * desc: function to get the brand selected on combo box and assign it to message parameter to publish
  * param: event attribute
  */
  handleBrandChange(event) {
    this.selectedBrand = event.target.value;
    const message = {
      brandSelected: this.selectedBrand,
      makerSelected: this.selectedMaker,
      categorySelected: this.selectedCategory
    };
    publish(this.messageContext, SAMPLEMC, message);
    console.log("handlebrandchange " + this.selectedBrand);
  }

  /** 
  * desc: function to get the maker selected on combo box and assign it to message parameter to publish
  * param: event attribute
  */
  handleMakerChange(event) {
    this.selectedMaker = event.target.value;
    const message = {
      brandSelected: this.selectedBrand,
      makerSelected: this.selectedMaker,
      categorySelected: this.selectedCategory
    };
    publish(this.messageContext, SAMPLEMC, message);
    console.log("handlemakerchange " + this.selectedMaker);
  }
}
