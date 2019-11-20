import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Items, UOM, AssemblyItems } from '../../../models/Items';
import { MetadataService } from '../../services/metadata/metadata.service';
import { ProductLines } from '../../../models/ProductLines';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { AuthenticationService } from "../../services/auth/authentication.service";
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxSelectBoxModule
} from 'devextreme-angular';
import 'devextreme/data/odata/store';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class itemComponent implements OnInit {
  ItemTariffFile: any[] = [];
  UserPermissionsList: UserPermissions;
  typeValue:string;
  defaultType: string;
  SelectedProductLineID: number;
  IsImportFilePopupVisible: boolean = false;
  readOnlyOptions = {}; 
  flag: boolean = false;
  AddItemsToAssemblyList: Items[] = [];
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private ItemsList: Items[] = [];
  item: Items[] = [];
  search: string;
  AssemblyItems : AssemblyItems[] = [];
  AssemblyItemsSearch : AssemblyItems[] = [];
  private SavedAssemblyItems: AssemblyItems[] = [];
  popupVisible = false;
  ProductLine: string;
  Description: string;
  Quantity: number;
  AssemblyItemID:number;
  private ItemCode: string;
  Status: string;
  ProductLineID: number;
  ItemID: number;
  IsItems: boolean = true;
  IsNoRecord: boolean = false;
  CustomStore: any;
  ItemCodedisabled : boolean = false;
  ItemPopupVisible: boolean=false;
  userProfile: any;
  loadingVisible = false;
  IsDisabled: boolean = true;
  IsPopupDisabled: boolean = false;
  itemPopupVisible:boolean = false;
  private GetProductLineName: ProductLines[] = [];
  private GetProductLineNameByOrder: ProductLines[] = [];
  private UOMList: UOM[] = [];
  ItemsdataSource: any = {};
  pagelength: number = 10;
  Items: Items = new Items();
  searchPrdLine: number = 0;
  value: any;
  RoundingType: any = [{ Rounding: "N", Name: "None" },{ Rounding: "C", Name: "Ceiling" }, { Rounding: "F", Name: "Floor" }]; //{ Rounding: "N", Name: "None" },
  Rounding: string = "Ceiling";
  ItemType: any = [{ Type: "I", Name: "Item" }, { Type: "A", Name: "Assembly" }];
  CurrencyFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if (cellInfo.value == null)
      cellInfo.value = 0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Item/Assembly";
        item.options.hint = "Add Item/Assembly";
        item.options.icon = "";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(public http: Http, private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.getFilteredProductLines = this.getFilteredProductLines.bind(this);
    this.userProfile = this.auth.useProfile;
    /** Get Items */
    this.GetMyProductline();
    /** Get ProductLine */
    //this.GetMyItems();
    this.GetMyUOM();
    this.ItemsdataSource.store = new CustomStore({
      load: function (loadOptions: any) {
        this.pagelength = loadOptions.take;
        var prdline = 0;
        if (this.searchPrdLine)
          prdline = this.searchPrdLine;
        var params = '?';
        params += 'skip=' + loadOptions.skip || 0;
        params += '&take=' + loadOptions.take || 12;
        params += '&ProductLineID=' + $('#hidProductlineID').val();
        params += '&ItemCode=' + $('#SearchItemCode').val();
        params += '&Description=' + $('#Description').val();

        if (loadOptions.sort) {
          params += '&orderby=' + loadOptions.sort[0].selector;
          if (loadOptions.sort[0].desc) {
            params += ' desc';
          }
        }
        return http.get(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint.replace('/', '') + params)
          .toPromise()
          .then(response => {
            var json = response.json();
            return {
              data: json.items,
              totalCount: json.totalCount
            }
          })
          .catch(error => { throw 'Data Loading Error' });
      }, insert(value: Items) {
        this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
        value.CreatedBy = this.userProfile.sub;
        //value.ProductLineID = this.SelectedProductLineID;
        return http.post(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint, value)
          .toPromise()
          .then(response => {
            //var json = response.json();
            var msg = response.text().replace('"', '').replace('"', '');
            console.log(msg);
            if (msg == "NO")
              notify("Item Code already exists.", 'error', 6000);
            else
              notify('Item saved successfully.', 'success', 3000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      }, update(key, value: Items) {
        console.log(value);
        if (value.ItemCode)
          key.ItemCode = value.ItemCode;
        if (value.Description)
          key.Description = value.Description;
        if (value.ProductLineID)
          key.ProductLineID = value.ProductLineID;
        if (value.ProductLineID == null)
          key.ProductLineID = value.ProductLineID;
        if (value.Type)
          key.Type = value.Type;
        if (!value.AltCode)
          key.AltCode = value.AltCode;
        if (value.AltCode)
          key.AltCode = value.AltCode;
        if (value.UOMID)
          key.UOMID = value.UOMID;
        if (!value.ExternalSystemRefNo)
          key.ExternalSystemRefNo = value.ExternalSystemRefNo;
        if (value.ExternalSystemRefNo)
          key.ExternalSystemRefNo = value.ExternalSystemRefNo;
        if (value.Weight == "0")
          key.Weight = value.Weight;
        else if (value.Weight)
          key.Weight = value.Weight;
        if (value.UnitPrice == "0")
          key.UnitPrice = value.UnitPrice;
        else if(value.UnitPrice)
          key.UnitPrice = value.UnitPrice;
        if (value.ListPrice == "0")
          key.ListPrice = value.ListPrice;
        else if(value.ListPrice)
          key.ListPrice = value.ListPrice;
        if (value.Rounding)
          key.Rounding = value.Rounding;

        this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
        key.LastModifiedBy = this.userProfile.sub;
        console.log(key);
        return http.put(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint + key.ItemID, key)
          .toPromise()
          .then(response => {
            var msg = response.text().replace('"', '').replace('"', '');
            console.log(msg);
            if (msg == "NO")
              notify("Item Description already exists.", 'error', 6000);
            else
              notify('Item updated successfully.', 'success', 3000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      }
      , remove(key) {
        console.log(key.ItemID);
        return http.delete(EndPointsConfig.HostName + EndPointsConfig.ItemsEndPoint + key.ItemID)
          .toPromise()
          .then(response => {
            //var json = response.json();
            console.log(response);
            console.log(response.text());
            var msg = response.text().replace('[', '').replace(']', '').replace('"', '');
            if (msg.length > 0)
              notify(msg, 'error', 2000);
            else
              notify('Item deleted successfully.', 'success', 2000);
            return null;
          })
          .catch(error => { throw 'Data Loading Error' });
      }
    });
  }
  InitNewItem(e){
    e.data.Rounding = this.RoundingType[0].Rounding;
    e.data.Type = "I";
  }
  GetMyProductline() {
    this.metaService.GetProductLines().subscribe(data => {
      console.log("load ProductLine data");
      console.log(data);
      this.GetProductLineName = data;
      this.GetProductLineName.forEach(element => {
        element.Type = "I"
      });
    //   var None = {
    //     ProductLineID : 57,
    //     DivisionID : null,
    //     Name : "NONE",
    //     AltName : "None",
    //     ExternalSystemRefNo : "None",
    //     Active : true,
    //     CreatedBy : "None",
    //     CreatedDate : new Date(),
    //     LastModifiedBy: null,
    //     LastModifiedDate : null,
    //     DivisionName: "None",
    //     Type: "A"
    // }
    //   this.GetProductLineName.push(None);
      //this.GetProductLineName=this.GetProductLineName.sort(name)
      this.GetProductLineName.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        notify('ProductLine Data Fetch Failed.', 'Error', 2000);
      });
  }

  setStateValue(rowData: any, value: any): void {
    rowData.ProductLineID = null;
    (<any>this).defaultSetCellValue(rowData, value);
  }

  getFilteredProductLines(options) {
    return {
      store: this.GetProductLineName,
      filter: options.data ? ["Type", "=", options.data.Type] : null
    };
  }

  GetMyItems() {
    this.metaService.GetItems().subscribe(data => {
      console.log("load Items data");
      console.log(data[0]);
      this.ItemsList = data;
    },
      err => {
        notify('Items Data Fetch Failed.', 'Error', 2000);
      });
  }

  CloseItemPopup(){
    this.ItemPopupVisible=false;
    this.ProductLineID=null;
  }
  openItemModal(e){
    this.search = null;
    this.AssemblyItemID=e.data.ItemID;
    this.Quantity = +$('#Quantity').val();
    this.LoadAssemblyItems();
    this.ItemPopupVisible=true;
    this.GetMyProductline();
  }

  initNewRow(e)
  {
    e.data.Type = "I";
    //this.defaultType = "A";
    //this.SelectedProductLineID = null;
  }
 
  LoadAssemblyItems() {
    this.metaService.GetAssemblyItems(this.AssemblyItemID).subscribe(data => {
      console.log("load Assembly items data");
      this.AssemblyItems = data;
    },
      err => {
        notify('Assembly items Data Fetch Failed.', 'Error', 5000);
      });
  }

  AddAssemblyItem(e, quantity: number) {
    this.ItemID=e.ItemID;
    console.log(this.ItemID +e);
    this.Quantity = $('#'+e.ItemID).val() == ""? 1 : +$('#'+e.ItemID).val();
    // alert($('#Quantity').val());
    // if ($('#Quantity').val() == "")
    //   this.Quantity = 1;
    // else
    //   this.Quantity = +$('#Quantity').val();
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.AssemblyItems = this.AssemblyItems.filter(m => m.ItemID != e.ItemID);
    this.AssemblyItemsSearch =  this.AssemblyItemsSearch.filter(m=>m.ItemID != e.ItemID);
    this.metaService.SaveItems(this.AssemblyItemID,this.ItemID,this.Quantity, true, this.userProfile.sub, new Date(Date.now()), this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.SavedAssemblyItems = data;
      this.LoadAssemblyItems();
      notify('Item added successfully.', 'success', 3000);
    }, err => {
      this.LoadAssemblyItems();
      notify('Failed to save Assembly Items.', 'Error', 5000);
    });
    console.log("Assembly Items Adding...end");

  }
  UpdateItemQty(e: any) {
    console.log(e);
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var AssemblyItem = {
      ItemID: e.key.ItemID,
      AssemblyItemID: e.key.AssemblyItemID,
      Quantity: e.data.Quantity,
      LastModifiedBy: this.userProfile.sub
    }
    this.metaService.UpdateAsblyItemQty(AssemblyItem).subscribe(data => {
      if (data) {
        this.LoadAssemblyItems();
        notify('Quantity updated successfully.', 'success', 2000);
      }
    }, err => {
    });
  }
  SearchItems(e) {
    if (e.length == 3 || e.length > 3) {
      if (this.ProductLineID == undefined)
      this.ProductLineID = 0;
      this.metaService.GetItemsSearchParam("Items", this.ProductLineID, e).subscribe(data => {
        this.AssemblyItemsSearch = data;
        if (this.AssemblyItemsSearch.length == 0)
          this.IsNoRecord = true;
        else
          this.IsNoRecord = false;
        this.flag = true;
        this.IsItems = true;
      },
        err => {
          console.log('Items Data Fetch Failed..');
        });
    }
    else
    this.flag = false;
  }
    /** Delete AsmItems */
    DeleteAssembliesItems(e: any) {
      console.log(e);
      console.log(e.data.ItemID);
      this.metaService.DeleteAssemblyItems(e.data.ItemID, e.data.AssemblyItemID).subscribe(data => {
        this.LoadAssemblyItems();
        notify('Item deleted successfully.', 'success', 2000);
      }, err => {
        this.LoadAssemblyItems();
        notify('Failed to delete Assembly Items.', 'Error', 5000);
      });
    }
    CloseMatAjax(e) {
      console.log('test'+e.target.classList);
      if (e.target.classList.contains('serachItems') || e.target.classList.contains('fa-plus')) {
        this.flag = true;
      }
      else {
        this.flag = false;
        var val = $('#serachItemsOrAssemblyBox').val().toString();
        if ($.trim(val) == '')
          $('#serachItemsOrAssemblyBox').val('');
      }
  
    }

  GetMyUOM() {
    this.metaService.GetUOM().subscribe(data => {
      console.log("load UOM data");
      console.log(data[0]);
      this.UOMList = data;
      this.UOMList.sort(function (a, b) { return (a.UOM > b.UOM) ? 1 : ((b.UOM > a.UOM) ? -1 : 0); });
    },
      err => {
        notify('UOM Data Fetch Failed.', 'Error', 2000);
      });
  }
  ngOnInit() {
  }
  // GetMyProductline() {
  //   this.metaService.GetProductLines().subscribe(data => {
  //     console.log("load ProductLine data");
      
  //     this.GetProductLineName = data;
  //     console.log(this.GetProductLineName);
  //     //this.GetProductLineName=this.GetProductLineName.sort(name)
  //     this.GetProductLineName.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
  //   },
  //     err => {
  //       notify('ProductLine Data Fetch Failed.', 'Error', 2000);
  //     });
  // }

  onItemEditorPreparing(e)
  {
    e.editorOptions.disabled = e.parentType == "dataRow" && e.dataField == "ItemCode" && !e.row.inserted;  
    if (e.dataField == "ProductLineID") {
      var grid = e.component;
      var index = e.row.rowIndex;
      var value = grid.cellValue(index, "Type");
      if (value=="A")
         e.editorOptions.disabled = true;
  }
  if (e.dataField == "Weight") {
    var grid = e.component;
    var index = e.row.rowIndex;
    var value = grid.cellValue(index, "Type");
    if (value=="A")
       e.editorOptions.disabled = true;
}
if (e.dataField == "UnitPrice") {
  var grid = e.component;
  var index = e.row.rowIndex;
  var value = grid.cellValue(index, "Type");
  if (value=="A")
     e.editorOptions.disabled = true;
}
if (e.dataField == "ListPrice") {
  var grid = e.component;
  var index = e.row.rowIndex;
  var value = grid.cellValue(index, "Type");
  if (value=="A")
     e.editorOptions.disabled = true;
}
    // if (e.parentType == "dataRow" && !e.row.inserted && e.row.data.Type == "I") 
    // {
    //   this.defaultType = "I";
    //   this.SelectedProductLineID = e.row.data.ProductLineID;
    //   let standardHandler = e.editorOptions.onValueChanged;
    //   e.editorOptions.onValueChanged = (args) => {
    //     if(args.value == "I")
    //     {
    //       e.setValue({
    //         ProductLineID: null,
    //       });
    //       standardHandler(e);
    //     }
    //     else
    //     {
    //       console.log(e.row.data.ProductLineID);
    //       e.row.data.ProductLineID = 55;
    //       // e.setValue({
    //         standardHandler(e);
    //       // });
    //     }
        
    //     console.log(args.value);
    //     e.component.cellValue(e.row.rowIndex, 'text', "ProductLineID " + args.value);
    //   }
    //  }
    //  if (e.parentType == "dataRow" && !e.row.inserted && e.row.data.Type == "A") 
    //  {
    //    this.defaultType = "A";
    //    this.SelectedProductLineID = null;
    //  }
  }

  AddNewItem(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("----------" + e.data.Type);
    console.log(e.data.ItemID + " " + e.data.ProductLineID + " " + e.data.ItemNo + " " + e.data.ItemCode + " " + e.data.AltCode);
    this.metaService.PostItem(e.data.Type,e.data.ProductLineID, e.data.ItemCode, e.data.AltCode,
      e.data.Description, e.data.UOMID, e.data.ExternalSystemRefNo, e.data.ApproxQuantity, e.data.Weight, e.data.UnitPrice, e.data.ListPrice, e.data.Amount, true,
      this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Items saved successfully.', 'success', 2000);
          this.GetMyItems();
        }
        else {
          this.GetMyItems();
          notify('Item Code already exists.', 'error', 2000);
        }
      }, err => {
        this.GetMyItems();
        notify('Failed to save Items.', 'Error', 2000);
      });
    console.log("Item Adding...end");
  }

  /** Edit Item */
  EditItem(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("My edit data" + e.key.Name);
    console.log(e);
    this.metaService.PutItem(e.key.ItemID, e.key.ProductLineID, e.key.ItemCode, e.key.AltCode,
      e.key.Description, e.key.UOMID, e.key.ExternalSystemRefNo, e.key.ApproxQuantity, e.key.Weight, e.key.UnitPrice, e.key.ListPrice, e.key.Amount, e.key.Active,
      e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Item updated successfully.', 'success', 2000);
          this.GetMyItems();
        }
        else {
          this.GetMyItems();
          notify('This Item Code already exists. Please enter different Item Code.', 'error', 2000);
        }
      }, err => {
        this.GetMyItems();
        notify('Failed to update Items.', 'Error', 2000);
      });
  }
  DeleteItem1(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.ItemID);
    this.metaService.DeleteItem(e.data.ItemID).subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        notify(data, 'error', 2000);
        this.GetMyItems();
      }
      else {
        this.GetMyItems();
        notify('Item deleted successfully.', 'success', 2000);
      }
    }, err => {
      this.GetMyItems();
      notify('Failed to delete Items.', 'Error', 2000);
    });
  }

  AfterItemDelete() {
    console.log("DELETE SUCCESS");
  }

  //GET FILTERED Items(Search)
  GetFilterItems() {
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      userData: {},
      searchPrdLine: this.searchPrdLine
    }
    this.dataGrid.instance.refresh();
  }

  SetSelectedProductline(m) {
    this.searchPrdLine = m.value;
    console.log(this.searchPrdLine);
    $('#hidProductlineID').val(this.searchPrdLine);
  }
  /**Clear Search Parameters */
  ItemClearParameters() {
    //this.GetMyItems();
    this.searchPrdLine = null;
    $('#hidProductlineID').val('');
    this.ProductLine = null;
    this.Description = null;
    this.ItemCode = null;
    this.Status = null;
    var ds = {
      requireTotalCount: true,
      searchExpr: undefined,
      searchOperation: "contains",
      searchValue: null,
      skip: 0,
      sort: null,
      take: this.pagelength,
      userData: {}
    };
    this.dataGrid.instance.refresh();
  }
  logEvent(e: any) {
    console.log("e");
  }
  CloseAssemblyItemsPopup(){
      //this.GetAllProjects();
      var ds = {
        requireTotalCount: true,
        searchExpr: undefined,
        searchOperation: "contains",
        searchValue: null,
        skip: 0,
        sort: null,
        take: this.pagelength,
        userData: {},
        searchPrdLine: this.searchPrdLine
      }
      this.dataGrid.instance.refresh();
  }

  ImportFileConfirmation()
  {
    this.IsImportFilePopupVisible = true;
  }

  DontImportItemsFile()
  {
    this.IsImportFilePopupVisible = false;
  }
 
}
