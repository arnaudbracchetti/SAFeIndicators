import { Component } from '@angular/core';

import {Hero} from './hero';
import {DetailsComponent} from './details.component';
import {HeroesService} from './heroes.service';

    



@Component({
  selector: 'my-app',
  template: `<h1>{{title}}</h1>
    
    <div>
        <ul class="Heroes">
            <li *ngFor="let hero of heroes" [class.selected]="hero === selectedHero" (click)="selectHero(hero)" (nameChange)="onNameChange($event)">
            <span class="Badge">{{hero.id}}</span>{{hero.name}}
            </li>
        </ul>
    </div>\n\
    <div>\n\
        <hero-detail [hero]="selectedHero">loading...</hero-detail>
`,
styles: [`
  .selected {
    background-color: #CFD8DC !important;
    color: white;
  }
  .heroes {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;
  }
  .heroes li {
    cursor: pointer;
    position: relative;
    left: 0;
    background-color: #EEE;
    margin: .5em;
    padding: .3em 0;
    height: 1.6em;
    border-radius: 4px;
  }
  .heroes li.selected:hover {
    background-color: #BBD8DC !important;
    color: white;
  }
  .heroes li:hover {
    color: #607D8B;
    background-color: #DDD;
    left: .1em;
  }
  .heroes .text {
    position: relative;
    top: -3px; 
  }
  .heroes .badge {
    display: inline-block;
    font-size: small;
    color: white;
    padding: 0.8em 0.7em 0 0.7em;
    background-color: #607D8B;
    line-height: 1em;
    position: relative;
    left: -1px;
    top: -4px;
    height: 1.8em;
    margin-right: .8em;
    border-radius: 4px 0 0 4px;
  }
`],
  providers:[HeroesService],
  directives : [DetailsComponent]
})
export class AppComponent {
  public title = 'Heroes Tour 3';
  public heroes;
  public selectedHero : Hero;

  constructor(aHero:HeroesService)
  {
    this.heroes = aHero.getHeroes();
  }
  
  selectHero(aHero : Hero)
  {
      this.selectedHero = aHero;
  }
  
  onNameChange(name : string)
  {
      this.selectedHero.name = name;
  }
 }



 
