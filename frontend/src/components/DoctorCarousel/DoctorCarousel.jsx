import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

import { Link } from 'react-router-dom'
import { getListaSanitari } from '../../api/api';

import './DoctorCarousel.css';
import { useEffect, useState } from 'react';


export default function DoctorCarousel() {

  const [listaSanitari, setListaSanitari] = useState([]);

  useEffect(() => {
    getListaSanitari()
      .then((data) => setListaSanitari(data))
      .catch((err) => console.error("Errore: ", err));
  }, [])
  
  return (
    <div className='carousel-container'>
        <h3>Nuovi profili</h3>
        <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={3} // valore di default (desktop)
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
                0: { slidesPerView: 1 },     // smartphone
                768: { slidesPerView: 3 },   // tablet e oltre
            }}
            className='card-div'
        >
            {listaSanitari.map((profile, index) => (
                <SwiperSlide key={index}>
                  <DoctorCard name={`${profile.nome[0].toUpperCase() + profile.nome.slice(1)} ${profile.cognome[0].toUpperCase() + profile.cognome.slice(1)}`} 
                              title={profile.specializzazione[0].toUpperCase() + profile.specializzazione.slice(1)}
                              location={profile.citta[0].toUpperCase() + profile.citta.slice(1)}
                              img = {profile.fotoProfiloURL}
                              slug={profile.slug}
                  />
                </SwiperSlide>
            ))}
        </Swiper>
    </div>
  );
}

function DoctorCard({ name, title, location, img, slug }) {
  return (
    <div className="card-custom">
      <img src={img} alt={name} className="photo" />
      <div className="info">
        <h5>{name}</h5>
        <p>{title}, {location}</p>
        <Link to={`/sanitario/${slug}`}>Mostra profilo</Link>
      </div>
    </div>
  );
}
