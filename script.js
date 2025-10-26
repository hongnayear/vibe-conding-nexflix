// TMDB API 설정
const API_KEY = 'aabf0c446158ded0fbe14f2c22a9bc9a';
const API_URL = 'https://api.themoviedb.org/3/movie/now_playing';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM 요소
const moviesContainer = document.getElementById('movies-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const header = document.querySelector('header');

// 스크롤 이벤트로 헤더 배경 변경
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 영화 데이터 가져오기
async function fetchMovies() {
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        moviesContainer.innerHTML = '';

        const response = await fetch(`${API_URL}?api_key=${API_KEY}&language=ko-KR&page=1`);
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        loadingElement.style.display = 'none';

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            showError('영화 정보가 없습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        loadingElement.style.display = 'none';
        showError('영화 정보를 불러오는데 실패했습니다.');
    }
}

// 영화 카드 표시
function displayMovies(movies) {
    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });
}

// 영화 카드 생성
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const releaseDate = movie.release_date 
        ? new Date(movie.release_date).toLocaleDateString('ko-KR')
        : '날짜 미정';

    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    card.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster" loading="lazy">
        <div class="movie-info">
            <h4 class="movie-title">${movie.title}</h4>
            <div class="movie-rating">
                <span>⭐</span>
                <span>${rating}</span>
            </div>
            <div class="movie-date">
                <span class="date-label">📅</span>
                <span>${releaseDate}</span>
            </div>
        </div>
    `;

    // 클릭 이벤트 추가
    card.addEventListener('click', () => {
        showMovieDetails(movie);
    });

    return card;
}

// 영화 상세 정보 표시 (간단한 alert로 구현)
function showMovieDetails(movie) {
    const details = `
제목: ${movie.title}
개봉일: ${movie.release_date || '미정'}
평점: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
줄거리: ${movie.overview || '정보 없음'}
    `;
    alert(details);
}

// 에러 표시
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 페이지 로드 시 영화 데이터 가져오기
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});


