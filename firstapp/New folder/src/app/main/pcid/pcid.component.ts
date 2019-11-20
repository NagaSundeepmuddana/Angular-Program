import { Component, OnInit } from '@angular/core';
import { ProjectCategories } from '../../../models/projectcatagories';

@Component({
  selector   : 'app-pcid',
  templateUrl: './pcid.component.html',
  styleUrls  : ['./pcid.component.css']
})
export class PcidComponent implements OnInit {
  popupVisible = false;
  pcats:ProjectCategories[] = [{
    ProjectCatID:1,
    ProjectSubCatID:0,
    Active          : true,
    CreatedBy       : 'Josh Lippy',
    CreatedDate     : '2015-05-02',
    LastModifiedBy  : 'Tim Burke',
    LastModifiedDate: '2016-08-28',
    Name:'DOT',
    // ProjectSubCategories:[
    //   {
    //     ProjectCatID    : 1,
    //     ProjectSubCatID : 2,
    //     Name          : 'TX-DOT',
    //     Active        : true,
    //     CreatedBy       : 'Josh Lippy',
    //     CreatedDate     : '2015-05-02',
    //     LastModifiedBy  : 'Tim Burke',
    //     LastModifiedDate: '2016-08-28'
    //   },
    //   {
    //     ProjectCatID    : 1,
    //     ProjectSubCatID : 2,
    //     Name          : 'TX-NJ',
    //     Active        : true,
    //     CreatedBy       : 'Josh Lippy',
    //     CreatedDate     : '2015-05-02',
    //     LastModifiedBy  : 'Tim Burke',
    //     LastModifiedDate: '2016-08-28'
    //   },
    //   {
    //     ProjectCatID    : 1,
    //     ProjectSubCatID : 2,
    //     Name          : 'TX-NY',
    //     Active        : true,
    //     CreatedBy       : 'Josh Lippy',
    //     CreatedDate     : '2015-05-02',
    //     LastModifiedBy  : 'Tim Burke',
    //     LastModifiedDate: '2016-08-28'
    //   }
    // ]
  }];
  lookupData: any;
  constructor() {
    this.lookupData = {
      store: {
        type: "array",
        data: this.pcats,
        sort: "ProjectCatID"
      }

    };
  }

  ngOnInit() {
  }

  showInfo() {
    this.popupVisible = true;
  }

}
