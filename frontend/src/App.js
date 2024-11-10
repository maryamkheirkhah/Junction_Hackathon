import React, { useState } from "react";
import "./App.css";
import Ticket from "./Ticket";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filter, setFilter] = useState("all");
  const [nextId, setNextId] = useState(1);
  const [commentsVisibility, setCommentsVisibility] = useState({});
  const [sessionId] = useState(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) return storedSessionId;
    const newSessionId = uuidv4();
    localStorage.setItem("sessionId", newSessionId);
    return newSessionId;
  });

  const createTicket = () => {
    if (newTicketTitle && newTicketDescription) {
      const newTicket = {
        id: nextId,
        title: newTicketTitle,
        description: newTicketDescription,
        comments: [],
        status: "Pending",
        createdAt: new Date(),
        createdBy: sessionId,
      };
      setTickets([newTicket, ...tickets]);
      setNextId(nextId + 1);
      setNewTicketTitle("");
      setNewTicketDescription("");
      triggerNotification(
        `New ticket "${newTicket.title}" created. Status: Pending.`
      );
    }
  };

  const addComment = (id, comment) => {
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === id) {
        const updatedComments = [...ticket.comments, comment];
        if (ticket.createdBy === sessionId) {
          setNotifications([
            ...notifications,
            {
              message: `New comment on your ticket "${ticket.title}".`,
              id: uuidv4(),
            },
          ]);
        }
        return { ...ticket, comments: updatedComments };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  const changeStatus = (id, newStatus) => {
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === id) {
        triggerNotification(
          `Ticket "${ticket.title}" status changed to ${newStatus}.`
        );
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  const triggerNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, id: uuidv4() },
    ]);
  };

  const sortTickets = (order) => {
    const sortedTickets = [...tickets].sort((a, b) => {
      if (order === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setSortOrder(order);
    setTickets(sortedTickets);
  };

  const filteredTickets = tickets
    .filter((ticket) => {
      if (filter === "myTickets") {
        return ticket.createdBy === sessionId;
      }
      if (filter === "completed") {
        return ticket.status === "Completed";
      }
      if (filter === "pending") {
        return ticket.status === "Pending";
      }
      if (filter === "received") {
        return ticket.status === "Received";
      }
      if (filter === "rejected") {
        return ticket.status === "Rejected";
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const toggleCommentsVisibility = (id) => {
    setCommentsVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="app">
      <h1>Ticket Management System</h1>
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="notifications">
          <h3>Notifications</h3>
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="notification">
                <span className="notification-icon">🔔</span>
                <span className="notification-message">
                  {notification.message}
                </span>
                <button
                  className="notification-close"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.filter((n) => n.id !== notification.id)
                    )
                  }
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ticket-creation">
        <input
          type="text"
          placeholder="Ticket Title"
          value={newTicketTitle}
          onChange={(e) => setNewTicketTitle(e.target.value)}
        />
        <textarea
          placeholder="Ticket Description"
          value={newTicketDescription}
          onChange={(e) => setNewTicketDescription(e.target.value)}
        />
        <button onClick={createTicket}>Create Ticket</button>
      </div>

      <div className="sorting-filtering">
        <div className="sorting">
          <span className="sorting-filtering-label">Sort By:</span>
          <button onClick={() => sortTickets("latest")}>Latest</button>
          <button onClick={() => sortTickets("oldest")}>Oldest</button>
        </div>
        <div className="filtering">
          <span className="sorting-filtering-label">Filter By:</span>
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All Tickets</option>
            <option value="myTickets">My Tickets</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="tickets-list">
        {filteredTickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            addComment={addComment}
            changeStatus={changeStatus}
            sessionId={sessionId}
            isCommentsOpen={commentsVisibility[ticket.id]}
            toggleCommentsVisibility={toggleCommentsVisibility}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
