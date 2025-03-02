import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {

  search: string = '';
  ROLES:any = [];
  isLoading$:any;
  totalPages:number = 0;
  currentPage:number = 1;

  constructor(
    public modalService: NgbModal,
    public rolesService: RolesService,
  ) {
    
  }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.listRoles();
  }

  listRoles(page = 1) {
    this.rolesService.listRoles(page, this.search).subscribe((resp:any) => {
      console.log(resp);
      this.ROLES = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = resp.page;
    })
  }

  loadPage($event:any) {
    this.listRoles($event);
  }
  createRole() {
    const modalRed = this.modalService.open(CreateRolesComponent, {centered: true, size: 'md'});
  }
}
