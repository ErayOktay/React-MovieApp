export default function ErrorMessage({ message, onRetry }) {
  const title = "Bir Hata Oluştu";

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-dark text-white my-4 my-md-5 mx-3 mx-md-5 rounded-4 shadow-2xl p-3 p-md-5 border border-secondary border-opacity-25"
      role="alert"
    >
      <div className="text-center p-2 p-md-5">
        <h1 className="fs-2 fw-bold mb-3">{title}</h1>

        <p
          className="lead mb-4 mb-md-5 px-md-3"
          style={{ maxWidth: "600px", opacity: 0.9 }}
        >
          {message}
        </p>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            type="button"
            onClick={onRetry || (() => window.location.reload())}
            className="btn btn-danger btn-lg px-5 py-3 shadow"
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Tekrar Dene
          </button>
        </div>

        <p className="mt-4 mt-md-5 text-white small">
          Sorun devam ederse sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
      </div>
    </div>
  );
}
