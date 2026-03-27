import useStore from '../store/useStore';

export default function Modal() {
  const { modal, closeModal } = useStore();
  if (!modal.open) return null;
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {modal.content}
      </div>
    </div>
  );
}
