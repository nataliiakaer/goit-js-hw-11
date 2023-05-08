import { NewsApiService } from './js/api-set';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { onRenderGallery } from './js/createMarkup';
import { refs } from './js/refs';

let isShown = 0;
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  newsApiService.incrementPage();
  fetchGallery();
}

function onSearch(element) {
  element.preventDefault();

  refs.galleryContainer.innerHTML = '';
  newsApiService.query =
    element.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  isShown = 0;
  fetchGallery();
}

async function fetchGallery() {
  refs.loadMoreBtn.classList.add('is-hidden');

  const result = await newsApiService.fetchGallery();
  const { hits, total } = result;
  isShown += hits.length;

  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  onRenderGallery(hits);

  isShown += hits.length;

  if (isShown < total) {
    Notify.success(`Hooray! We found ${total} images !!!`);
    refs.loadMoreBtn.classList.remove('is-hidden');
  }

  if (isShown >= total) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
