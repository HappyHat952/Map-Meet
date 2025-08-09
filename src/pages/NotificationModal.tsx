// Example: NotificationModal.tsx
import React from 'react';
import './NotificationModal.css'; // Ensure you have styles for the modal

interface Request {
  id: string;
  projectName: string;
  requesterName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  requests: Request[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const NotificationModal: React.FC<Props> = ({ open, onClose, requests, onAccept, onReject }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-window">
        <h3>Collaboration Requests</h3>
        {requests.length === 0 ? (
          <p>No requests.</p>
        ) : (
          requests.map(req => (
            <div key={req.id} className="request-item">
              <span>
                <b>{req.requesterName}</b> wants to join <b>{req.projectName}</b>
              </span>
              <button onClick={() => onAccept(req.id)}>Accept</button>
              <button onClick={() => onReject(req.id)}>Reject</button>
            </div>
          ))
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NotificationModal;