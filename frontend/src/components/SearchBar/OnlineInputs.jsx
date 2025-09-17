import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import MyAllert from '../Allert/MyAllert.jsx'
import { getListaSanitariRicerca } from '../../api/ricerca.js';


import './input.css'
import { useNavigate } from 'react-router-dom';

export default function OnlineInputs() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [query, setQuery] = useState({specializzazione: ""});
  const [listaSanitari, setListaSanitari] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getListaSanitariRicerca()
      .then((data) => setListaSanitari(data))
      .catch((err) => console.error("Errore nella ricerca dei sanitari: ", err));
  }, []);

  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  const options = useMemo(() => {
    if (!listaSanitari || listaSanitari.length === 0) return [];

    const specSet = new Set(
      listaSanitari.map((s) => s.specializzazione).filter(Boolean)
    );
    const specializzazioni = [...specSet].map((sp) => ({
      type: "specializzazione",
      value: sp,
      label: capitalize(sp),
    }));

    return [
      { label: "Specializzazioni", options: specializzazioni },
    ];
  }, [listaSanitari]);

  function handleChange(opt) {
    if(!opt) return;

    switch(opt.type) {
      case "specializzazione":
        setQuery(prev => {
          const next = {...prev, specializzazione: opt.value};
          return next;
        });
        break;

      default:
        break;
    }

    return;
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if(query.specializzazione) params.set("q", query.specializzazione);
    params.set("modalita", "online")

    const url = `cerca?${params.toString()}`;

    navigate(url);

    return;
  }


  const handleOnlineInfo = () => {
    setShowAlert(true);
  };

  return (
    <>
      <div className="d-flex gap-2 align-items-center w-100 flex-wrap online-input">
        <div style={{ flexGrow: 1, minWidth: '250px' }}>
          <Select
              options={options}
              placeholder="Scegli specializzazione"
              isClearable
              onChange={handleChange}
              noOptionsMessage={() => "Nessun risultato trovato"}
              className="select-wrapper"
              classNamePrefix="custom-select"
          />
        </div>
          <Button variant="primary" className='my-button' onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Cerca
          </Button>
      </div>
      <div className='info-online'>
        <p onClick={() => setShowAlert(true)} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faCircleInfo} className="me-2" />
          Cos'è la consulenza online?
        </p>
      </div>

      {showAlert && (
        <MyAllert
          title="Cos'è la consulenza online?"
          testo="La consulenza online ti permette di consultare un professionista sanitario da remoto. Facilmente, da casa."
          onClose={() => setShowAlert(false)}
        />
      )}

    </>
  );
}
