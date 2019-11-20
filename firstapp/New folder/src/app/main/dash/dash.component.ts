import { Component, OnInit } from '@angular/core';
import { DashboardQuickStats, QuoteByMonth, AwardByMonth, QuotesByContract, RevenueByDivision,QuotesByState, DivisionsByState } from '../../../models/Dashboard';
import { MetadataService } from '../../services/metadata/metadata.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  DashFromDate: any;
  DashToDate: any;
  CurrentDate: Date = new Date();
  QuoteByMonth: string = this.CurrentDate.toString().toString().split(" ")[1];
  QuoteByYear: string = this.CurrentDate.getFullYear().toString();
  QuoteByQuarter: string = "";
  QuoteByYear2: string = this.CurrentDate.getFullYear().toString();
  QuoteByYear3: string = this.CurrentDate.getFullYear().toString();
  AwardByMonth: string = this.CurrentDate.toString().toString().split(" ")[1];
  AwardByYear: string = this.CurrentDate.getFullYear().toString();
  AwardByQuarter: string = "";
  AwardByYear2: string = this.CurrentDate.getFullYear().toString();
  AwardByYear3: string = this.CurrentDate.getFullYear().toString();
  QuoteByContract: string = this.CurrentDate.toString().toString().split(" ")[1];
  QuoteByContractPerYear: string = this.CurrentDate.getFullYear().toString();
  QuoteByContractPerQuater: string = "";
  QuoteByContractPerYear2: string = this.CurrentDate.getFullYear().toString();
  QuoteByContractPerYear3: string = this.CurrentDate.getFullYear().toString();
  QuoteByState:string=this.CurrentDate.toString().split('')[1];
  QuoteByStatePerYear: string = this.CurrentDate.getFullYear().toString();
  QuoteBystatePerYear3:string=this.CurrentDate.getFullYear().toString();
  QuickStats: DashboardQuickStats = new DashboardQuickStats();
  activeQuotes: QuoteByMonth[] = [];
  activeQuotesByQuarter: QuoteByMonth[] = [];
  activeQuotesByYear: QuoteByMonth[] = [];
  activeAwardByMonth: AwardByMonth[] = [];
  activeAwardByQuarter: AwardByMonth[] = [];
  activeAwardByYear: AwardByMonth[] = [];
  activeQuotesByContract1: QuotesByContract[] = [];
  activeQuoteByState1:QuotesByState[]=[];
  DivisionsByState: DivisionsByState[]=[];
  QuoteByStatePerQuater:string = this.CurrentDate.getFullYear().toString();
  QuoteByStatePerYear2:string = this.CurrentDate.getFullYear().toString();
  activeQuotesByContract2: QuotesByContract[] = [];
  activeQuotesByContract3: QuotesByContract[] = [];
  revenueByYear: RevenueByDivision[] = [];
  simpleProducts: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
