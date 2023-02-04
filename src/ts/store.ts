import { reactive } from 'vue'

export default reactive({
  currentArticle: "home",
  currentTitle: "Home",
  selectedText: "",
  setCurrentArticle(id:string, title:string) {
    this.currentArticle = id;
    this.currentTitle = title;
  }
})