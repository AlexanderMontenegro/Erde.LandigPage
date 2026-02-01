import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <button onClick={onClose} style={close}>✖</button>
        <LoginForm onSuccess={onClose} />
        <hr />
        <RegisterForm onSuccess={onClose} />
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "320px",
};

const close = {
  float: "right",
  cursor: "pointer",
};