year: string[] = [
  "2016",
  "2017",
  "2018",
  "2019",
  "2020"
];
Quat: string[] = [
  "Q1",
  "Q2",
  "Q3",
  "Q4"
];
  /*activeQuotes = [{
    arg: 'JAN',
    val: 14
  }, {
    arg: 'FEB',
    val: 9
  }, {
    arg: 'MAR',
    val: 22
  }, {
    arg: 'APR',
    val: 41
  }, {
    arg: 'MAY',
    val: 18
  }, {
    arg: 'JUN',
    val: 23
  }, {
    arg: 'JLY',
    val: 31
  }, {
    arg: 'AUG',
    val: 55
  }];*/

  // revenueByYear = [{
  //   div: 'Guardrail',
  //   y2015: 35,
  //   y2016: 20,
  //   y2017: 84
  // }, {
  //   div: 'Traffic and Lighting',
  //   y2015: 9,
  //   y2016: 11,
  //   y2017: 84
  // }, {
  //   div: 'Roadside Sign',
  //   y2015: 3,
  //   y2016: 6.5,
  //   y2017: 4
  // }, {
  //   div: 'Bridge',
  //   y2015: 22,
  //   y2016: 9,
  //   y2017: 15
  // }, {
  //   div: 'Crash Cushions',
  //   y2015: 14,
  //   y2016: 20,
  //   y2017: 84
  // }];
  constructor(public metadataservice: MetadataService,public auth: AuthenticationService,) {
    this.auth.useProfile = JSON.parse(localStorage.getItem('userprofile'));
    console.log('Dash Constructor');
    this.GetDivisionsByState();
    this.DashToDate = new Date();
    this.DashFromDate = new Date();
    this.DashFromDate.setDate(this.DashFromDate.getDate()-30);
    if(this.CurrentDate.toString().toString().split(" ")[1] == "Jan" || this.CurrentDate.toString().toString().split(" ")[1] == "Feb" || this.CurrentDate.toString().toString().split(" ")[1] == "Mar")
      {
        this.QuoteByQuarter = "Q1";
        this.AwardByQuarter = "Q1";
        this.QuoteByContractPerQuater = "Q1";
      }
      if(this.CurrentDate.toString().toString().split(" ")[1] == "Apr" || this.CurrentDate.toString().toString().split(" ")[1] == "May" || this.CurrentDate.toString().toString().split(" ")[1] == "Jun")
      {
        this.QuoteByQuarter = "Q2";
        this.AwardByQuarter = "Q2";
        this.QuoteByContractPerQuater = "Q2";
      }
      if(this.CurrentDate.toString().toString().split(" ")[1] == "Jul" || this.CurrentDate.toString().toString().split(" ")[1] == "Aug" || this.CurrentDate.toString().toString().split(" ")[1] == "Sep")
      {
        this.QuoteByQuarter = "Q3";
        this.AwardByQuarter = "Q3";
        this.QuoteByContractPerQuater = "Q3";
      }
      if(this.CurrentDate.toString().toString().split(" ")[1] == "Oct" || this.CurrentDate.toString().toString().split(" ")[1] == "Nov" || this.CurrentDate.toString().toString().split(" ")[1] == "Dec")
      {
        this.QuoteByQuarter = "Q4";
        this.AwardByQuarter = "Q4";
        this.QuoteByContractPerQuater = "Q4";
      }
    this.metadataservice.GetQuickStats().subscribe(data => {
      this.QuickStats = data[0];
      console.log(data);
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
    // this.metadataservice.GetActiveQuotesByMonth().subscribe(data => {
    //   this.activeQuotes = data;
    //   console.log(data);
    //   console.log("------------");
    // },
    //   err => {
    //     console.log('Project items Data Fetch Failed..');
    //   });
    this.metadataservice.GetRevenueByDivision().subscribe(data => {
      this.revenueByYear = data;
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }

  ngOnInit() {
    this.auth.useProfile = JSON.parse(localStorage.getItem('userprofile'));
    // if(this.auth.isAuthenticated()){
    //   console.log('Yes User authenticated.. dash component oninit');
    //   //this.userProfile = JSON.parse(localStorage.getItem('userprofile'));
    // }else{
    //   console.log('Yes User not authenticated.. dash component oninit');
    //   this.auth.logout();
    // }
  }

  QuoteByMonth1(e)
  {
    this.QuoteByMonth = e.value;
    var param = {
      Month: this.QuoteByMonth,
      Year: this.QuoteByYear,
      Quarter: '',
      Type: "M"
    }
    this.GetQuoteByMonth(param);
  }
  QuoteByMonth2(e)
  {
    this.QuoteByYear = e.value;
    var param = {
      Month: this.QuoteByMonth,
      Year: this.QuoteByYear,
      Quarter: "",
      Type: "M"
    }
    this.GetQuoteByMonth(param);
  }

  QuoteByQuarter1(e)
  {
    this.QuoteByQuarter = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByYear2,
      Quarter: this.QuoteByQuarter,
      Type: "Q"
    }
    this.GetQuoteByQuarter(param);
  }

  QuoteByQuarter2(e)
  {
    this.QuoteByYear2 = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByYear2,
      Quarter: this.QuoteByQuarter,
      Type: "Q"
    }
    this.GetQuoteByQuarter(param);
  }

  QuoteByYear1(e)
  {
    this.QuoteByYear3 = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByYear3,
      Quarter: "",
      Type: "Y"
    }
    this.GetQuoteByYear(param);
  }

  GetQuoteByMonth(param)
  {
    this.metadataservice.GetActiveQuotesByMonth(param).subscribe(data => {
      this.activeQuotes = data;
      console.log(data);
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }

  GetQuoteByQuarter(param)
  {
    this.metadataservice.GetActiveQuotesByMonth(param).subscribe(data => {
      this.activeQuotesByQuarter = data;
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }

  GetQuoteByYear(param)
  {
    this.metadataservice.GetActiveQuotesByMonth(param).subscribe(data => {
      this.activeQuotesByYear = data;
    },
      err => {
        console.log('Project items Data Fetch Failed..');
      });
  }

  AwardByMonth1(e)
  {
    this.AwardByMonth = e.value;
    var param = {
      Month: this.AwardByMonth,
      Year: this.AwardByYear,
      Quarter: "",
      Type: "M"
    }
    this.GetAwardByMonth(param);
  }

  AwardByMonth2(e)
  {
    this.AwardByYear = e.value;
    var param = {
      Month: this.AwardByMonth,
      Year: this.AwardByYear,
      Quarter: "",
      Type: "M"
    }
    this.GetAwardByMonth(param);
  }

  AwardByQuarter1(e)
  {
    this.AwardByQuarter = e.value;
    var param = {
      Month: "",
      Year: this.AwardByYear2,
      Quarter: this.AwardByQuarter,
      Type: "Q"
    }
    this.GetAwardByQuarter(param);
  }

  AwardByQuarter2(e)
  {
    this.AwardByYear2 = e.value;
    var param = {
      Month: "",
      Year: this.AwardByYear2,
      Quarter: this.AwardByQuarter,
      Type: "Q"
    }
    this.GetAwardByQuarter(param);
  }

  AwardByYear1(e)
  {
    this.AwardByYear3 = e.value;
    var param = {
      Month: "",
      Year: this.AwardByYear3,
      Quarter: "",
      Type: "Y"
    }
    this.GetAwardByYear(param);
  }

  QuoteByContract1(e)
  {
    this.QuoteByContract = e.value;
    var param = {
      Month: this.QuoteByContract,
      Year: this.QuoteByContractPerYear,
      Quarter: "",
      Type: "M"
    }
    this.GetQuoteByContract1(param);
  }

  QuoteByContract2(e)
  {
    this.QuoteByContractPerYear = e.value;
    var param = {
      Month: this.QuoteByContract,
      Year: this.QuoteByContractPerYear,
      Quarter: "",
      Type: "M"
    }
    this.GetQuoteByContract1(param);
  }

  QuoteByContractPerQuater1(e)
  {
    this.QuoteByContractPerQuater = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByContractPerYear2,
      Quarter: this.QuoteByContractPerQuater,
      Type: "Q"
    }
    this.GetQuoteByContract2(param);
  }

  QuoteByContractPerQuater2(e)
  {
    this.QuoteByContractPerYear2 = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByContractPerYear2,
      Quarter: this.QuoteByContractPerQuater,
      Type: "Q"
    }
    this.GetQuoteByContract2(param);
  }

  QuoteByContractPerYear1(e)
  {
    this.QuoteByContractPerYear3 = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByContractPerYear3,
      Quarter: "",
      Type: "Y"
    }
    this.GetQuoteByContract3(param);
  }

  QuoteByState1(e)
  {
    this.QuoteByState = e.value;
    var param = {
      Month: this.QuoteByState,
      Year: this.QuoteByContractPerYear,
      Quarter: "",
      Type: "M"
    }
    this.GetQuoteByState1(param);
  }

  QuoteByState2(e)
  {
    this.QuoteByStatePerYear = e.value;
    var param = {
      Month: this.QuoteByStatePerYear,
      Year: this.QuoteByContractPerYear,
      Quarter: "",
      Type: "M"
    }
    this.GetQuoteByState1(param);
  }

  QuoteByStatePerQuater1(e)
  {
    this.QuoteByState = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByStatePerYear2,
      Quarter: this.QuoteByStatePerQuater,
      Type: "Q"
    }
    this.GetQuoteBystatePerQuater2(param);
  }

  QuoteBystatePerQuater2(e)
  {
    this.QuoteByStatePerYear = e.value;
    var param = {
      Month: "",
      Year: this.QuoteByStatePerYear2,
      Quarter:this.QuoteByStatePerQuater,
      Type: "Q"
    }
    this.GetQuoteBystatePerQuater2(param);
  }
  QuoteByStatePerYear1(e)
  {
    this.QuoteBystatePerYear3 = e.value;
    var param = {
      Month: "",
      Year: this.QuoteBystatePerYear3,
      Quarter: "",
      Type: "Y"
    }
    this.GetQuoteBystatePerYear(param);
  }

  GetAwardByMonth(param)
  {
    this.metadataservice.GetActiveAwardByPeriod(param).subscribe(data => {
      this.activeAwardByMonth = data;
    },
      err => {
        console.log('Award Data Fetch Failed..');
      });
  }

  GetAwardByQuarter(param)
  {
    this.metadataservice.GetActiveAwardByPeriod(param).subscribe(data => {
      this.activeAwardByQuarter = data;
    },
      err => {
        console.log('Award Data Fetch Failed..');
      });
  }

  GetAwardByYear(param)
  {
    this.metadataservice.GetActiveAwardByPeriod(param).subscribe(data => {
      this.activeAwardByYear = data;
    },
      err => {
        console.log('Award Data Fetch Failed..');
      });
  }

  
  
  GetQuoteByState1(param)
  {
    this.metadataservice.GetActiveQuotesByState(param).subscribe(data => {
      this.activeQuoteByState1 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }

  GetQuoteBystatePerQuater2(param)
  {
    this.metadataservice.GetActiveQuotesByState(param).subscribe(data => {
      this.activeQuoteByState1 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }
  GetQuoteBystatePerYear(param)
  {
    this.metadataservice.GetActiveQuotesByState(param).subscribe(data => {
      this.activeQuoteByState1 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }
  GetQuoteByContract1(param)
  {
    this.metadataservice.GetActiveQuotesByContract(param).subscribe(data => {
      this.activeQuotesByContract1 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }

  GetQuoteByContract2(param)
  {
    this.metadataservice.GetActiveQuotesByContract(param).subscribe(data => {
      this.activeQuotesByContract2 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }

  GetQuoteByContract3(param)
  {
    this.metadataservice.GetActiveQuotesByContract(param).subscribe(data => {
      this.activeQuotesByContract3 = data;
    },
      err => {
        console.log('Quote Data Fetch Failed..');
      });
  }

  GetDivisionsByState()
  {
    var FromDate = "";
    var ToDate = "";
    var datePipe = new DatePipe(this.DashFromDate);
    if (this.DashFromDate)
      FromDate = datePipe.transform(this.DashFromDate, 'MM/dd/yyyy');
    var datePipe2 = new DatePipe(this.DashToDate);
    if (this.DashToDate)
      ToDate = datePipe2.transform(this.DashToDate, 'MM/dd/yyyy');
    var entity = {
      LettingFromDate: FromDate,
      LettingToDate: ToDate
    }
    this.metadataservice.GetDivisionsByState(entity).subscribe(data => {
      this.DivisionsByState = data;
    },
      err => {
        console.log('Dashboard Quote By State Data Fetch Failed.');
      });
  }
  LettingFromDateChanged(e)
  {
    var FromDate = "";
    var ToDate = "";
    this.DashFromDate = e.value;
    var datePipe = new DatePipe(this.DashFromDate);
    if (this.DashFromDate)
      FromDate = datePipe.transform(this.DashFromDate, 'MM/dd/yyyy');
    var datePipe2 = new DatePipe(this.DashToDate);
    if (this.DashToDate)
      ToDate = datePipe2.transform(this.DashToDate, 'MM/dd/yyyy');
    var entity = {
      LettingFromDate: FromDate,
      LettingToDate: ToDate
    }
    this.metadataservice.GetDivisionsByState(entity).subscribe(data => {
      this.DivisionsByState = data;
    },
      err => {
        console.log('Dashboard Quote By State Data Fetch Failed.');
      });
  }
  LettingToDateChanged(e)
  {
    var FromDate = "";
    var ToDate = "";
    this.DashToDate = e.value;
    var datePipe = new DatePipe(this.DashFromDate);
    if (this.DashFromDate)
      FromDate = datePipe.transform(this.DashFromDate, 'MM/dd/yyyy');
    var datePipe2 = new DatePipe(this.DashToDate);
    if (this.DashToDate)
      ToDate = datePipe2.transform(this.DashToDate, 'MM/dd/yyyy');
    var entity = {
      LettingFromDate: FromDate,
      LettingToDate: ToDate
    }
    this.metadataservice.GetDivisionsByState(entity).subscribe(data => {
      this.DivisionsByState = data;
    },
      err => {
        console.log('Dashboard Quote By State Data Fetch Failed.');
      });
  }
}
