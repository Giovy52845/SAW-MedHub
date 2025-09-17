import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function MyAllert({ title, testo, onClose }) {
  return (
    <Alert variant="info" className="mt-3">
      <Alert.Heading>{title}</Alert.Heading>
      <p>{testo}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={onClose} variant="outline-info">
          Chiudi
        </Button>
      </div>
    </Alert>
  );
}
