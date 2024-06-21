import React from 'react';
import './NewsScroll.css'

function NewsScroll() {
  return (
    <div className="news-container">
      <marquee className="news-scroll" direction="left" scrollamount="4">
        <div className="news-item-container">
          <div className="news-item">Placements Updated!!!!</div>
        </div>
        <div className="news-item-container">
          <div className="news-item">All the best for your carrer</div>
        </div>
        <div className="news-item-container">
          <div className="news-item">The future depends on what you do today</div>
        </div>
        {/* Add more news items as needed */}
      </marquee>
    </div>
  );
}

export default NewsScroll;
