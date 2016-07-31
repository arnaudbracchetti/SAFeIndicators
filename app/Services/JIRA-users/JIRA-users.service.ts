import { Injectable, Inject } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/mergemap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


/* interfaces correspondantes aux structures de données retournées
 * par les services REST de JIRA.
 */
interface REST_JIRAProject {
    id : number;
    key : string;
    name : string;
}

interface REST_JIRAUser {
    id : number;
    displayName : string;
    name : string;
}

interface REST_JIRARole {
    id : number;
    name: string;
    actors : REST_JIRAUser[];
}

/* Classes exportées qui constitue la structure des données gérée 
 * par le service.
 * 
 * - JIRAUser
 *     - JIRAProject
 *          - JIRARole
 */
export class JIRAProject {
    id : number;
    key : string;
    name : string;
    
    constructor(aProject: REST_JIRAProject)
    {
        this.id = aProject.id;
        this.key = aProject.key;
        this.name = aProject.name;
    }
    

}

export class JIRAUser {
    id : number;
    displayName : string;
    login : string;
    roles: JIRARole[] = [];
    
    constructor(aUser: REST_JIRAUser)
    {
        this.id = aUser.id;
        this.displayName = aUser.displayName;
        this.login = aUser.name;
    }
}

export class JIRARole {
    id : number;
    name: string;
    projects: JIRAProject[] = [];
    
    
    constructor(aRole: REST_JIRARole)
    {
        this.id = aRole.id;
        this.name = aRole.name;
    }
}



/* Classe du services fournissant les données utilisateurs
 * 
 */
@Injectable()
export class JIRAUsersService{
    
   
    
    private JIRAhttp : Http;
    private _users: BehaviorSubject<JIRAUser[]> = new BehaviorSubject<JIRAUser[]>([]);
    public users: Observable<JIRAUser[]> = this._users.asObservable();
    
  
    
    constructor(@Inject(Http) aHttp: Http) {
        
        this.JIRAhttp =  aHttp;
        }
    
    
 
 /* Cette methode construit progressivement la structure de données 
  * gérée par le service. A chaque étape de la construction la nouvelle
  * structure de données et emise aux observeurs.
  */   
    private _buildUserDataStructure(role : REST_JIRARole, project : REST_JIRAProject)
    {
        
        for (let user of role.actors)
        {
            let curUser: JIRAUser = this._users.getValue().find(it => it.login == user.name);
            if (curUser == undefined)
            {
                curUser = new JIRAUser(user);
                this._users.getValue().push(curUser);
            }
            
            let curRole: JIRARole = curUser.roles.find(it => it.name == role.name); 
            if (curRole == undefined)
            {
                curRole = new JIRARole(role);
                curUser.roles.push(curRole);
            }
            
            let curProject: JIRAProject = curRole.projects.find(it => it.key == project.key); 
            if (curProject == undefined)
            {
                curProject = new JIRAProject(project);
                curRole.projects.push(curProject);
            }
        }
        
        this._users.next(this._users.getValue())
       
    }
  
    /* Cette methode interoge JRIA sur les information des utilisateurs
     * en réponse aux requetes effectuées, la structure de données est complètée
     * par un appel à la methode privé _buildUserDataStructure()
     */
    public getUsers(): Observable<JIRAUser[]>
    {
        let header:Headers = new Headers();
        //header.append("Authorization", 'Basic c3lzYWRtaW46UG9sdXgkMTQ=');
        //header.append('Accept', 'application/json');
        //header.append("Content-Type", 'text/plain');
        //header.append("Content-Type", "application/json");
        // let data = JSON.stringify({usename:"sysadmin",password:"Polux$14"});
        //console.log(data);
        
        let userUrl : string    = 'http://163.62.118.20/rest/api/2/user/search?username=%&maxResults=500'; 
        let projectUrl : string = 'http://163.62.118.20/rest/api/2/project'; 
        
                   
        this.JIRAhttp.get(projectUrl,{headers:header, withCredentials:true})
            .flatMap(response => Observable.from(response.json()))
            
          
            .flatMap((project : REST_JIRAProject) => Observable.zip(this.JIRAhttp.get("http://163.62.118.20/rest/api/2/project/"+project.key+"/role",{headers:header, withCredentials:true})
                                                .flatMap(response => Observable.from(Object.values(response.json()))),    
                                            projectRole=>[projectRole,project]))
            
            .flatMap(projectRole => Observable.zip(this.JIRAhttp.get(projectRole[0],{headers:header, withCredentials:true}),
                                            roleDetail => [roleDetail.json(), projectRole[1]]))
            .do((data) => {this._buildUserDataStructure(data[0], data[1])})
            .subscribe();
                
                
          
        return this.users;    
             
    }
}


