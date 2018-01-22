package service

import (
	"Deal/models"
	"container/list"
	"encoding/json"
	"time"

	"github.com/astaxie/beego"
	"github.com/gorilla/websocket"
)

type Subscription struct {
	Archive []models.Event      // All the events from the archive.
	New     <-chan models.Event // New events coming in.
}

func newEvent(ep models.EventType, user int64, msg string) models.Event {
	return models.Event{ep, user, int(time.Now().Unix()), msg}
}

type Subscriber struct {
	Name int64
	Conn *websocket.Conn // Only for WebSocket users; otherwise nil.
}

var (
	// Channel for new join users.
	subscribe = make(chan Subscriber, 100)
	// Channel for exit users.
	unsubscribe = make(chan int64, 100)
	// Send events here to publish them.
	publish = make(chan models.Event, 100)
	// Long polling waiting list.
	waitingList = list.New()
	subscribers = list.New()
	depth       = true
)

// This function handles all incoming chan messages.
func chatroom() {
	beego.Trace("房间已经启动了")
	for {
		select {
		case sub := <-subscribe:
			if !isUserExist(subscribers, sub.Name) {
				subscribers.PushBack(sub) // Add user to the end of list.
				// Publish a JOIN event.
				publish <- newEvent(models.EVENT_JOIN, sub.Name, "")
				beego.Info("New user:", sub.Name, ";WebSocket:", sub.Conn != nil)
			} else {
				beego.Info("Old user:", sub.Name, ";WebSocket:", sub.Conn != nil)
			}
		case event := <-publish:
			// Notify waiting list.
			for ch := waitingList.Back(); ch != nil; ch = ch.Prev() {
				ch.Value.(chan bool) <- true
				waitingList.Remove(ch)
			}

			broadcastWebSocket(event)
			models.NewArchive(event)

			if event.Type == models.EVENT_MESSAGE {
				beego.Info("type:", event.Type, "Message from", event.User, ";Content:", event.Content)
			}
		case unsub := <-unsubscribe:
			for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
				if sub.Value.(Subscriber).Name == unsub {
					subscribers.Remove(sub)
					// Clone connection.
					ws := sub.Value.(Subscriber).Conn
					if ws != nil {
						ws.Close()
						beego.Error("WebSocket closed:", unsub)
					}
					publish <- newEvent(models.EVENT_LEAVE, unsub, "") // Publish a LEAVE event.
					break
				}
			}
		}
	}
}

func init() {
	go chatroom()
}

func isUserExist(subscribers *list.List, user int64) bool {
	for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
		if sub.Value.(Subscriber).Name == user {
			return true
		}
	}
	return false
}

//广播消息
func broadcastWebSocket(event models.Event) {
	data, err := json.Marshal(event)
	if err != nil {
		beego.Error("Fail to marshal event:", err)
		return
	}
/*
	if event.User != 0 {
		for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
			// Immediately send event to WebSocket users.
			if event.User == sub.Value.(Subscriber).Name {
				ws := sub.Value.(Subscriber).Conn
			}

			ws := sub.Value.(Subscriber).Conn
			if ws != nil {
				if ws.WriteMessage(websocket.TextMessage, data) != nil {
					// 写入错误 断开连接
					unsubscribe <- sub.Value.(Subscriber).Name
				}
			}
		}
	}
	*/
	for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
		// Immediately send event to WebSocket users.
		ws := sub.Value.(Subscriber).Conn
		if ws != nil {
			if ws.WriteMessage(websocket.TextMessage, data) != nil {
				// 写入错误 断开连接
				unsubscribe <- sub.Value.(Subscriber).Name
			}
		}
	}
}

func Join(user int64, ws *websocket.Conn) {
	subscribe <- Subscriber{Name: user, Conn: ws}
}

func Leave(user int64) {
	unsubscribe <- user
}

func Publish(userId int64, data string) {
	publish <- newEvent(models.EVENT_MESSAGE, userId, data)
}

func GetDepthState() bool {
	return depth
}