export default function ErrorMessage({ message }) {
  let title = "Bir Hata Oluştu";
  let btnColor = "btn-danger";

  return (
    <div className="d-flex align-items-center justify-content-center bg-dark text-white my-5 mx-5 rounded-4 shadow-2xl p-5 border border-secondary border-opacity-25">
      <div className="text-center p-4 p-md-5">
        <h1 className="display-4 fw-bold mb-3">{title}</h1>

        <p
          className="lead mb-5 px-3"
          style={{ maxWidth: "600px", opacity: 0.9 }}
        >
          {message}
        </p>

        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button
            onClick={() => window.location.reload()}
            className={`btn ${btnColor} btn-lg px-5 py-3 shadow`}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Tekrar Dene
          </button>
        </div>

        <p className="mt-5 text-white small">
          Sorun devam ederse sayfayı yenileyin veya daha sonra tekrar deneyin.
        </p>
      </div>
    </div>
  );
}
