import { reactive } from "vue";
import events from "./events";
import type { Article } from "./interfaces"

let collections = [] as string[];
let articles : { [id : string] : Article } = {};

const storage = reactive({
    load() {
        const cc = window.localStorage.getItem("collections") ?? '["main"]';
        const aa = window.localStorage.getItem("articles") ?? "{}";
        collections = JSON.parse(cc) as string[];
        articles    = JSON.parse(aa) as { [id : string] : Article };
        console.log("content loaded!");
        console.log(collections);
    },
    save() {
        window.localStorage.setItem("articles", JSON.stringify(articles));
        window.localStorage.setItem("collections", JSON.stringify(collections));
        console.log("content saved!");
    },
    getCollections() { return collections; },
    collectionExists(id : string | undefined) { return id && collections.findIndex(e => e == id) != -1; },
    addCollection(id : string) {
        if(id in collections)
            return undefined;
        
        collections.push(id);
        events.emit('createdCollection', { id : id });
        return id;
    },
    articleExists(id : string | undefined) { return id && id in articles; },
    getArticle(id : string) {
        if(id in articles)
            return articles[id];
        else
            return undefined;
    },
    getChildArticles(id : string) {
        const arr = [] as Array<Article>;

        for (const key in articles) {
            if(articles[key].parent === id || (id == "main" && articles[key].parent == ""))
                arr.push(articles[key]);
        }

        return arr;
    },
    setArticle(id : string, article : Article) {
        if(id != article.id) {
            delete articles[id];
        }

        articles[article.id] = article;
        this.save();

        events.emit('updatedArticle', { id : id, article : article });
        return article;
    },
    setArticleMetadata(id : string, title : string, newId : string)
    {
        const a = this.getArticle(id);

        if(!a)
            return false;

        a.title = title;
        a.id = newId;

        this.setArticle(id, a);

        return true;
    }
});

export default storage;