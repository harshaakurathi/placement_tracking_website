// src/Slide.js
"use client";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Slide.css'

const Slide = () => {
  // Dummy image URLs for the slideshow
  const images = [
    'https://www.pvpsiddhartha.ac.in/new_images/2022-23%20placed.jpg',
    'https://www.pvpsiddhartha.ac.in/placement_icons/7_22.png',
    'https://www.pvpsiddhartha.ac.in/placement_icons/rec_icons_21_22f.png'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="slideshow">
      {Array.isArray(images) && images.length > 0 ? (
        <>
          <img src={images[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
          <button onClick={prevSlide} className="prev-button">
            &lt; Prev
          </button>
          <button onClick={nextSlide} className="next-button">
            Next &gt;
          </button>
        </>
      ) : (
        <p>No images to display</p>
      )}
    </div>
  );
};

Slide.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Slide;
