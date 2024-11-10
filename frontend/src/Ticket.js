import React, { useState, useEffect, useRef } from "react";

const Ticket = ({
  ticket,
  addComment,
  changeStatus,
  sessionId,
  isCommentsOpen,
  toggleCommentsVisibility,
}) => {
  const [comment, setComment] = useState("");
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [commentNotification, setCommentNotification] = useState(""); // State for notification
  const commentsEndRef = useRef(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Received":
        return "blue";
      case "In Progress":
        return "yellow";
      case "Completed":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const toggleCommentSectionVisibility = () => {
    setIsCommentSectionVisible((prevState) => !prevState); // Toggle visibility of the comment section
  };

  // Scroll to the bottom when new comment is added
  useEffect(() => {
    if (isCommentSectionVisible) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket.comments, isCommentSectionVisible]); // Scroll to bottom when comments or visibility change

  return (
    <div
      className="ticket"
      style={{ borderColor: getStatusColor(ticket.status) }}
    >
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
      <p
        style={{
          backgroundColor: "white",
          display: "inline-block",
          padding: "2px 5px",
          borderRadius: "3px",
        }}
      >
        <strong>Status:</strong> {ticket.status}
      </p>

      <div className="status-buttons">
        {/* Buttons for each status with color and black text */}
        <button
          style={{
            backgroundColor: "orange",
            color: "black",
            padding: "10px",
            margin: "5px",
          }}
          onClick={() => handleChangeStatus("Pending")}
        >
          Pending
        </button>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "black",
            padding: "10px",
            margin: "5px",
          }}
          onClick={() => handleChangeStatus("Received")}
        >
          Received
        </button>
        <button
          style={{
            backgroundColor: "yellow",
            color: "black",
            padding: "10px",
            margin: "5px",
          }}
          onClick={() => handleChangeStatus("In Progress")}
        >
          In Progress
        </button>
        <button
          style={{
            backgroundColor: "green",
            color: "black",
            padding: "10px",
            margin: "5px",
          }}
          onClick={() => handleChangeStatus("Completed")}
        >
          Completed
        </button>
        <button
          style={{
            backgroundColor: "red",
            color: "black",
            padding: "10px",
            margin: "5px",
          }}
          onClick={() => handleChangeStatus("Rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Comment Section */}
      {isCommentSectionVisible && (
        <div
          className="comments"
          style={{
            maxHeight: "200px", // Set max height to prevent overflow
            overflowY: "auto", // Allow scroll if comments exceed max height
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "10px",
            backgroundColor: "#fdfdfd",
            position: "relative", // Set position relative to allow absolute positioning of the text area
          }}
        >
          {/* Display comments in scrollable area */}
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {ticket.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>{comment.text}</p>
                <span style={{ fontSize: "12px", color: "#888" }}>
                  {formatDate(comment.date)}
                </span>
              </div>
            ))}
            {/* Scroll to the latest comment */}
            <div ref={commentsEndRef} />
          </div>
        </div>
      )}

      {/* Add Comment Textarea and Button (Inside the comment section, below the comments) */}
      {isCommentSectionVisible && (
        <div
          style={{
            marginTop: "10px",
            position: "relative",
          }}
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "none", // Disable textarea resizing
            }}
          />
          <button
            onClick={handleAddComment}
            style={{
              display: "block",
              marginTop: "10px",
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s",
              margin: "0 auto", // Center the button
            }}
          >
            Add Comment
          </button>
        </div>
      )}

      {/* Notification for comment */}
      {commentNotification && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {commentNotification}
        </div>
      )}

      {/* Button to Hide the Comment Section (Placed outside comment section) */}
      {isCommentSectionVisible && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={toggleCommentSectionVisibility}
            style={{
              width: "100%", // Full width of the ticket
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              textAlign: "center", // Center text in the button
            }}
          >
            Hide Comment Section
          </button>
        </div>
      )}

      {/* Button to Show the Comment Section (Placed outside comment section) */}
      {!isCommentSectionVisible && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={toggleCommentSectionVisibility}
            style={{
              width: "100%", // Full width of the ticket
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              textAlign: "center", // Center text in the button
            }}
          >
            Show Comment Section
          </button>
        </div>
      )}
    </div>
  );
};

export default Ticket;
