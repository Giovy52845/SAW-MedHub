import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar, faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from 'react';


import { getListaRecensioni } from '../../api/api';

import './reviews_widget.css'

export default function ReviewsWidget() {

    const [listaRecensioni, setListaRecensioni] = useState([]);


    useEffect(() => {
        getListaRecensioni()
            .then((data) => setListaRecensioni(data))
            .catch((err) => console.error("Errore: ", err));
    }, []);


    return (
        <div className='reviews col-12 col-lg-6 col-md-12'>
            <div className='reviews-title'>
                <h3>Ultime recensioni</h3>
            </div>
            {listaRecensioni.slice(0, 3).map((item) => (
            <Reviews
                key={item.id_review}
                name_doc={item.name_doc}
                img_doc={item.img_url}
                star={item.star}
                message={item.message || ''}
                author={item.nome_utente}
                slug={item.slug}
            />
            ))}
        </div>
    );
}

function Reviews( {name_doc, img_doc, star, message, author, slug} ) {
    return (
        <div className='review-card'>
            <div className='review-doc-img'>
                <Link to={"/"}>
                    <img src={img_doc} />
                </Link>
            </div>
            <div className='review-doc'>
                <div className='name-star'>
                    <Link to={`sanitario/${slug}`}>{name_doc}</Link>
                    <StarRating rating={star} />
                </div>
                <div className='review-text'>
                    <Link to={`sanitario/${slug}`} className='truncate-multiline message'>
                        {message}
                    </Link>
                    <br />
                    <Link to={`sanitario/${slug}`} className='author'>
                        {author}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const current = index + 1;
        if (rating >= current) {
          return <FontAwesomeIcon key={index} icon={fullStar} color="#00c3a5" />;
        } else if (rating >= current - 0.5) {
          return <FontAwesomeIcon key={index} icon={halfStar} color="#00c3a5" />;
        } else {
          return <FontAwesomeIcon key={index} icon={emptyStar} color="#00c3a5" />;
        }
      })}
    </div>
  );
}