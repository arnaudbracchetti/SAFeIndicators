/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Button} from 'primeng/primeng';
import {Accordion} from 'primeng/primeng';
import {AccordionTab} from 'primeng/primeng';

import {Hero} from './hero';

@Component(
{
    selector : 'hero-detail',
    template : `\n\

    

        <button pButton type="button" label="Click"></button>\n\

        <p-accordion>
            <p-accordionTab header="Header 1">


                <div *ngIf="hero">
                    <h2>{{hero.name}} details!</h2>
                    <div><label>id: </label>{{hero.id}}</div>
                    <div>
                      <label>name: </label>
                      <input [(ngModel)]="hero.name" (keyup)="onKeyup(value)" placeholder="name"/>
                    </div>
                </div>


            </p-accordionTab>
        </p-accordion>`,
    directives : [Accordion,AccordionTab,Button]
}
)
export class DetailsComponent
{
   @Input() hero : Hero;
   @Output() nameChange: EventEmitter<string> = new EventEmitter<string>(); 
    
   onKeyup(value : string)
   {
       this.nameChange.emit(value);
   }
}
