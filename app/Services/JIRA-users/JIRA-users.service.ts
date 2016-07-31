import { Injectable, Inject } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/rx';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

/*export class JIRAUser2 {
     key  : string;
     name : string;
     mail : string;
     team : string;
     login : string;
}*/

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


@Injectable()
export class JIRAUsersService{
    
    // TODO : nettoyer la classe
   /* mockUser: JIRAUser[] = 
    [{name:"user1", mail:"mail1", team : "team1"},
     {name:"user2", mail:"mail2", team : "team2"},
     {name:"user3", mail:"mail3", team : "team1"},
     {name:"user4", mail:"mail4", team : "team1"},
     {name:"user5", mail:"mail5", team : "team2"},
     {name:"user6", mail:"mail6", team : "team1"},
     {name:"user7", mail:"mail7", team : "team3"},
     {name:"user8", mail:"mail8", team : "team1"},
     {name:"user9", mail:"mail9", team : "team3"},
     {name:"user10", mail:"mail10", team : "team3"},
     {name:"user11", mail:"mail11", team : "team2"},
    
    ];*/
    
    private JIRAhttp : Http;
    private _users: BehaviorSubject<JIRAUser[]> = new BehaviorSubject<JIRAUser[]>([]);
    public users: Observable<JIRAUser[]> = this._users.asObservable();
    
    //private _users : Map<string,JIRAUser> = new Map<string,JIRAUser>();
    //private _projects: JIRAProject[] = [];
    
    constructor(@Inject(Http) aHttp: Http) {
        
        this.JIRAhttp =  aHttp;
        }
    
    
    /* Instancie un tableau de JIRAUser à partir des données retournées
     * par le webservice de récupération des comptes JIRA.
     * Seules les informations de base sont initialisées.
     */ 
    /*private fillJIRAUser(data):JIRAUser[]
    {
        let users: JIRAUser2[] = [];
                 
        data.forEach((item) => {
                                        let target: JIRAUser2 = new JIRAUser2();
                                        target.key = item.key;
                                        target.name = item.displayName;
                                        target.mail = item.emailAddress;
                                        
                                        users.push(target);
                                    })
          
         console.log(users);                                                     
        return users;
                                        
    }*/
     
    
    /*
     * Complete l'initialisation du tableau de JIRAUser avec des informations
     * demendant des requetes suplémentaires
     */
    /*private completeUser()
    {
        console.log("completeUser CALL");
    }   */
    
   /* private _addProject(id:number, key:string, name:string)
    {
        let prj: JIRAProject = new JIRAProject();
        prj.id = id;
        prj.key = key;
        prj.name = name;
        
        this._projects.push(prj);
    }*/
    
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
       // console.count();
       // console.dirxml(this._users);
    }
  
    public getUsers(): Observable<JIRAUser[]>//JIRAUser[]>
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
        
       
       /* let userReq: Observable<JIRAUser[]> = this.JIRAhttp.get(userUrl,{headers:header, withCredentials:true})
             .map((response) => this.fillJIRAUser(response.json()));*/
             
        this.JIRAhttp.get(projectUrl,{headers:header, withCredentials:true})
            .flatMap(response => Observable.from(response.json()))
            //.do(data=> console.dir(data))
            //.do(data => this._addProject(data.id, data.key, data.name))
          
            .flatMap((project : REST_JIRAProject) => Observable.zip(this.JIRAhttp.get("http://163.62.118.20/rest/api/2/project/"+project.key+"/role",{headers:header, withCredentials:true})
                                                .flatMap(response => Observable.from(Object.values(response.json()))),    
                                            projectRole=>[projectRole,project]))
            //.do(data => console.log("inner : " + JSON.stringify(data)))
            .flatMap(projectRole => Observable.zip(this.JIRAhttp.get(projectRole[0],{headers:header, withCredentials:true}),
                                            roleDetail => [roleDetail.json(), projectRole[1]]))
            .do((data) => {/*console.dir(data[0]);*/ this._buildUserDataStructure(data[0], data[1])})
            .subscribe();
                
                
          
        return this.users;    
             
    }
}


