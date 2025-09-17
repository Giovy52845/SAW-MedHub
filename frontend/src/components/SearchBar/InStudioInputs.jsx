import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './input.css';

import { getListaSanitariRicerca } from '../../api/ricerca';


export default function InStudioInputs() {
  const [citta, setCitta] = useState(null);
  const [listaSanitari, setListaSanitari] = useState([]);
  const [query, setQuery] = useState({specializzazione: "", citta: ""});

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

    const medici = listaSanitari.map((s) => ({
      type: "sanitario",
      value: s.slug,
      label: `${capitalize(s.nome)} ${capitalize(s.cognome)}`,
      uid: s.id,
    }));

    return [
      { label: "Specializzazioni", options: specializzazioni },
      { label: "Medici", options: medici },
    ];
  }, [listaSanitari]);

  const optionCitta = useMemo(() => {
    if(!listaSanitari || listaSanitari.length === 0) return [];

    const cittaSet = new Set(
      listaSanitari.map((s) => s.citta).filter(Boolean)
    );
    const citta = [...cittaSet].map((sp) => ({
      type: "citta",
      value: sp,
      label: capitalize(sp),
    }));

    return [{label: "Citta", options: citta}];
  })

  function handleChange(opt) {
    if(!opt) return;

    switch(opt.type) {
      case "sanitario":
        navigate(`sanitario/${opt.value}`);
        break;
      
      case "specializzazione":
        setQuery(prev => {
          const next = {...prev, specializzazione: opt.value};
          return next;
        });
        break;
      
      case "citta":
        setQuery(prev => {
          const next = {...prev, citta: opt.value};
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
    if(query.citta) params.set("loc", query.citta);
    params.set("modalita", "presenza")

    const url = `cerca?${params.toString()}`;

    navigate(url);
    return;
  }

  return (
    <>
      <div className="d-flex gap-2 align-items-center w-100 flex-wrap online-input">
        <div className="d-flex gap-2 flex-grow-1" style={{ minWidth: '250px' }}>
          <div className="flex-fill">
            <Select
              options={options}
              placeholder="Es. medico, specializzazione"
              isClearable
              onChange={handleChange}
              noOptionsMessage={() => "Nessun risultato trovato"}
              className="select-wrapper"
              classNamePrefix="custom-select"
            />
          </div>
          <div className="flex-fill">
            <Select
              options={optionCitta}
              placeholder="Es: Roma"
              isClearable
              onChange={handleChange}
              noOptionsMessage={() => "Nessun risultato trovato"}
              className="select-wrapper"
              classNamePrefix="custom-select"
            />
          </div>
        </div>

        <Button variant="primary" className='my-button' onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          Cerca
        </Button>
      </div>
    </>
  );
}
