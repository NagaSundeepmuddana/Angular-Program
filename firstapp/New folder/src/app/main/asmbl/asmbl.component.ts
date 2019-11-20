import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Assembly, AssemblyItem, Item } from '../../../models/Assembly';
import { DxDataGridComponent } from "devextreme-angular";
import { MetadataService } from '../../services/metadata/metadata.service';
import { ProductLines } from '../../../models/ProductLines';
import { Items, UOM } from '../../../models/Items';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Division } from '../../../models/division';
import { AuthenticationService } from "../../services/auth/authentication.service";
import { ProjectService } from '../../services/project/project.service';
import { Project, ProjCategory, ProjSubCategory, AssemblyList, ProjectItem, ProjectAssembly, States, County, ProjectComments } from '../../../models/Project';



@Component({
  selector: 'app-asmbl',
  templateUrl: './asmbl.component.html',
  styleUrls: ['./asmbl.component.css']
})
export class asmblComponent implements OnInit {
  Quantity: number;
  private AssembliesList: Assembly[] = [];
  private AssemblyItemsList: AssemblyItem[] = [];
  private AssembliesItemsList: AssemblyItem[] = [];
  private DivisionList: Division[] = [];
  DivisionName: string[] = [];
  popupVisible = false;
  ProductLineID: number;
  search: string;
  private ItemsList: Items[] = [];
  saveSuccess: boolean = false;
  ProductLine: string;
  Assembly: string;
  Description: string;
  flag: boolean = false;
  Status: string;
  message: string;
  ItemListDataSource: any;
  DivisionID: number;
  AssemblyID: number;
  selectedRows: number[];
  IsDisabled: boolean = true;
  IsPopupDisabled: boolean = false;
  itemPopupVisible: boolean = false;
  IsItems: boolean = true;
  IsAssembies: boolean = false;
  IsNoRecord: boolean = false;
  AsmItems: string = "";
  private ProductLinesList: ProductLines[] = [];
  selectedRowKeys: number[];
  loadingVisible = false;
  IsCancelBtnDisabled: boolean = false;
  ItemID: number;
  userProfile: any;
  ItemList: Item[] = [];
  @ViewChild("itemListGrid") itmGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent
  private AsemblyProductLineName: ProductLines[] = [];
  AsemblyProductLineList :ProductLines[] = [];
  private AssemblyItemList: AssemblyItem[] = [];
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
        item.options.text = "Add Assembly";
        item.options.hint = "Add Assembly";
        item.options.icon = "";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(private metaService: MetadataService, private projectService: ProjectService, private userService: UserService, public auth: AuthenticationService) {
    this.userProfile = this.auth.useProfile;
    this.GetAssembliess();
    this.GetMyItems();
  this.GetAllDivisionss();
  }
  GetAllDivisionss() {
    this.metaService.GetAllDivisions().subscribe(data => {
      this.DivisionList = data;
      this.DivisionList.forEach((element) => {
        this.DivisionName.push(element.Name);
      });
      this.DivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }
  GetMyItems() {
    this.metaService.GetItems().subscribe(data => {
      console.log("load Items data");
      console.log(data[0]);
      this.ItemsList = data;
      console.log(data);
    },
      err => {
        notify('Items Data Fetch Failed.', 'Error', 5000);
      });
  }
  //Get Assembly data
  GetAssembliess() {
    this.metaService.GetAssemblies().subscribe(data => {
      console.log("load Assembly data");
      console.log(data[0]);
      this.AssembliesList = data;
    },
      err => {
        notify('Assembly Data Fetch Failed', 'Error', 5000);
      });
  }

  ngOnInit() {
  }

  AddNewAssembly(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PostAssembly(e.data.DivisionID, e.data.Name, e.data.AssemblyNo, e.data.AltDescription, e.data.ExternalSystemRefNo, true,
      this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Assembly saved successfully.', 'success', 3000);
          this.GetAssembliess();
        }
        else {
          this.GetAssembliess();
          notify('Assembly Name already exists.', 'error', 6000);
        }
      }, err => {
        this.GetAssembliess();
        notify('Failed to save Assembly.', 'Error', 5000);
      });
    console.log("Assembly Adding...end");
  }

