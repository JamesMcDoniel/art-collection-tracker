import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useArtworkContext } from '../../hooks/useArtworkContext';
import FileUpload from '../FileUpload';
import Loading from '../Loading';
import styles from './Carousel.module.css';

const Carousel = ({
    authRole,
    title,
    images,
    onUpload,
    onDelete,
    hasChanged
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const { isLoading } = useArtworkContext();

    const scrollTo = useCallback(
        (index) => emblaApi?.scrollTo(index, true),
        [emblaApi]
    );
    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const syncState = (emblaApi) => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
            setScrollSnaps(emblaApi.scrollSnapList());
        };
        syncState(emblaApi);

        emblaApi.on('select', () => syncState(emblaApi));
        emblaApi.on('reInit', () => syncState(emblaApi));

        return () => {
            emblaApi.off('select', syncState);
            emblaApi.off('reInit', syncState);
        };
    }, [emblaApi]);

    const isCurator = authRole === 'Curator';
    const totalSlides = isCurator ? scrollSnaps.length - 1 : scrollSnaps.length;
    const showControls = isCurator ? selectedIndex < totalSlides : true;

    const currentImage = images[selectedIndex];

    const handleUpload = (e) => {
        onUpload(e);
        scrollTo(0);
    };

    return (
        <div className={styles.embla}>
            {!isLoading.upload ? (
                <div
                    className={styles.viewport}
                    ref={emblaRef}
                >
                    <div className={styles.container}>
                        {images.map((image, index) => {
                            const isNew = !image.path.startsWith('/uploads');

                            return (
                                <div
                                    key={image.path}
                                    className={`${styles.slide} ${isNew ? styles.new : ''}`.trim()}
                                >
                                    <img
                                        className={styles.image}
                                        src={image.path}
                                        alt={`Image ${index + 1} of ${images.length} - ${title}`}
                                    />
                                </div>
                            );
                        })}
                        {authRole === 'Curator' ? (
                            <div className={styles.slide}>
                                <FileUpload
                                    files={hasChanged ? ['a'] : []}
                                    onChange={handleUpload}
                                    onDrop={handleUpload}
                                    accept="image/*"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className={styles.image_loading}>
                    <Loading />
                </div>
            )}
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    <button
                        type="button"
                        onClick={scrollPrev}
                        disabled={isLoading.upload}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        disabled={isLoading.upload}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                {showControls ? (
                    <>
                        <div
                            className={`${styles.counter} ${hasChanged ? styles.new_text : ''}`.trim()}
                        >
                            {selectedIndex + 1} / {totalSlides}
                        </div>
                        {isCurator ? (
                            <div className={styles.buttons}>
                                <button
                                    className={styles.delete}
                                    onClick={() => onDelete(currentImage)}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Carousel;
