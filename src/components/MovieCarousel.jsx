import { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import MovieCard from './MovieCard.jsx'
import LoadMoreButton from './LoadMoreButton.jsx'
import Pagination from './Pagination.jsx'

const GROUP_SIZE = 10 // movies per pagination page (matches the Load More chunk, CLAUDE.md §6.4)

// Centered cover-flow carousel of movie posters (CLAUDE.md §6.4). Reports the
// focused (centered) movie via onFocusChange for the FocusDetailPanel below; a
// trailing slide holds the "Load More" trigger; a centered pagination strip
// lets the user jump between groups of GROUP_SIZE movies.
export default function MovieCarousel({
  movies,
  onFocusChange,
  onLoadMore,
  showLoadMore = false,
  loadingMore = false,
}) {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Clamp the index into the real-movie range so focusing the trailing
  // "Load More" slide keeps focus on the last real card, not an undefined one.
  const reportFocus = (swiper) => {
    setActiveIndex(swiper.activeIndex)
    if (!onFocusChange || !movies.length) return
    const idx = Math.min(swiper.activeIndex, movies.length - 1)
    onFocusChange(movies[idx])
  }

  // Re-sync focus when the movie list changes (e.g. a filter re-sort) without
  // a slide event firing.
  useEffect(() => {
    if (movies.length && onFocusChange) {
      const idx = swiperRef.current?.activeIndex ?? 0
      onFocusChange(movies[Math.min(idx, movies.length - 1)] || movies[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies])

  const pageCount = Math.ceil(movies.length / GROUP_SIZE)
  const activePage = Math.floor(Math.min(activeIndex, movies.length - 1) / GROUP_SIZE)

  const jumpToPage = (page) => {
    swiperRef.current?.slideTo(Math.min(page * GROUP_SIZE, movies.length - 1))
  }

  return (
    <>
      <Swiper
        modules={[EffectCoverflow, Navigation, Keyboard]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        spaceBetween={8}
        navigation
        keyboard={{ enabled: true }}
        // Scaled-down coverflow on phones; restored to the full 3D depth/rotate
        // from the sm breakpoint up (Swiper breakpoints override top-level opts).
        coverflowEffect={{ rotate: 18, stretch: 0, depth: 90, modifier: 1, slideShadows: false }}
        breakpoints={{
          640: { coverflowEffect: { rotate: 28, stretch: 0, depth: 160, modifier: 1, slideShadows: false } },
        }}
        className="movie-swiper w-full"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          reportFocus(swiper)
        }}
        onSlideChange={reportFocus}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} style={{ width: 'clamp(150px, 60vw, 230px)' }}>
            <MovieCard movie={movie} />
          </SwiperSlide>
        ))}

        {showLoadMore && (
          <SwiperSlide style={{ width: 'clamp(150px, 60vw, 230px)' }}>
            <div className="flex aspect-[2/3] items-center justify-center rounded-squircle glass">
              <LoadMoreButton onClick={onLoadMore} loading={loadingMore} />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <Pagination
        pageCount={pageCount}
        activePage={activePage}
        onJump={jumpToPage}
        groupSize={GROUP_SIZE}
      />
    </>
  )
}
