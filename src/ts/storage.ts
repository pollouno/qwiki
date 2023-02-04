import type { Article } from "./interfaces"

let articles : { [id : string] : Article } = {};

const storage = {
    load() {
        const s = window.localStorage.getItem("articles") ?? "{}";
        articles = JSON.parse(s) as { [id : string] : Article };
        console.log("content loaded!");
    },
    save() {
        window.localStorage.setItem("articles", JSON.stringify(articles));
        console.log("content saved!");
    },
    getArticle(id : string) {
        if(id in articles)
            return articles[id];
        else
            return undefined;
    },
    getChildArticles(id : string) {
        const arr = [] as Array<Article>;

        for (const key in articles) {
            if(articles[key].parent === id)
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
}

export default storage;