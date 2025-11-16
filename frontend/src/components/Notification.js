import { useSelector } from 'react-redux';
import { selectNotification } from '../redux/selectors';

/**
 * Notification component - Displays app notifications
 */
function Notification() {
  const notification = useSelector(selectNotification);

  if (!notification) {
    return null;
  }

  const { type, message } = notification;

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
