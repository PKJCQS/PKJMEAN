import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ZoneTypeService} from '../../zoneType.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-view-all-zoneTypes',
  templateUrl: './view-all-zoneTypes.component.html',
  styleUrls: ['./view-all-zoneTypes.component.css']
})
export class ViewAllZoneTypesComponent implements OnInit, AfterViewInit {
  public zoneTypes: any;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'name', title: 'Name', isSortable: true},
        { key: 'isActive', title: 'IsActive', isSortable: true},
        { key: 'action', title: 'Action', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'name',
        isSortAscending: 1
    };
  constructor(private zoneTypeService: ZoneTypeService, private route: Router) {
    this.zoneTypeService.getZoneTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
        this.zoneTypes = response['data'];
        this.pages = Math.ceil(response['total'] / this.pageSize);
    });
  }

  ngOnInit() {
  }
    ngAfterViewInit() {
    }
    public setPageData(event: PageEvent) {
        console.log( event );
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.zoneTypeService.getZoneTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.zoneTypes = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public changeStatus(event: any, zoneType: any) {
        zoneType['isActive'] =  event.checked;
        this.zoneTypeService.save(zoneType).subscribe(response1 => {
            if (response1) {
                this.zoneTypeService.getZoneTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
                    this.zoneTypes = response['data'];
                    this.pages = Math.ceil(response['total'] / this.pageSize);
                });
            }
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.zoneTypeService.getZoneTypes(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.zoneTypes = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
  public deleteZoneType(id: string) {
      if (confirm('Are you sure!')) {
          this.zoneTypeService.delete( id).subscribe(response => {
              this.zoneTypes = response['data'];
              this.pages = Math.ceil(response['total'] / this.pageSize);
              this.route.navigate(['cpanel/master/zoneType/view-all']);
          });
      }
  }
}
