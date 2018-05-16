import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ZoneService} from '../../zone.service';
import {Router} from '@angular/router';
import {PageEvent} from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-view-all-zones',
  templateUrl: './view-all-zones.component.html',
  styleUrls: ['./view-all-zones.component.css']
})
export class ViewAllZonesComponent implements OnInit, AfterViewInit {
  public zones: any;
    public pages: number;
    public pageIndex = 0;
    public pageSize = 5;
    public pageSizeOptions = [5, 10, 25, 100];
    public columns = [
        { key: 'sn', title: 'S. No.', isSortable: false },
        { key: 'name', title: 'Name', isSortable: true},
        { key: 'zoneType', title: 'Zone Type', isSortable: true},
        { key: 'school', title: 'School', isSortable: true},
        { key: 'gateway', title: 'Gateway', isSortable: true},
        { key: 'isActive', title: 'IsActive', isSortable: true},
        { key: 'action', title: 'Action', isSortable: false}
    ];
    color = 'primary';
    public query = {
        sortBy: 'name',
        isSortAscending: 1
    };
  constructor(private zoneService: ZoneService, private route: Router) {
    this.zoneService.getZones(this.pageIndex, this.pageSize, this.query).subscribe(response => {
        this.zones = response['data'];
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
        this.zoneService.getZones(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.zones = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
    public changeStatus(event: any, zone: any) {
        zone['isActive'] =  event.checked;
        this.zoneService.save(zone).subscribe(response1 => {
            if (response1) {
                this.zoneService.getZones(this.pageIndex, this.pageSize, this.query).subscribe(response => {
                    this.zones = response['data'];
                    this.pages = Math.ceil(response['total'] / this.pageSize);
                });
            }
        });
    }
    public SortBy(sortKey: string) {
        this.query.sortBy = sortKey;
        this.query.isSortAscending = this.query.isSortAscending === -1 ? 1 : -1;
        this.zoneService.getZones(this.pageIndex, this.pageSize, this.query).subscribe(response => {
            this.zones = response['data'];
            this.pages = Math.ceil(response['total'] / this.pageSize);
        });
    }
  public deleteZone(id: string) {
      if (confirm('Are you sure!')) {
          this.zoneService.delete( id).subscribe(response => {
              this.zones = response['data'];
              this.pages = Math.ceil(response['total'] / this.pageSize);
              this.route.navigate(['cpanel/master/zone/view-all']);
          });
      }
  }
}
