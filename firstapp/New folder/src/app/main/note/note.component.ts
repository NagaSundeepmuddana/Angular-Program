import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import { DxSelectBoxModule, DxTextBoxModule, DxTemplateModule, DxAutocompleteModule } from 'devextreme-angular';
import { MetadataService } from "../../services/metadata/metadata.service";
import { Notes, NotesDivisionMapping, GetNoteDivisions, NoestoProductLineMapping, PutNoestoProductLineMapping, NotesDivisionMappingSP } from '../../../models/Notes';
import notify from 'devextreme/ui/notify';
import { Division } from '../../../models/division';
import { ProductLines } from '../../../models/ProductLines';
import { UserService } from '../../services/user/user.service';
import { User } from '../../../models/User';
import { Role, Permissions, UserPermissions } from '../../../models/Role';
import { AuthenticationService } from "../../services/auth/authentication.service";
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class noteComponent implements OnInit {
  UserPermissionsList: UserPermissions;
  private NotesList: Notes[] = [];
  note: Notes[] = [];
  NotesDivisionList: GetNoteDivisions[] = [];
  private DivisionList: Division[] = [];
  NotesDivisionMappingList: NotesDivisionMapping[] = [];
  GetDivisionList: NotesDivisionMapping[] = [];
  NotesDivisionsList: NotesDivisionMappingSP[] = [];
  PutNoestoProductLineMapping: PutNoestoProductLineMapping[] = [];
  NotesProductLinesMappingList: NoestoProductLineMapping[] = [];
  NoteProductLineList: NoestoProductLineMapping[] = [];
  private ProductLinesList: ProductLines[] = [];
  popupVisible = false;
  NoteName: string;
  selDivisionList: string;
  Description: string;
  flag: boolean = false;
  Name: string;
  Status: string;
  NotesID: number;
  selectedRows: number[];
  ProductLineID: number = 0;
  selectedRowKeys: number[];
  DivisionListDataSource: any;
  ProductLinesListDataSource: any;
  IsDisabled: boolean = true;
  MapNoteID: number;
  NotesDivisionMapID: number;
  IsProductLines: boolean = false;
  DivisionID: number;
  NotesDvs: string = "";
  NotePrdtLine: string = "";
  loadingVisible = false;
  GetProdLinesByDiv: ProductLines[] = [];
  GetProductLines: NoestoProductLineMapping[] = [];
  UnMappedProductLines: ProductLines[] = [];
  IsPopupDisabled: boolean = false;
  IsCancelBtnDisabled: boolean = false;
  NotestoPrdLineMapPopupVisible: boolean = false;
  ProductLinesNotesPopupVisible: boolean = false;
  saveSuccess: boolean = false;
  message: string;
  ProductLineList: any = [];
  Prdt: any = [];
  UnMappedPrdLineByDivision: DataSource;
  NoteProductLineByComma: string;
  DivisionNotesPopupVisible: boolean = false;
  userProfile: any;
  @ViewChild("NoteDivisionListGrid") itmGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent) dxDataGrid: DxDataGridComponent;
  onToolbarPreparing(e) {
    var toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach((item) => {
      if (item.name == "addRowButton") {
        item.options.text = "Add Note";
        item.options.hint = "Add Note";
        item.options.icon = "";
        item.showText = "always";
        console.log(item);
      }
    });
  }
  constructor(private metaService: MetadataService, private userService: UserService, public auth: AuthenticationService) {
    this.UserPermissionsList = JSON.parse(localStorage.getItem('rolespermissionslist'));
    this.userProfile = this.auth.useProfile;
    //Get Notes Data
    this.GetMyAllNotes();
    this.GetAllDivisionss();
    this.GetProductLiness();
  }

  GetAllDivisionss() {
    this.metaService.GetDivisions("0").subscribe(data => {
      console.log("load Division data");
      console.log(data[0]);
      this.DivisionList = data;
    },
      err => {
        console.log('Division Data Fetch Failed..');
      });
  }
  //Get Product Lines
  GetProductLiness() {
    this.metaService.GetProductLines().subscribe(data => {
      console.log("load Product Lines data");
      console.log(data[0]);
      this.ProductLinesList = data;
    },
      err => {
        notify('Product Lines data fetch failed.', 'Error', 2000);
      });
  }
  GetMyAllNotes() {
    this.metaService.GetAllNotes().subscribe(data => {
      console.log("load Notes data");
      console.log(data[0]);
      this.NotesList = data;
    },
      err => {
        console.log("Notes data fetch failed.");
      });
  }
  ngOnInit() {
  }

  logEvent(e: any) {

  }

  
  onNotesEditorPreparing(e) {
    if (e.dataField == "Notes") {
      e.editorName = "dxTextArea";
      e.editorOptions.height = 70;
    }
  }
  AddNewNote(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("Notes Adding...");
    console.log(e.data.NotesID + " " + e.data.Name + " " + e.data.Notes + " " + e.data.DefaultNote);
    this.metaService.PostNote(e.data.Name, e.data.Notes, e.data.DefaultNote, true,
      this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        console.log(data);
        if (data) {
          console.log(data);
          notify('Note saved successfully.', 'success', 2000);
          this.GetMyAllNotes();
        }
        else {
          this.GetMyAllNotes();
          notify('Note Name already exists.', 'error', 6000);
        }

      }, err => {
        this.GetMyAllNotes();
        notify('Failed to add Notes.', 'Error', 5000);
      });
  }

  /** Edit Notes */
  EditNotes(e) {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log("My edit data" + e.key.Name);
    console.log(e);
    this.metaService.PutNote(e.key.NotesID, e.key.Name, e.key.Notes, e.key.DefaultNote, e.key.Active,
      e.key.CreatedBy, e.key.CreatedDate, this.userProfile.sub, new Date(Date.now())).subscribe(data => {
        if (data) {
          console.log(data);
          notify('Note updated successfully.', 'success', 2000);
          this.GetMyAllNotes();
        }
        else {
          this.GetMyAllNotes();
          notify('Note Description already exists.', 'error', 6000);
        }
      }, err => {
        this.GetMyAllNotes();
        notify('Failed to update Notes.', 'Error', 5000);
      });
  }
  DeleteNotes(e: any) {
    console.log("DELETE STARTED");
    console.log(e.data.NotesID);
    this.metaService.DeleteNotes(e.data.NotesID).subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        notify(data, 'error', 6000);
        this.GetMyAllNotes();
      }
      else {
        notify('Note deleted successfully.', 'success', 2000);
        this.GetMyAllNotes();
      }
    }, err => {
      this.GetMyAllNotes();
      notify('Failed to delete Notes.', 'Error', 2000);
    });
  }

  AfterNotesDelete() {
    console.log("DELETE SUCCESS");
  }
  openProductLinesNotesModal(e: any) {
    this.flag = false;
    this.Name = null;
    if (e.key.NotesID)
      this.NotesID = e.key.NotesID;
    else
      this.NotesID = 0;
    this.DivisionID = 0;
    //this.GetProjectItems(this.ProjectID);
    this.IsProductLines = true;
    this.ProductLinesNotesPopupVisible = true;
    this.GetAllDivisionss();

    this.metaService.GetProductLineByDivId(this.NotesID, 0).subscribe(data => {
      this.NotesProductLinesMappingList = data;
      console.log(this.NotesProductLinesMappingList);
      this.ProductLinesListDataSource = {
        store: {
          type: "array",
          data: this.NotesProductLinesMappingList,
          key: "ProductLineID"
        }
      }
      this.selectedRows = this.NotesProductLinesMappingList.filter(m => m.NotesID === this.NotesID).map(n => n.ProductLineID);
    },
      err => {
        console.log('Product Lines Data Fetch Failed..');
      });

  }
  FilterWithDivisions(e) {
    console.log(e.value);
    this.DivisionID = e.value;
    this.metaService.GetProductLineByDivId(this.NotesID, e.value).subscribe(data => {
      this.NotesProductLinesMappingList = data;
      console.log(this.NotesProductLinesMappingList);
      this.ProductLinesListDataSource = {
        store: {
          type: "array",
          data: this.NotesProductLinesMappingList,
          key: "ProductLineID"
        }
      }
      console.log(this.NotesProductLinesMappingList);
      this.selectedRows = this.NotesProductLinesMappingList.filter(m => m.NotesID === this.NotesID).map(n => n.ProductLineID);
    },
      err => {
        console.log('Product Lines Data Fetch Failed..');
      });
    console.log(this.NotesProductLinesMappingList);
  }
  getFilteredProductLines(options) {
    console.log('prdtlist' + this.ProductLinesList);
    this.metaService.GetProductLineByDivId(this.NotesID, options.value).subscribe(data => {
      this.NotesProductLinesMappingList = data;
      console.log(this.NotesProductLinesMappingList);
      this.ProductLinesListDataSource = {
        store: {
          type: "array",
          data: this.NotesProductLinesMappingList,
          key: "ProductLineID"
        }
      }
      this.selectedRows = this.NotesProductLinesMappingList.filter(m => m.NotesID === this.NotesID).map(n => n.ProductLineID);
    },
      err => {
        console.log('Product Lines Data Fetch Failed..');
      });


  }
  NoteProductLinesSelectionChangedHandler(ProductLineID) {
    if (ProductLineID.length == 0)
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
    this.NotesProductLinesMappingList = [];
    this.NotePrdtLine = "";
    for (var index: number = 0; index < ProductLineID.length; index++) {
      this.NotesProductLinesMappingList.push(ProductLineID[index])
      this.NotePrdtLine += ProductLineID[index] + ",";
    }
    console.log(this.NotePrdtLine);
  }

  SaveNotesProductLines() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    this.loadingVisible = true;
    this.IsDisabled = true;
    this.IsPopupDisabled = true;
    console.log('Note Product Lines list data is');
    console.log(this.NotePrdtLine);
    console.log('Note Product Lines id is');
    console.log(this.DivisionID);

    //SAVE OR UPDATE Notes ProductLines
    this.metaService.PutNotesMappedProductLines(this.NotesID, this.DivisionID, this.NotePrdtLine, true, this.userProfile.sub, new Date(Date.now()), this.userProfile.sub, new Date(Date.now())).subscribe(data => {
      this.NotesProductLinesMappingList = data;
      this.GetMyAllNotes();
      this.loadingVisible = false;
      this.IsPopupDisabled = false;
      this.ProductLinesNotesPopupVisible = false;
      notify('Note Product Lines saved successfully.', 'success', 2000);
    }, err => {
      notify('Failed to save Note Product Lines.', 'Error', 5000);
    });
    this.message = "Product Lines saved successfully.";
    this.saveSuccess = true;
  }
  CloseProductLinesPopup() {
    this.IsDisabled = true;
    this.IsPopupDisabled = false;
    this.ProductLinesNotesPopupVisible = false;
  }
  /** Open ProductLines notes Popup */
  openProductLineNotesModal(e) {
    console.log("Popup opening");
    console.log(e.key.NotesID);
    this.NotesID = e.key.NotesID;
    //GET Notes ProductLines
    this.metaService.GetNotesProductLineMapping(e.key.NotesID).subscribe(data => {
      console.log("load Note Product Lines data");
      this.NotesProductLinesMappingList = data;
      console.log(this.NotesProductLinesMappingList);
      this.ProductLinesListDataSource = {
        store: {
          type: "array",
          data: this.NotesProductLinesMappingList,
          key: "ProductLineID"
        }
      }
      this.selectedRows = this.NotesProductLinesMappingList.filter(m => m.NotesID === e.key.NotesID).map(n => n.ProductLineID);
      console.log(this.selectedRows);
    },
      err => {
        notify('Notes Product Lines Data Fetch Failed.', 'Error', 5000);
      });
    this.ProductLinesNotesPopupVisible = true;
  }
  CreateNotePrdLineMapping() {
    this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    if (this.ProductLineID != null) {
      var map = {
        NotesID: this.MapNoteID,
        DivisionID: this.DivisionID,
        ProductLineIDList: this.NoteProductLineByComma,
        CreatedBy: this.userProfile.sub
      };
      $('#ProductLineID').css("border", "1px solid #dddddd");
      this.metaService.CreateNotePrdLineMapping(map).subscribe(data => {
        this.GetUnmappedProdLines(this.MapNoteID);
        this.GetNotesPrdMapping(this.MapNoteID);
        this.ProductLineID = null;
        notify('Product Line associated successfully.', 'success', 5000);
      },
        err => {
          console.log('Productline data fetch failed');
        });
    } else {
      $('#ProductLineID').css("border", "1px solid red");
      notify('Please select Product Line(s).', 'Error', 5000);
    }
  }
  DeleteNotePrdLineMap(e) {
    this.metaService.DeleteNotePrdLineMapping(e.key.NotesDivisionMapID).subscribe(data => {
      if (data == "OK") {
        notify('Dissociated successfully.', 'success', 2000);
      } else {
        notify(data, 'error', 6000);
      }
      this.GetUnmappedProdLines(this.MapNoteID);
      this.GetNotesPrdMapping(this.MapNoteID);
    },
      err => {
        notify('Exception occured while deleting.', 'error', 6000);
      });
  }
  DivisionChangeEvent(e) {
    this.GetProdLinesByDiv = this.UnMappedProductLines.filter(m => m.DivisionID === e.value);
    this.GetProdLinesByDiv.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
  }

  GetUnmappedProdLines(NotesID) {
    console.log('note' + NotesID);
    this.metaService.GetUnMappedNotePrdLines(NotesID).subscribe(data => {
      this.NoteProductLineByComma == "";
      this.UnMappedProductLines = data;
      this.GetProdLinesByDiv = this.UnMappedProductLines;
      this.GetProdLinesByDiv.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
      this.UnMappedProductLines = data;
      if (this.UnMappedProductLines.length > 0) {
        var Prdt = this.UnMappedProductLines[0].Name.split(', ');
        Prdt.forEach(element => {
          this.ProductLineList.push(element);
          if (this.NoteProductLineByComma == "")
            this.NoteProductLineByComma = element;
          else
            this.NoteProductLineByComma = this.NoteProductLineByComma + ", " + element;
        });
      }
      this.UnMappedPrdLineByDivision = new DataSource({
        store: new ArrayStore({
          data: this.GetProdLinesByDiv,
          key: "ProductLineID",
        }),
        group: "DivisionName"
      });

    },
      err => {
        console.log('Email data fetch failed');
      });
  }

  initNewRow(e) {
    e.data.DefaultNote = false;
  }


  GetNoteProductLineBycommaList(e) {
    this.NoteProductLineByComma = "";
    e.value.forEach(element => {
      if (this.NoteProductLineByComma == "")
        this.NoteProductLineByComma = element;
      else
        this.NoteProductLineByComma = this.NoteProductLineByComma + "," + element;
    });
    if (this.NoteProductLineByComma == "")
      this.IsDisabled = true;
    else
      this.IsDisabled = false;
  }
  /* Note to Prod Line Mapping */
  openNotePrdLineMappingModal(e) {
    console.log('open' + e.key.NotesID);
    this.ProductLineID = null;
    this.DivisionID = null;
    this.NotestoPrdLineMapPopupVisible = true;
    this.MapNoteID = e.key.NotesID;
    this.GetUnmappedProdLines(e.key.NotesID);
    this.GetNotesPrdMapping(e.key.NotesID);
  }
  GetNotesPrdMapping(NotesID) {
    console.log('note' + NotesID);
    this.metaService.GetNotestoprdLineMapping(NotesID).subscribe(data => {
      this.NoteProductLineList = data;
    },
      err => {
        console.log('Notes to ProductLine Mapped data fetch failed');
      });
  }
  CloseNotesPrdLinePopup() {
    this.NotestoPrdLineMapPopupVisible = false;
    $('#ProductLineID').css("border", "1px solid #dddddd");
  }
  //GET FILTERED Notes(Search)
  GetFilternotes(formData: any): void {
    console.log("status is" + formData.Status);
    this.metaService.GetFilteredNotes(formData.NoteName, formData.Description, true).subscribe(data => {
      this.NotesList = data;
      this.note = data;
      console.log("Load filtered Notes data");
      console.log(data);
    },
      err => {
        notify('Filtered Notes Data Fetch Failed.', 'Error', 5000);
      });

    console.log(formData);
    console.log(this.NotesList);
  }
  /**Clear Search Parameters */
  noteClearParameters() {
    this.GetMyAllNotes();
    this.NoteName = null;
    // this.selDivisionList = null;
    this.Description = null;
    this.Status = null;
  }

}
