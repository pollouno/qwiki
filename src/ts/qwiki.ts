import type { App } from 'vue';
import QWikiProject from './qwikiProject';

class QWiki {
    options : any;
    project : undefined | QWikiProject;

    install(app : App, options? : any ) {
        app.provide('qwiki', {
            project : this.project,
            createProject(name : string) {
                this.project = new QWikiProject(name);
            },
            setProjectName(name : string) {
                if(!this.project)
                    return;
                this.project.name = name
            },
            openProject(name : string) { },
            closeProject() { }
        });
        this.options = options;
    }
}

function useQWiki() {
    return new QWiki();
}

export { useQWiki, QWiki }