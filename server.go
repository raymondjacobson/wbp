/**
 * White Blank Page
 * server.go
 * Raymond Jacobson 2015
 */

package main

import (
  "github.com/julienschmidt/httprouter"
  "gopkg.in/mgo.v2"
  "io/ioutil"
  "net/http"
  "log"
  "./backend"
  "fmt"
)

// Package variable to store white blank page mongodb collection
var db_coll *mgo.Collection

// Handle for the users white blank page
// Check for the cookie set on the browser, else set cookie with UID
func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "index.html")
}

// Query the mongo database using the user's auth key in ps
// Render json data with the user's wbp
func FetchPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  auth_key := ps.ByName("key")
  content_string := backend.GetPage(db_coll, auth_key)
  w.Write([]byte(content_string))
}

// Query the mongo database using the user's auth key in ps
// Update the mongo database record for the user with the post data in ps
func EditPage(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  auth_key := ps.ByName("key")
  body, _ := ioutil.ReadAll(r.Body)
  page_string := string(body)
  backend.UpdatePage(db_coll, auth_key, page_string)
  w.Write([]byte("success"))
}

// Handle for the adding of a cookie with a given key
// Directs simply to the index page, where JS handles the different url
func AuthPage(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "index.html")
}

// Handle for sending an email out to reauthorize account
// Post data in ps contains the auth key needed
func SendEmail(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  to_address := ps.ByName("address")
  auth_key := ps.ByName("key")
  fmt.Println(to_address, auth_key)
  temp_key := database.GetReauthKey(auth_key)
  host_url := r.RequestURI["Host"]
  backend.EmailReAuthLink(to_address, temp_key, host_url)
}

// Handle for page that sets up a new key on an email account
// Recovers the actual key from the temp_key given and sends along to the template
func ReAuth(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
  http.ServeFile(w, r, "reauth.html");
}

// Handle for silent route to get actual auth key from temp auth key
func TempToActualKey(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
  temp_key := ps.ByName("temp_key")
  auth_key := database.GetActualKeyFromTemp(temp_key)
  w.Write([]byte(auth_key))
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
  router.GET("/auth/:key", AuthPage)
  router.GET("/sendemail/:address/:key", SendEmail)
  router.GET("/reauth/:temp_key", ReAuth)
  router.GET("/keychange/:temp_key", TempToActualKey)

  log.Fatal(http.ListenAndServe(server_port, router))

}