import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from '../../_modals/roles-modal/roles-modal.component';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: Partial<User[]>;
    bsRolesModalRef: BsModalRef;

    constructor(
        private adminService: AdminService,
        private modalService: BsModalService) { }

    ngOnInit(): void {
        this.getUsersWithRoles();
    }

    getUsersWithRoles() {
        this.adminService.getUsersWithRoles().subscribe(response => {
            this.users = response;
        });
    }

    openRolesModal() {
        const initialState: ModalOptions = {
            initialState: {
              list: [
                'Open a modal with component',
                'Pass your data',
                'Do something else',
                '...'
              ],
              title: 'Modal with component'
            }
          };
          
        this.bsRolesModalRef = this.modalService.show(RolesModalComponent, initialState);
        this.bsRolesModalRef.content.closeBtnName = 'Close';
    }
}
