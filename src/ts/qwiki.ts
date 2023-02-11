import type { App } from 'vue';
import QWikiProject from './qwikiProject';

declare module 'vue' {
    interface ComponentCustomProperties {
        $qwiki: {
            project : QWikiProject | undefined,
            createProject : (id : string, name : string) => void,
            sessionExists : () => boolean,
            loadSession : () => boolean,
            saveSession : () => void
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
                this.project = QWikiProject.Load(session as QWikiProject);
                console.log(`Session for Project '${this.project.name}' loaded!`, this.project);

                return this.project ? true : false;
            },
            saveSession() {
                const session = JSON.stringify(this.project);
                localStorage.setItem('session', session);
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