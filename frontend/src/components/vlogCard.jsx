import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';

function VlogCard({ id, title, vlogImage }) {
    return (
        <div className='vlogCard'>
            <div className='vlogCard-image'>
                {vlogImage && <img src={vlogImage} alt={title} />}
            </div>
            <div className='vlogCard-content'>
                <h3>{title}</h3>

                <div className='vlogCard-actions'>
                    <button className='favorite-btn'>
                        <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <Link to={`/vlogpage/${id}`} className='vlog-detail'>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VlogCard;
