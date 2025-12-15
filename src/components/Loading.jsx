function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    </div>
  );
}

export default Loading;
