import type { App } from 'vue';
import QWikiProject from './qwikiProject';
import type { QWikiProjectFile } from './qwikiProject';

declare module 'vue' {
    interface ComponentCustomProperties {
        $qwiki: {
            project : QWikiProject | undefined,
            createProject : (id : string, name : string) => void,
            sessionExists : () => boolean,
            loadSession : () => boolean,
            saveSession : () => void,
            loadFromFile : (project : string) => boolean,
            getProjectFile : () => QWikiProjectFile | undefined
        }
    }
}

class QWiki {
    options: any;
    project: undefined | QWikiProject;

    install(app: App, options?: any) {
        app.config.globalProperties.$qwiki = {
            project: this.project,
            createProject(id: string, name: string) {
                this.project = new QWikiProject(id, name);
            },
            sessionExists() {
                return localStorage.getItem('session') != undefined;
            },
            loadSession() {
                if(!this.sessionExists())
                    return false;

                const session = JSON.parse(localStorage.getItem('session') ?? '{}');
                this.project = QWikiProject.Load(session as QWikiProjectFile);
                console.log(`Session for Project '${this.project.name}' loaded!`, this.project);

                return this.project ? true : false;
            },
            saveSession() {
                const projectFile = this.project?.getFile();

                if(!projectFile) {
                    return;
                }

                const session = JSON.stringify(projectFile);
                localStorage.setItem('session', session);
            },
            loadFromFile(project : string) {
                const session = JSON.parse(project);
                this.project = QWikiProject.Load(session as QWikiProjectFile);
                
                if(this.project) {
                    console.log(`Project '${this.project.name}' loaded!`, this.project);
                    this.saveSession();
                    return true;
                }
                return false;
            },
            getProjectFile() {
                return this.project?.getFile();
            }
        };
        this.options = options;

        console.log("Qwiki - All set!");
    }
}

function useQWiki() {
    return new QWiki();
}

export { useQWiki, QWiki }