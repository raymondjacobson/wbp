/**
 * White Blank Page
 * Raymond Jacobson 2014
 */

package main

import (
  "github.com/julienschmidt/httprouter"
  "net/http"
  "log"
)

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "index.html");
}

func Page(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  w.Header().Set("Content-Type", "application/json")
  http.ServeFile(w, r, "sample.json");
}

func main() {
  router := httprouter.New()
  router.ServeFiles("/pub/*filepath", http.Dir("pub/"))
  router.GET("/", Index)
  router.GET("/page/:key", Page)

  log.Fatal(http.ListenAndServe(":3000", router))
}



