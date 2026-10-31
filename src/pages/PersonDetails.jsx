import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Loading from "../components/Loading";
import MovieGrid from "../components/MovieGrid";
import {
  getPerson,
  getPersonMovieCredits,
  imageUrl,
} from "../services/tmdb";

const BIO_PREVIEW_LENGTH = 700;

// Aynı filmde birden çok kredisi olan oyuncunun kayıtlarını tek karta indirger.
function groupCredits(credits, getRole) {
  const byMovie = new Map();
  for (const credit of credits) {
    const role = getRole(credit);
    const existing = byMovie.get(credit.id);
    if (!existing) {
      byMovie.set(credit.id, { ...credit, roles: role ? [role] : [] });
    } else if (role && !existing.roles.includes(role)) {
      existing.roles.push(role);
    }
  }
  return [...byMovie.values()];
}

function sortCredits(list, order) {
  const byDate = (dir) => (a, b) => {
    const da = a.release_date || "";
    const db = b.release_date || "";
    if (!da && !db) return 0;
    if (!da) return 1; // tarihsiz kayıtlar sonda
    if (!db) return -1;
    return dir * da.localeCompare(db);
  };
  const sorters = {
    newest: byDate(-1),
    oldest: byDate(1),
    popularity: (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
  };
  return [...list].sort(sorters[order]);
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getAge(birthday, deathday) {
  const end = deathday ? new Date(deathday) : new Date();
  const born = new Date(birthday);
  let age = end.getFullYear() - born.getFullYear();
  const hadBirthday =
    end.getMonth() > born.getMonth() ||
    (end.getMonth() === born.getMonth() && end.getDate() >= born.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

export default function PersonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({ status: "loading" });
  const [order, setOrder] = useState("newest");
  const [bioExpanded, setBioExpanded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      setState({ status: "loading" });
      setBioExpanded(false);
      try {
        const [person, credits] = await Promise.all([
          getPerson(id, {}, signal),
          getPersonMovieCredits(id, signal),
        ]);

        // Türkçe biyografi yoksa İngilizce olanı dene (uydurma içerik yok).
        let biography = person.biography;
        let biographyLang = "tr";
        if (!biography) {
          try {
            const english = await getPerson(id, { language: "en-US" }, signal);
            biography = english.biography;
            biographyLang = "en";
          } catch (err) {
            if (err.name === "AbortError") return;
          }
        }

        setState({ status: "ready", person, credits, biography, biographyLang });
      } catch (err) {
        if (err.name === "AbortError") return;
        setState({
          status: "error",
          notFound: err.status === 404,
          message: err.message,
        });
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  const acting = useMemo(
    () => (state.credits ? groupCredits(state.credits.cast || [], (c) => c.character) : []),
    [state.credits]
  );
  const directing = useMemo(
    () =>
      state.credits
        ? groupCredits(
            (state.credits.crew || []).filter((c) => c.job === "Director"),
            () => "Yönetmen"
          )
        : [],
    [state.credits]
  );

  const sortedActing = useMemo(() => sortCredits(acting, order), [acting, order]);
  const sortedDirecting = useMemo(() => sortCredits(directing, order), [directing, order]);

  if (state.status === "loading") return <Loading />;

  if (state.status === "error") {
    return (
      <div className="container-xl py-5 text-center">
        <p className="lead">
          {state.notFound ? "Oyuncu bulunamadı." : state.message}
        </p>
        <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
          Geri dön
        </button>
      </div>
    );
  }

  const { person, biography, biographyLang } = state;
  const photo = imageUrl(person.profile_path, "h632");
  const longBio = biography && biography.length > BIO_PREVIEW_LENGTH;
  const shownBio =
    longBio && !bioExpanded ? `${biography.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}…` : biography;

  const roleSubtitle = (movie) => movie.roles.join(", ");

  return (
    <div className="container-xl py-4">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm rounded-pill px-3 mb-4"
        onClick={() => navigate(-1)}
      >
        ← Geri Dön
      </button>

      <div className="row g-4 g-lg-5">
        <div className="col-12 col-md-4 col-lg-3 text-center">
          {photo ? (
            <img src={photo} alt={person.name} className="person-photo" />
          ) : (
            <div className="person-photo person-photo-fallback" role="img" aria-label="Fotoğraf yok">
              <i className="bi bi-person-fill" aria-hidden="true"></i>
            </div>
          )}
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          <h1 className="display-6 fw-bold mb-3">{person.name}</h1>

          <dl className="person-facts">
            {person.known_for_department && (
              <>
                <dt>Bilinen alanı</dt>
                <dd>{person.known_for_department}</dd>
              </>
            )}
            {person.birthday && (
              <>
                <dt>Doğum tarihi</dt>
                <dd>
                  {formatDate(person.birthday)}
                  {!person.deathday && ` (${getAge(person.birthday)} yaşında)`}
                </dd>
              </>
            )}
            {person.deathday && (
              <>
                <dt>Ölüm tarihi</dt>
                <dd>
                  {formatDate(person.deathday)}
                  {person.birthday && ` (${getAge(person.birthday, person.deathday)} yaşında)`}
                </dd>
              </>
            )}
            {person.place_of_birth && (
              <>
                <dt>Doğum yeri</dt>
                <dd>{person.place_of_birth}</dd>
              </>
            )}
          </dl>

          <h2 className="h4 fw-bold mt-4 mb-2">Biyografi</h2>
          {biography ? (
            <>
              <p className="person-bio">{shownBio}</p>
              {biographyLang === "en" && (
                <p className="small text-body-secondary">Biyografi İngilizce olarak gösteriliyor.</p>
              )}
              {longBio && (
                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => setBioExpanded((v) => !v)}
                  aria-expanded={bioExpanded}
                >
                  {bioExpanded ? "Daha az göster" : "Devamını oku"}
                </button>
              )}
            </>
          ) : (
            <p className="text-body-secondary">Bu kişi için biyografi bulunamadı.</p>
          )}
        </div>
      </div>

      <section className="mt-5" aria-labelledby="filmography-title">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <h2 id="filmography-title" className="h3 fw-semibold mb-0">
            Filmografi
          </h2>
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="credit-order" className="small text-body-secondary mb-0">
              Sıralama
            </label>
            <select
              id="credit-order"
              className="form-select form-select-sm w-auto"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="newest">Yeniden eskiye</option>
              <option value="oldest">Eskiden yeniye</option>
              <option value="popularity">Popülerliğe göre</option>
            </select>
          </div>
        </div>
        <hr className="mt-0" />

        {sortedActing.length === 0 && sortedDirecting.length === 0 && (
          <p className="text-body-secondary">Filmografi bilgisi bulunamadı.</p>
        )}

        {sortedActing.length > 0 && (
          <>
            {sortedDirecting.length > 0 && <h3 className="h5 mb-3">Oyunculuk</h3>}
            <MovieGrid movies={sortedActing} getSubtitle={roleSubtitle} />
          </>
        )}

        {sortedDirecting.length > 0 && (
          <>
            <h3 className="h5 mt-5 mb-3">Yönetmenlik</h3>
            <MovieGrid movies={sortedDirecting} />
          </>
        )}
      </section>
    </div>
  );
}
