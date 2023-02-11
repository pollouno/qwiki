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
        this.articles.splice(this.articles.findIndex(a => a.id == id), 1);
    }
}

interface QWikiCollectionEditOptions {
    name? : string,
    id? : string
}

export { QWikiProject, QWikiArticle };

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
    getCollection( id? : string) {
        return this.collections.find(c => c.id == (id ?? 'root'));
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