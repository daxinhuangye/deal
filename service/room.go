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
)

func init() {
	go chatroom()
}

// This function handles all incoming chan messages.
func chatroom() {
	beego.Trace("房间已经启动了")
	for {
		select {
		case sub := <-subscribe:
			//如果用户不在线
			if !isUserExist(subscribers, sub.Name) {
				//添加一个用户到列表中
				subscribers.PushBack(sub)
				//发送一个用户加入的事件到客户端告诉其他人
				publish <- newEvent(models.EVENT_JOIN, sub.Name, "")
				beego.Info("New user:", sub.Name, ";WebSocket:", sub.Conn != nil)
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
				//beego.Info("type:", event.Type, "Message from", event.User, ";Content:", event.Content)
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

	if event.User != 0 {
		for sub := subscribers.Front(); sub != nil; sub = sub.Next() {
			// Immediately send event to WebSocket users.
			if event.User == sub.Value.(Subscriber).Name {
				ws := sub.Value.(Subscriber).Conn
				if ws != nil {
					if ws.WriteMessage(websocket.TextMessage, data) != nil {
						// 写入错误 断开连接
						unsubscribe <- sub.Value.(Subscriber).Name
					}
				}
				break
			}

		}
	} else {
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
