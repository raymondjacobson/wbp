/**
 * White Blank Page
 * mailer.go
 * Raymond Jacobson 2015
 */

package backend

import (
  // "fmt"
  "github.com/mailgun/mailgun-go"
)

const wbp_sender string = "sandboxae980c276be740d588c9682c624e9112.mailgun.org"
const api_key string = "key-6887ccd5ffb699891980a4b789aff76b"
const pub_key string = "pubkey-ca80a2275c26206628fd7fb0d47ce9a0"
const from string = "Do_not_reply <do_not_reply@raymondjacobson.com>"

// Sends an email using mailgun API
func sendMail(gun_sender string, api_key string, pub_key string,
  subject string, content string, from string, to string) {

  gun := mailgun.NewMailgun(sender, api_key, pub_key)
  m := mailgun.NewMessage(from, subject, content, to)
  response, id, _ := gun.Send(m)
  fmt.Printf("Response ID: %s\n", id)
  fmt.Printf("Message from server: %s\n", response)
}

// Generates link for reauth and emails it to the user
func EmailReAuthLink(to string, temp_key string, host_url string) {
  subject := "Your temporary White Blank Page authentication link"
  reauth_url := "/reauth/" + temp_key
  content := "Here is the link to your White Blank Page\n" + 
    host_url + reauth_url + "\n This link expires in 5 hours."
  sendMail(wbp_sender, api_key, pub_key, subject, content, from, to+" <"+to">")
}