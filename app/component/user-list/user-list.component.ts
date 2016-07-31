

import { Component, OnInit } from '@angular/core';
import {JIRAUsersService, JIRAUser} from '../../Services/JIRA-users/JIRA-users.service';
import {DataTable} from 'primeng/primeng';
import {Column} from 'primeng/primeng';
import {Observable} from 'rxjs/Observable';


@Component({
    moduleId : module.id,
    selector: 'user-list',
    templateUrl: "user-list.template.html",
    styleUrls: ["user-list.style.css"],
    providers:[JIRAUsersService],
    directives : [DataTable,Column]
})
export class UserListComponent {
    service : JIRAUsersService;
    
    
    constructor(service: JIRAUsersService)
    {
        this.service = service;
        console.dir(service.users);
        service.users.subscribe(data=>console.dir(data) );
    }
    
    ngOnInit() {
        //this.service.getUsersAsPromise().subscribe(data=>this.data = data);
       
        console.log('Trace...');
        this.service.getUsers();
    }
    
    
}

