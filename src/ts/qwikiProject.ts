class QWikiArticle {
    id : string;
    title : string;
    collection : string;
    content : string;

    constructor(id : string, title : string, collection? : string, content? : string) {
        this.id = id;
        this.title = title;
        this.collection = collection ?? 'root';
        this.content = content ?? '';
    }
}

interface QwikiArticleEditOptions {
    id? : string,
    title? : string,
    collection? : string
}

class QWikiCollection {
    name : string;
    id : string;
    articles = [] as QWikiArticle[]

    constructor(id : string, name : string) {
        this.id = id;
        this.name = name;
    }

    getArticle(id : string) {
        return this.articles.find(a => a.id == id);
    }
    addArticle(id : string, title : string, content? : string) {
        const a = new QWikiArticle(id, title, this.id, content);
        this.articles.push(a);

        return a;
    }
    removeArticle(id : string) {
        if(id == 'home')
            return;
        this.articles.splice(this.articles.findIndex(a => a.id == id), 1);
    }
}

interface QWikiCollectionEditOptions {
    name? : string,
    id? : string
}

interface QWikiProjectFile {
    id : string,
    name : string,
    collections : QWikiCollectionFile[]
}
interface QWikiCollectionFile {
    id : string,
    name : string,
    articles : QWikiArticleFile[]
}
interface QWikiArticleFile {
    id : string,
    title : string,
    collection : string,
    content : string
}

export { QWikiProject, type QWikiProjectFile, QWikiArticle };

export default class QWikiProject {
    id : string;
    name : string;
    collections = [] as QWikiCollection[];

    constructor(id : string, name : string) {
        this.id = id;
        this.name = name;

        this.addCollection('root', 'root');
    }

    static Load(from : QWikiProjectFile) {
        const p = new QWikiProject(from.id, from.name);
        from.collections.forEach(c => {
            const aa = [] as QWikiArticle[];
            c.articles.forEach(a => {
                aa.push(new QWikiArticle(a.id, a.title, c.id, a.content));
            });

            const cc = new QWikiCollection(c.id, c.name);
            cc.articles = aa;
            p.collections.push(cc);
        });

        return p;
    }

    getFile() : QWikiProjectFile {
        return {
            id : this.id,
            name : this.name,
            collections : this.collections
        }
    }

    indexOfCollection(id : string) {
        return this.collections.findIndex(c => c.id == id);
    }
    indexOfArticle(id : string, collection? : string) {
        const i = collection ? this.indexOfCollection(collection) : 0;
        return this.collections[i].articles.findIndex(a => a.id == id);
    }

    collectionExists( id : string ) {
        return this.indexOfCollection(id) != -1;
    }
    getCollection( id? : string) {
        if(!id)
            return this.collections[0];
        return this.collections.find(c => c.id == id);
    }
    addCollection( id : string, name : string ) {
        const c = new QWikiCollection(id, name);
        this.collections.push(c);
        this.addArticle('home', id == 'root' ? 'Home' : name, '');

        return c;
    }
    removeCollection( id : string ) {
        const i  = this.indexOfCollection(id);
        this.collections.splice(i, 1);
    }
    editCollection( id : string, newValues : QWikiCollectionEditOptions ) {
        const c = this.getCollection(id);

        if(!c) return;

        if(newValues.id) c.id = newValues.id;
        if(newValues.name) c.name = newValues.name;
    }
    moveCollection( id : string, index : number ) {
        //TODO: add index change
    }

    articleExists(id : string, collection? : string) {
        return this.indexOfArticle(id, collection) != -1;
    }
    getArticle(id : string, collection? : string) {
        console.log('getArticle', this.getCollection(collection));
        return this.getCollection(collection)?.getArticle(id);
    }
    addArticle(id : string, title : string, collection? : string, content? : string) {
        return this.getCollection(collection)?.addArticle(id, title, content);
    }
    removeArticle(id : string, collection? : string) {
        this.getCollection(collection)?.removeArticle(id);
    }
    editArticle(id : string, newValues : QwikiArticleEditOptions, collection? : string) {
        const a = this.getCollection(collection)?.getArticle(id);
        if(!a) return;

        if(newValues.id) a.id = newValues.id;
        if(newValues.title) a.title = newValues.title;
        if(newValues.collection)
            this.moveToCollection(a.id, newValues.collection);
    }
    setContents(id : string, content : string, collection? : string) {
        const a = this.getCollection(collection)?.getArticle(id);
        if(!a) return;

        a.content = content;
    }
    moveArticle(id : string, index : number) {
        //TODO: add index change 
    }
    moveToCollection(id : string, toCollection : string, fromCollection? : string) {
        const from = this.getCollection(fromCollection);
        const to   = this.getCollection(toCollection);
        if(!from || !to) return;

        const article = from.getArticle(id);
        if(!article) return;

        from.removeArticle(id);
        to.addArticle(article.id, article.title, article.content);
    }
}