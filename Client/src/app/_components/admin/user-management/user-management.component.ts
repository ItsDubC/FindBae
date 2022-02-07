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

    openRolesModal(user: User) {
        const config = {
            class: "modal-dialog-centered",
            initialState: {
                user,
                roles: this.getRolesArray(user)
            }
        }

        this.bsRolesModalRef = this.modalService.show(RolesModalComponent, config);
        
        this.bsRolesModalRef.content.updateSelectedRoles.subscribe(values => {
            const rolesToUpdate = {
                roles: [...values.filter(el => el.checked === true).map(el => el.name)]
            };

            if (rolesToUpdate) {
                this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
                    user.roles = [...rolesToUpdate.roles];
                });
            }
        })
    }

    private getRolesArray(user: User) {
        const roles = [];
        const userRoles = user.roles;
        const availableRoles: any[] = [
            { name: "Admin", value: "Admin" },
            { name: "Moderator", value: "Moderator" },
            { name: "Member", value: "Member" }
        ];

        availableRoles.forEach(role => {
            let isMatch = false;

            for (const userRole of userRoles) {
                if (role.name === userRole) {
                    isMatch = role.checked = true;
                    roles.push(role);
                    break;
                }
            }

            if (!isMatch) {
                role.checked = false;
                roles.push(role);
            }
        });

        return roles;
    }
}
