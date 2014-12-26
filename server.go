/**
 * White Blank Page
 * server.go
 * Raymond Jacobson 2014
 */

package main

import (
  "github.com/julienschmidt/httprouter"
  "gopkg.in/mgo.v2"
  "io/ioutil"
  "net/http"
  "log"
  "./backend"
)

// Package variable to store white blank page mongodb collection
var db_coll *mgo.Collection

// Route for the users white blank page
// Check for the cookie set on the browser, else set cookie with UID
func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "index.html")
}

// Query the mongo database using the user's auth key in ps
// Render json data with the user's wbp
func FetchPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  w.Header().Set("Content-Type", "application/json")
  // TODO
  auth_key := ps.ByName("key")
  content_string := backend.GetPage(db_coll, auth_key)
  w.Write([]byte(content_string))
}

// Query the mongo database using the user's auth key in ps
// Update the mongo database record for the user with the post data in ps
func EditPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  w.Header().Set("Content-Type", "application/json")
  // TODO
  auth_key := ps.ByName("key")
  body, _ := ioutil.ReadAll(r.Body)
  page_string := string(body)
  backend.UpdatePage(db_coll, auth_key, page_string)
  http.ServeFile(w, r, "sample.json")
}

func main() {
  server_port := ":3000"
  db_coll = backend.DatabaseConnect("localhost:27017", "wbp", "pages")
  router := httprouter.New()

  // Serve static assets
  router.ServeFiles("/pub/*filepath", http.Dir("pub/"))

  // Routes
  router.GET("/", Index)
  router.GET("/page/:key/fetch", FetchPage)
  router.POST("/page/:key/edit", EditPage)

  log.Fatal(http.ListenAndServe(server_port, router))

}