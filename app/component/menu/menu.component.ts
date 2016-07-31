

import { Component } from '@angular/core';
import {SelectButton, SelectItem} from 'primeng/primeng';

@Component({
    moduleId : module.id,
    selector: 'menu',
    templateUrl: "menu.template.html",
    providers:[],
    directives : [SelectButton]
})
export class MenuComponent {
    
    options2 : SelectItem[];
    public selectedOption : string = "1";
    
    constructor()
    {
        this.options2 = [];
        this.options2.push({label:"Liste des utilisateurs",  value:"1"});
        this.options2.push({label:"Liste des roles",         value:"2"});
        this.options2.push({label:"Liste des roles2",         value:"3"});
    }
    
    onChange(event :any)
    {
        this.selectedOption = event.value;
    }
       
}

