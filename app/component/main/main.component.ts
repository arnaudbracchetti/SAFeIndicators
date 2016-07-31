

import { Component } from '@angular/core';
//import { HTTP_PROVIDERS } from '@angular/http'
import { MenuComponent} from '../menu/menu.component';
import { UserListComponent} from '../user-list/user-list.component';

@Component({
    moduleId : module.id,
    selector: 'my-app',
    templateUrl: "main.template.html",
    //providers:[],
    directives : [MenuComponent,UserListComponent]
})
export class MainComponent {
    
  
}

