/**
 * White Blank Page
 * database.go
 * Raymond Jacobson 2014
 */

package backend

import (
  "fmt"
  "log"
  "gopkg.in/mgo.v2"
  // "reflect"
  "gopkg.in/mgo.v2/bson"
)

// Primary user type
type User struct {
  Key string
  Content string
}

// Conncet to the mongodb database
func DatabaseConnect(server_url string, database_name string, collection_name string) *mgo.Collection {
  session, err := mgo.Dial(server_url)
  if err != nil {
    panic(err)
  }
  // defer session.Close()
  c := session.DB(database_name).C(collection_name)
  // Unique index assurance 
  index := mgo.Index{
    Key: []string{"key"},
    Unique: true,
    DropDups: true,
  }
  err = c.EnsureIndex(index)
  if err != nil {
    panic(err)
  }
  fmt.Println("Connected to " + database_name + "." + collection_name)
  return c
}

// Run an upsert with the provided key and content
func UpdatePage(c *mgo.Collection, key string, content string) {
  _, err := c.Upsert(bson.M{"key": key}, bson.M{"key": key, "content": content})
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println(key + " updated")
}

// Retrieve & 
func GetPage(c *mgo.Collection, key string) string {
  current_user := User{}
  err := c.Find(bson.M{"key": key}).One(&current_user)
  if err != nil { // TODO: Should be a better err check
    UpdatePage(c, key, "")
    return ""
  }
  fmt.Println(key + " fetched")
  return current_user.Content
}