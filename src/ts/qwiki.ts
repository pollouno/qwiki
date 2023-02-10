import type { App } from 'vue';
import QWikiProject from './qwikiProject';

declare module 'vue' {
    interface ComponentCustomProperties {
        $qwiki: {
            project : QWikiProject | undefined,
            createProject : (id : string, name : string) => void,
            openProject : ( name : string) => void,
            closeProject : () => void
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
            openProject(name : string) { },
            closeProject() { }
        };
        this.options = options;

        console.log("Qwiki - All set!");
    }
}

function useQWiki() {
    return new QWiki();
}

export { useQWiki, QWiki }