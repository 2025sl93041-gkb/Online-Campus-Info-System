import { useState } from 'react';

/**
 * Reusable Feedback Modal with star rating
 * 
 * Props:
 * - isOpen: boolean - whether modal is shown
 * - onClose: () => void
 * - onSubmit: ({ rating, comment }) => Promise
 * - title: string - modal title
 * - subtitle: string - additional context (e.g., "Rate Counsellor John")
 */
const FeedbackModal = ({ isOpen, onClose, onSubmit, title = 'Submit Feedback', subtitle = '' }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ rating, comment });
      // Reset & close on success
      setRating(0);
      setComment('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setRating(0);
    setComment('');
    setError('');
    onClose();
  };

  return (
    <div className="feedback-modal-overlay" onClick={handleClose}>
      <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button onClick={handleClose} className="close-btn" disabled={submitting}>✕</button>
        </div>

        <div className="feedback-modal-body">
          {error && <div className="error-msg">{error}</div>}

          <div className="rating-section">
            <label>Your Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
              {rating > 0 && (
                <span className="rating-text">{rating} out of 5</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Your Feedback (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
              maxLength={500}
              disabled={submitting}
            />
            <div className="char-count">{comment.length}/500</div>
          </div>
        </div>

        <div className="feedback-modal-footer">
          <button onClick={handleClose} className="btn-secondary" disabled={submitting}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary" disabled={submitting || rating === 0}>
            {submitting ? 'Submitting...' : '⭐ Submit Feedback'}
          </button>
        </div>
      </div>

      <style>{`
        .feedback-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .feedback-modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .feedback-modal-header {
          padding: 24px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .feedback-modal-header h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }
        .modal-subtitle {
          margin: 4px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          line-height: 1;
        }
        .close-btn:hover {
          color: #333;
        }
        .close-btn:disabled {
          cursor: not-allowed;
        }
        .feedback-modal-body {
          padding: 24px;
        }
        .rating-section {
          margin-bottom: 20px;
        }
        .rating-section label,
        .form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .star-rating {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .star {
          font-size: 36px;
          color: #ddd;
          cursor: pointer;
          transition: color 0.15s, transform 0.15s;
          user-select: none;
        }
        .star:hover {
          transform: scale(1.1);
        }
        .star.filled {
          color: #ffc107;
        }
        .rating-text {
          margin-left: 12px;
          font-size: 14px;
          color: #666;
          font-weight: 600;
        }
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          box-sizing: border-box;
        }
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .char-count {
          text-align: right;
          font-size: 12px;
          color: #888;
          margin-top: 4px;
        }
        .feedback-modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .error-msg {
          background: #f8d7da;
          color: #721c24;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;