  /** Edit Assembly */
  EditAssembly(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.metaService.PutAssembly(e.key.DivisionID, e.key.AssemblyID, e.key.Name, e.key.AssemblyNo, e.key.AltDescription, e.key.ExternalSystemRefNo, e.key.Active,
      e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Assembly updated successfully.', 'success', 3000);
          this.GetAssembliess();
        }
        else {
          this.GetAssembliess();
          notify('This Assembly Name already exists. Please enter different Name.', 'error', 6000);
        }
      }, err => {
        this.GetAssembliess();
        notify('Failed to update Assembly.', 'Error', 5000);
      });
  }
  /** Delete AsmItems */
  DeleteAssemblies(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.AssemblyID);
    this.metaService.DeleteAssemblies(e.data.AssemblyID).subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        notify(data, 'error', 2000);
        this.GetAssembliess();
      }
      else {
        this.GetAssembliess();
        notify('Assembly deleted successfully.', 'success', 3000);
      }
    }, err => {
      this.GetAssembliess();
      notify('Failed to delete Assembly.', 'Error', 5000);
    });
  }
  AfterAssembliesDelete() {
    console.log("DELETE SUCCESS");
  }
  AssemblyItemOnChange(e) {
    console.log(e.value);
    this.ItemID = e.value;
  }
  openItemsModal(e) {
    console.log("Popup opening");
    this.search = null;
    console.log(e.key.ProductLineID);
    this.ProductLineID = e.key.ProductLineID;
    this.DivisionID = e.key.DivisionID;
    this.AssemblyID = e.key.AssemblyID;
    this.Quantity = +$('#Quantity').val();
    $('#serachItemsOrAssemblyBox').val('');
    this.LoadAssemblyItems();
    this.itemPopupVisible = true;
    this.FilterWithProductLine();
  }
  LoadAssemblyItems() {
    //GET Assembly items
    this.metaService.GetAssemblieItems(this.AssemblyID).subscribe(data => {
      console.log("load Assembly items data");
      this.AssemblyItemList = data;
      console.log(this.AssemblyItemList);
      this.ItemListDataSource = {
        store: {
          type: "array",
          data: this.AssemblyItemList,
          key: "ItemID"
        }
      }
      this.selectedRows = this.AssemblyItemList.filter(m => m.ProductLineID === this.ProductLineID).map(n => n.ItemID);
      this.AssemblyItemList = this.AssemblyItemList.filter(m => m.AssemblyID === this.AssemblyID)
      console.log(this.selectedRows);
    },
      err => {
        notify('Assembly items Data Fetch Failed.', 'Error', 5000);
      });
  }
  itemSelectionChangedHandler(itemsId) {
    console.log('Assembly items Data selected start.');
    console.log(itemsId.length);
    if (itemsId.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    console.log('Assembly items Data selected end.');
    this.AssemblyItemList = [];
    this.AsmItems = "";
    for (var index: number = 0; index < itemsId.length; index++) {
      this.AssemblyItemList.push(itemsId[index])
      this.AsmItems += itemsId[index] + ",";
    }
    console.log("the string is");
    console.log(this.AsmItems);
  }

  SaveItems() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.loadingVisible = true;
    this.IsDisabled = true;
    this.IsPopupDisabled = true;
    console.log('Assembly list data is');
    console.log(this.AsmItems);
    console.log('Assembly id is');
    console.log(this.AssemblyID);

    //SAVE OR UPDATE Assembly ITEMS
    this.metaService.PutAssemblyItems(this.AssemblyID, this.AsmItems, 1, true, this.userProfile.sub, new Date(Date.now()), this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.AssemblyItemsList = data;
      this.loadingVisible = false;
      this.IsPopupDisabled = false;
      this.itemPopupVisible = false;
      notify('Assembly items saved successfully.', 'success', 3000);
    }, err => {
      notify('Failed to save Assembly items.', 'Error', 5000);
    });
    this.message = "Item saved successfully.";
    this.saveSuccess = true;
  }
  AddAssemblyItem(e, quantity: number) {
    console.log('Quantity' + quantity);
    if ($('#Quantity').val() == "")
      this.Quantity = 1;
    else
      this.Quantity = +$('#Quantity').val();
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.ItemList = this.ItemList.filter(m => m.ItemID != e.ItemID);
    console.log(this.Quantity);
    console.log("Assembly Item Adding...");
    console.log(this.AssemblyID);
    this.metaService.PostAssemblyItems(this.AssemblyID, e.ItemID, this.Quantity, true, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.AssemblyItemsList = data;
      this.LoadAssemblyItems();
      notify('Item added successfully.', 'success', 3000);
    }, err => {
      this.LoadAssemblyItems();
      notify('Failed to save Assembly Items.', 'Error', 5000);
    });
    console.log("Assembly Items Adding...end");

  }
  CloseMatAjax(e) {
    console.log('test'+e.target.classList);
    if (e.target.classList.contains('serachItems') || e.target.classList.contains('fa-plus')) {
      this.flag = true;
    }
    else {
      this.flag = false;
      this.ItemList = [];
      this.AssemblyItemsList = [];
      var val = $('#serachItemsOrAssemblyBox').val().toString();
      if ($.trim(val) == '')
        $('#serachItemsOrAssemblyBox').val('');
    }

  }
  // CloseEscapeKey(e) {
  //   let Keydown = e.keyCode;
  //   if (Keydown === 27) {
  //       console.log('Escape');
  //       this.flag = false;
  //       this.search = null;
  //     }
  //     else
  //     this.flag = true;
  //     this.ItemList = [];
  //     this.AssemblyItemsList = [];
  //     var val = $('#serachItemsOrAssemblyBox').val().toString();
  //     if ($.trim(val) == '')
  //       $('#serachItemsOrAssemblyBox').val('');
  // }
  
  addnewItem(e) {
    console.log(e);
    this.ProductLineID = e.key.ProductLineID;
    this.AssemblyID = e.key.AssemblyID;
  }
  CloseAsemblyItemsPopup() {
    this.IsDisabled = true;
    this.IsPopupDisabled = false;
    this.itemPopupVisible = false;
    this.search = null;
    this.DivisionID = null;
  }
  
  // FilterWithDivisions(e) {
  //   this.DivisionID = e.value;
  //   this.ProductLineID = null;
  //   this.metaService.GetProductLinesByDivId(e.value).subscribe(data => {
  //     this.ProductLinesList = data;
  //     this.ProductLinesList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
  //   },
  //     err => {
  //       console.log('Product lines Data Fetch Failed..');
  //     });
  // }

    /** Get ProductLine */
    FilterWithProductLine(){
    this.metaService.GetProductLines().subscribe(data => {
      console.log(data);
      this.AsemblyProductLineName = data;
      this.AsemblyProductLineList = this.AsemblyProductLineName.filter(m => m.DivisionID === this.DivisionID);
      this.AsemblyProductLineList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
    },
      err => {
        notify('Product Line Data Fetch Failed.', 'Error', 5000);
      });
    }
  SearchItems(e) {
    console.log(this.ProductLineID);
    console.log('test' + e);
    if (e.length > 1) {
      if (this.ProductLineID == undefined)
      this.ProductLineID = 0;
      this.metaService.GetItemsBySearchParam("Items", this.AssemblyID, this.ProductLineID, e).subscribe(data => {
        this.ItemList = data;
        if (this.ItemList.length == 0)
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
  UpdateItemQty(e: any) {
    console.log(e);
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    var AssemblyItem = {
      Quantity: e.data.Quantity,
      ItemID: e.key.ItemID,
      AssemblyID: this.AssemblyID,
      LastModifiedBy: this.userProfile.sub,
    }
    this.metaService.UpdateItemQty(AssemblyItem).subscribe(data => {
      if (data) {
        this.LoadAssemblyItems();
        notify('Quantity updated successfully.', 'success', 2000);
      }
    }, err => {
    });
  }

  /** Delete AsmItems */
  DeleteAssembliesItems(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.AssemblyPartID);
    this.metaService.DeleteAssembliesItems(e.data.AssemblyPartID).subscribe(data => {
      this.LoadAssemblyItems();
      notify('Item deleted successfully.', 'success', 2000);
    }, err => {
      this.LoadAssemblyItems();
      notify('Failed to delete Assembly Items.', 'Error', 5000);
    });
  }
  /**Clear Search Parameters */
  AssemblyClearParameters() {
    this.Assembly = null;
    this.ProductLine = null;
    this.Description = null;
    this.Status = null;
  }
  logEvent(e: any) {
    console.log("e");
  }
}
