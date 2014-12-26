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
    Key: []string{"key", "content"},
    Unique: true,
    DropDups: true,
  }
  err = c.EnsureIndex(index)
  if err != nil {
    panic(err)
  }
  fmt.Println("db connect")
  return c
}

// Run an insert with the provided key and content
func UpdatePage(c *mgo.Collection, key string, content string) {
  err := c.Insert(&User{key, content})
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("page updated")
}

// Retrieve & 
func GetPage(c *mgo.Collection, key string) string {
  current_user := User{}
  err := c.Find(bson.M{"key": key}).One(&current_user)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println("got page")
  return current_user.Content
}