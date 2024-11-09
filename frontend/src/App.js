import React, { useState, useEffect } from "react";
import "./App.css";
import Ticket from "./Ticket";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [filter, setFilter] = useState("all"); // Filter state: 'all', 'myTickets', 'underway', 'completed'
  const [nextId, setNextId] = useState(1); // Counter for sequential IDs

  // Generate a unique sessionId for the user (simulating user identification)
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
        id: nextId, // Use the next available sequential ID
        title: newTicketTitle,
        description: newTicketDescription,
        comments: [],
        status: "Underway",
        createdAt: new Date(), // This line creates a timestamp
        createdBy: sessionId,
      };
      setTickets([newTicket, ...tickets]);
      setNextId(nextId + 1); // Increment the counter for the next ticket
      setNewTicketTitle("");
      setNewTicketDescription("");
    }
  };

  const addComment = (id, comment) => {
    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === id) {
        const updatedComments = [...ticket.comments, comment];
        if (ticket.createdBy === sessionId) {
          setNotifications([
            ...notifications,
            `New comment on your ticket "${ticket.title}".`,
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
        if (ticket.createdBy === sessionId && newStatus === "Completed") {
          setNotifications([
            ...notifications,
            `Your ticket "${ticket.title}" has been marked as completed.`,
          ]);
        }
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });
    setTickets(updatedTickets);
  };

  // Sort tickets based on date (latest or oldest)
  const sortTickets = (order) => {
    const sortedTickets = [...tickets].sort((a, b) => {
      if (order === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setSortOrder(order);
    setTickets(sortedTickets);
  };

  // Filter tickets based on 'all', 'myTickets', 'underway', or 'completed'
  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "myTickets") {
      return ticket.createdBy === sessionId;
    }
    if (filter === "inprogress") {
      return ticket.status === "In Progress";
    }
    if (filter === "completed") {
      return ticket.status === "Completed";
    }
    return true; // Show all tickets if no specific filter
  });

  return (
    <div className="app">
      <h1>Ticket Management System</h1>
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
          <label>Sort by: </label>
          <button onClick={() => sortTickets("latest")}>Latest</button>
          <button onClick={() => sortTickets("oldest")}>Oldest</button>
        </div>
        <div className="filtering">
          <label>Show: </label>
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All Tickets</option>
            <option value="myTickets">My Tickets</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="notifications">
        {notifications.map((note, index) => (
          <div key={index} className="notification">
            {note}
          </div>
        ))}
      </div>

      <div className="tickets-list">
        {filteredTickets.map((ticket) => (
          <Ticket
            key={ticket.id}
            ticket={ticket}
            addComment={addComment}
            changeStatus={changeStatus}
            sessionId={sessionId}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
