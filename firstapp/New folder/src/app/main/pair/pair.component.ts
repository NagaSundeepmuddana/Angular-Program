import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MetadataService } from '../../services/metadata/metadata.service';
import notify from 'devextreme/ui/notify';
import { UserService } from '../../services/user/user.service';
import { ProductLines } from '../../../models/ProductLines';
import { User } from '../../../models/User';
import { AuthenticationService } from "../../services/auth/authentication.service";
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { Http, HttpModule } from '@angular/http';
import { EndPointsConfig } from "../../../models/endpointsconfig";
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import 'devextreme/data/odata/store';
import { Division } from "../../../models/division";
import { ProductAsmblitemReport } from '../../../models/ProductAsmblitemReport';

@Component({
  selector   : 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls  : ['./pair.component.css']
})
export class pairComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  private ProductAsmblitemReportList : ProductAsmblitemReport[]= [];
  userProfile: any;
  saleAmountHeaderFilter: any;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  private GetProductLineName: ProductLines[] = [];
  private GetDivisionList: Division[] = [];
  private GetProdLinesByDiv: ProductLines[] = [];
  private DivisionID: number;
  private ProductLineID: number;
  private pagelength: number;
  ProductlineAssemblyItemsdataSource: any = {};
  CurrencyFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return "$" + cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  DecimalFormatter(cellInfo) {
    if(cellInfo.value==null)
    cellInfo.value=0;
    return cellInfo.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
  }
  constructor( @Inject(Http) http: Http,private metaService: MetadataService,private userService: UserService,public auth: AuthenticationService) {
    
        this.userProfile = this.auth.useProfile;
        //this.GetAllQuoteReports();
        this.GetAllProductline();
        this.GetAllDivisions();
    
        this.ProductlineAssemblyItemsdataSource.store = new CustomStore({
          load: function (loadOptions: any) {
            var params = '?';
    
            params += 'skip=' + loadOptions.skip || 0;
            params += '&take=' + loadOptions.take || 12;
            params += '&ProductLineID=' + $('#hidProductlineID').val();
            params += '&DivisionID=' + $('#hidDivisionID').val();
            params += '&ItemCode=' + $('#SearchByItemCode').val();
            params += '&Name=' + $('#SearchByAssemblyName').val();
            if (loadOptions.sort) {
              params += '&orderby=' + loadOptions.sort[0].selector;
              if (loadOptions.sort[0].desc) {
                params += ' desc';
              }
            }
            return http.get(EndPointsConfig.HostName + EndPointsConfig.ProductAssemblylineItemsReportsEndPoint.replace('/', '') + params)
              .toPromise()
              .then(response => {
                var json = response.json();
    
                return {
                  data: json.items,
                  totalCount: json.totalCount
                }
              })
              .catch(error => { throw 'Data Loading Error' });
          }
        });
      }
       /** Get Product Assembly item Report data */
       GetAllProductAsmblitemReportLists(){
       this.metaService.GetAllProductAsmblitemReportList().subscribe(data => {
        console.log("load Product Assembly item Report data");
        console.log(data[0]);
        this.ProductAsmblitemReportList = data;
      },
        err => {
          console.log('Product Assembly item Report Data Fetch Failed..');
        });
      }
      SearchProductAssemblyLineitemReports() {
        var ds = {
          requireTotalCount: true,
          searchExpr: undefined,
          searchOperation: "contains",
          searchValue: null,
          skip: 0,
          sort: null,
          take: this.pagelength,
          userData: {}
        }
        this.dataGrid.instance.refresh();
      }
      ClearFilters() {
        $('#hidDivisionID').val('0');
        $('#hidProductlineID').val('0');
        this.DivisionID = 0;
        this.ProductLineID = 0;
        $('#SearchByItemCode').val('');
        $('#SearchByAssemblyName').val('');
        var ds = {
          requireTotalCount: true,
          searchExpr: undefined,
          searchOperation: "contains",
          searchValue: null,
          skip: 0,
          sort: null,
          take: 10,
          userData: {}
        }
        this.dataGrid.instance.refresh();
      }
      ExportGridData() {
        var searchparams = {
          ProductLineID: $('#hidProductlineID').val(),
          DivisionID: $('#hidDivisionID').val(),
          Name: $('#SearchByAssemblyName').val(),
          ItemCode: $('#SearchByItemCode').val()
        }
        this.metaService.ExportProductAssemblyitemReport(searchparams).subscribe(data => {
          if (data) {
            window.open(data, "_blank");
          } else {
            notify('Failed to export Product Assembly item Report Data.', 'error', 2000);
          }
    
        },
          err => {
            console.log('Product Assembly item Report Data Fetch Failed..');
          });
      }
    
      GetAllProductline() {
        this.metaService.GetProductLines().subscribe(data => {
          console.log("load ProductLine data");
          console.log(data);
          this.GetProductLineName = data;
          this.GetProductLineName.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
        },
          err => {
            notify('ProductLine Data Fetch Failed.', 'Error', 2000);
          });
      }
      GetAllDivisions() {
        this.metaService.GetAllDivisions().subscribe(data => {
          console.log("load Division data");
          console.log(data[0]);
          this.GetDivisionList = data;
          this.GetDivisionList.sort(function (a, b) { return (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0); });
        },
          err => {
            console.log('Division Data Fetch Failed..');
          });
      }
      DivisionChangeEvent(e) {
        $('#hidDivisionID').val(e.value);
        this.GetProdLinesByDiv = this.GetProductLineName.filter(m => m.DivisionID == e.value);
      }
      ProductLineChangeEvent(e) {
        $('#hidProductlineID').val(e.value);
      }
      ngOnInit() {
      }
    }