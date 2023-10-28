import React, { useState, useEffect } from 'react';

const PhotoSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const searchPhotos = async () => {
    const URL = `https://api.unsplash.com/search/photos?&page=${page}&query=${searchText}&client_id=${process.env.REACT_APP_API_KEY}`;

    try {
      setLoading(true);
      const response = await fetch(URL);
      const data = await response.json();
      console.log('loading-123123', loading);

      setPhotos((prevPhotos) => {
        const uniquePhotoIds = new Set(prevPhotos.map((photo) => photo.id));
        const filteredData = data.results.filter(
          (newPhoto) => !uniquePhotoIds.has(newPhoto.id)
        );

        return [...prevPhotos, ...filteredData];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPhotos([]);
    setPage(1);
    searchPhotos();
  };
  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      searchPhotos();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div>
      <div className='search-bar'>
        <input
          type="text"
          placeholder="Enter a photo name"
          className='search-input'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleEnterKey}
        />
        <button className='search-btn' onClick={handleSearch}>Search</button>
      </div>
      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className='item'>
            <img src={photo.urls.small} alt={photo.alt_description} loading="lazy" />
          </div>
        ))}
      </div>
      {loading &&
        <div className='loader'>
          <div className="loader-1">
            <div className="loader-2"></div>
            <div className="loader-3"></div>
            <div className="loader-4"></div>
          </div>
        </div>}
    </div>
  );
};

export default PhotoSearch;
