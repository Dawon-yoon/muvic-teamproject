const TMDB_API_KEY = "b472f129bf47a15cddfd73872a69e3b0";
const SPOTIFY_API_KEY = "ff518ea60amsh58ecc77c5666d05p17aaabjsnc1b8b85d4e36";
const movieId = new URLSearchParams(window.location.search).get("movieId");

// const getYear = () => {
//   const detailFooter = document.getElementById("detail-footer");
//   const year = new Date().getFullYear();
//   detailFooter.innerText = `©${year} muvic`;
// };

const renderMovieDetail = async () => {
  // get movie detail data
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?&append_to_response=videos&api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  const trailer = data.videos.results.find((video) => video.type === "Trailer");
  const movieDetailHTML = `
  <div class="movie-detail-info">
    <img class="movie-detail-poster" src="${
      data.poster_path
        ? "https://image.tmdb.org/t/p/w500" + data.poster_path
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
    }" />
    <div class="movie-detail-text">
      <h1>${data.title}</h1>
      <span>Grenre: ${data.genres[0].name}</span>
      <span>Rating: ${data.vote_average}<img src="star.png"/></span>
      <span>Release Date: ${data.release_date}</span>
      <div class="movie-detail-text-line"></div>
      <p>${data.overview}</p>
    </div>
  </div>
  <div class="trailer-container">
    <h1>Trailer</h1>
    <iframe src="https://www.youtube.com/embed/${
      trailer.key
    }?si=rcmKr8H3D-PN33AE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
  `;
  const recordImage = document.querySelector("img.record-image");
  recordImage.style.backgroundImage = `url(${
    data.poster_path
      ? "https://image.tmdb.org/t/p/w500" + data.poster_path
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
  })`;

  const movieDetailContainer = document.querySelector(
    ".movie-detail-container"
  );
  movieDetailContainer.innerHTML = movieDetailHTML;

  // get spotify ost playlist by movie title and display the playlist on the screen
  const resultElement = document.querySelector(".movie-ost-playlist");
  resultElement.innerHTML = await getOSTFromSpotify(data.title);

  //영화 제목으로 페이지 타이틀 변경
  document.title = `${data.title} | MUVIC`;
};

// Get Spotify iframe of OST songs for a given movie
const getOSTFromSpotify = async (query) => {
  const url = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": SPOTIFY_API_KEY,
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    const playlist = result.albums.items.find((item) =>
      item.data.name.toLowerCase().includes("soundtrack")
    );

    // extracts spotify playlist id
    const spotifyId = playlist.data.uri.split(":")[2];
    const iframeResult = `<iframe
    style="border-radius: 12px"
    src="https://open.spotify.com/embed/album/${spotifyId}?utm_source=generator"
    width="100%"
    height="352"
    frameborder="0"
    allowfullscreen=""
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    ></iframe>`;

    return iframeResult;
  } catch (error) {
    console.error(error);
    return "<span></span>";
  }
};

// const checkbox = document.getElementById('checkbox');
const checkbox = document.querySelector(".checkbox");
console.log(checkbox);

// checkbox를 click 했을 때 해당 함수를 실행
checkbox.addEventListener("click", clickDarkMode);

function clickDarkMode() {
  // Toggle dark mode for the body
  document.body.classList.toggle("dark");

  // Toggle dark mode for specific elements in the header
  const headerElements = document.querySelectorAll(".home-header");

  headerElements.forEach((element) => {
    element.classList.toggle("dark");
  });

  console.log("Dark mode toggled");
}

renderMovieDetail();

// getYear();
//
