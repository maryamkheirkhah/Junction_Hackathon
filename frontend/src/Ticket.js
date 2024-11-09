import React, { useState } from "react";

const Ticket = ({ ticket, addComment, changeStatus }) => {
  const [comment, setComment] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); // State to track if comments are open

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleString(undefined, options);
  };

  const handleAddComment = () => {
    if (comment) {
      addComment(ticket.id, {
        text: comment,
        date: new Date(),
      });
      setComment(""); // Clear input after submission
    }
  };

  const handleChangeStatus = (newStatus) => {
    changeStatus(ticket.id, newStatus);
  };

  const toggleComments = () => {
    setIsCommentsOpen(!isCommentsOpen); // Toggle visibility of comments
  };

  const backgroundColor = ticket.status === "Completed" ? "#d4edda" : "#f8d7da";

  return (
    <div className="ticket" style={{ backgroundColor }}>
      <div className="ticket-header">
        <span className="ticket-id">ID: {ticket.id}</span>
        <span className="ticket-date">
          Submitted on: {formatDate(ticket.createdAt)}
        </span>
      </div>
      <h3 className="ticket-title">Ticket Title: {ticket.title}</h3>
      <p className="ticket-description">
        Ticket Description: {ticket.description}
      </p>
      <p>
        <strong>Status:</strong> {ticket.status}
      </p>

      <div className="status-buttons">
        <button onClick={() => handleChangeStatus("In Progress")}>
          In Progress
        </button>
        <button onClick={() => handleChangeStatus("Completed")}>
          Completed
        </button>
      </div>

      {/* Comments Section */}
      <div className={`comments-section ${isCommentsOpen ? "open" : ""}`}>
        <h4>Comments:</h4>
        {ticket.comments && ticket.comments.length > 0 ? (
          <ul>
            {ticket.comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.text}</p>
                <p>{formatDate(comment.date)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Comment Input */}
        {isCommentsOpen && (
          <div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
          </div>
        )}
      </div>

      {/* Buttons for toggling comments */}
      <div>
        <button className="toggle-comments" onClick={toggleComments}>
          {isCommentsOpen ? "Hide Comments" : "Show Comments"}
        </button>
        {isCommentsOpen && (
          <button className="add-comment-button" onClick={handleAddComment}>
            Add Comment
          </button>
        )}
      </div>
    </div>
  );
};

export default Ticket;
