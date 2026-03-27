import useStore from '../store/useStore';

export default function Toast() {
  const { toastMsg, toastVisible } = useStore();
  return (
    <div
      className={`toast ${toastVisible ? 'show' : 'hide'}`}
      aria-live="polite"
    >
      {toastMsg}
    </div>
  );
}
