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

// Route for the users white blank page
// Check for the cookie set on the browser, else set cookie with UID
func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "index.html");
}

// Temporary dummy route to serve json data
func PageFetch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  w.Header().Set("Content-Type", "application/json")
  http.ServeFile(w, r, "sample.json");
}

// Temporary route to handle post request for new data coming in
func PageEdit(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  w.Header().Set("Content-Type", "application/json")
  http.ServeFile(w, r, "sample.json");
}

func main() {

  router := httprouter.New()

  // Serve static assets
  router.ServeFiles("/pub/*filepath", http.Dir("pub/"))

  // Routes
  router.GET("/", Index)
  router.GET("/page/:key/fetch", PageFetch)
  router.POST("/page/:key/edit", PageEdit)

  log.Fatal(http.ListenAndServe(":3000", router))
  
}