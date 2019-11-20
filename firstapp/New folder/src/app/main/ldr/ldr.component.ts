import { Component, OnInit } from '@angular/core';
import { DxSelectBoxModule, DxTextBoxModule, DxTemplateModule, DxAutocompleteModule } from 'devextreme-angular';
import { MetadataService } from "../../services/metadata/metadata.service";
import { Customer } from "../../../models/customers";
import { Division } from "../../../models/division";
import notify from 'devextreme/ui/notify';
//import { FormsModule } from '@angular/forms';

/**
 * 
 * 
 * @export
 * @class LdrComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-ldr',
  templateUrl: './ldr.component.html',
  styleUrls: ['./ldr.component.css']
})
export class LdrComponent implements OnInit {
  private CustomersList: Customer[] = [];
  private DivisionsList: Division[] = [];
  selCustomer: any;
  FromDate: string;
  ToDate: string;
  DOTIndicator: boolean = true;
  selDivisionList: any;
  ldrReportData: any;
  Customer: any;
  ldrReportLoading: boolean = false;

  /**
   * Creates an instance of LdrComponent.
   * @param {MetadataService} metaService 
   * @memberof LdrComponent
   */
  constructor(private metaService: MetadataService) {
    var _localCustData = JSON.parse(window.localStorage.getItem('Customers'));
    if (_localCustData != null) {
      this.CustomersList = _localCustData;
    } else {
      this.metaService.GetCustomers("0").subscribe(data => {
        window.localStorage.setItem('Customers', JSON.stringify(data));
        console.log(data);
        this.CustomersList = data;
      },
        err => {
          console.log('Customer Data Fetch Failed..');
        });
    }

    //Get Divisions Data
    var _localDivData = JSON.parse(window.localStorage.getItem('Divisions'));
    if (_localDivData != null) {
      this.DivisionsList = _localDivData;
    } else {
      this.metaService.GetDivisions("0").subscribe(data => {
        window.localStorage.setItem('Divisions', JSON.stringify(data));
        console.log(data);
        this.DivisionsList = data;
      },
        err => {
          console.log('Division Data Fetch Failed..');
        });
    }
  }

  /**
   * 
   * 
   * @memberof LdrComponent
   */
  ngOnInit() {

  }

  /**
   * 
   * Generate Letting Date Report.
   * @memberof LdrComponent
   */
  GenerateReport(formData: any): void {
    //notify("This is test..", "error", 3000);
    this.ldrReportLoading = true;
    // var Cust_id = null;
    // if(this.selCustomer){
    //   Cust_id = this.selCustomer.CUST_ID;
    // }
    this.ldrReportData = null;
    this.GetLDRReportData(formData.FromDate, formData.ToDate, formData.DOTIndicator, formData.Customer, formData.selDivisionList);
    console.log(formData);
  }

  /**
   * 
   * 
   * @param {any} m 
   * @memberof LdrComponent
   */
  SetSelectedCustomer(m) {
    this.selCustomer = m.selectedItem;
  }

  /**
   * 
   * 
   * @memberof LdrComponent
   */
  GetLDRReportData(FromDate: string, ToDate: string, TxDot: string, CustomerID: number, DevisioLst: string) {
    this.metaService.GetLDRReportData(FromDate, ToDate, TxDot, CustomerID, DevisioLst).subscribe(data => {
      this.ldrReportLoading = false;
      this.ldrReportData = {
        fields: [{
          caption: 'Project',
          width: '350',
          dataField: 'PROJECTNAME',
          area: 'row'
        }, {
          dataField: 'DIVNAME',
          dataType: 'string',
          area: 'column'
        }, {
          caption: 'Total Price($)',
          dataField: 'TOTALPRICE',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency fixedPoint',
          area: 'data'
        }, {
          caption: 'Margin (%)',
          dataField: 'MARGIN',
          dataType: 'number',
          format: 'decimal',
          summaryType: 'sum',
          area: 'data'
        }],
        store: data
      }
      console.log(this.ldrReportData);
    }, err => {

    });
  }

  /**
   * 
   * 
   * @param {any} m 
   * @memberof LdrComponent
   */
  SetSelectedDivision(m) {
    console.log(m);
  }

  ClearParameters() {
    this.FromDate = null;
    this.ToDate = null;
    this.DOTIndicator = null;
    this.Customer = null;
    this.selDivisionList = null;
  }
}
