class QwikiArticle {
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
    articles = [] as QwikiArticle[]

    constructor(id : string, name : string) {
        this.id = id;
        this.name = name;
    }

    getArticle(id : string) {
        return this.articles.find(a => a.id == id);
    }
    addArticle(id : string, title : string, content? : string) {
        const a = new QwikiArticle(id, title, this.id, content);
        this.articles.push(a);

        return a;
    }
}

interface QWikiCollectionEditOptions {
    name? : string,
    id? : string
}

export default class QWikiProject {
    id : string;
    name : string;
    collections = [] as QWikiCollection[];

    constructor(id : string, name : string) {
        this.id = id;
        this.name = name;

        this.addCollection('root', 'root');
    }

    indexOfCollection(id : string) {
        return this.collections.findIndex(c => c.id == id);
    }
    indexOfArticle(id : string, collection? : string) {
        const i = this.indexOfCollection(collection ?? 'root');
        return this.collections[i].articles.findIndex(a => a.id == id);
    }

    collectionExists( id : string ) {
        return this.indexOfCollection(id) != -1;
    }
    getCollection( id : string) {
        return this.collections.find(c => c.id == id);
    }
    addCollection( id : string, name : string ) {
        const c = new QWikiCollection(id, name);
        this.collections.push(c);

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

    }

    articleExists(id : string, collection? : string) {
        return this.indexOfArticle(id, collection) == -1;
    }
    getArticle(id : string, collection? : string) {
        return this.getCollection(collection ?? 'root')?.getArticle(id);
    }
    addArticle(id : string, title : string, collection? : string, content? : string) {

    }
    removeArticle(id : string) {

    }
    editArticle(id : string, newValues : QwikiArticleEditOptions) {

    }
    setContents(id : string, content : string) {

    }
    moveArticle(id : string, index : number) {

    }
    moveToCollection(id : string, collection : string) {

    }
}