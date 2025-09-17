
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import './QuestionLast30Days.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getListaDomande } from '../../api/api';

export default function QuestionLast30Days(){

    const [listaDomande, setListaDomande] = useState([]);

    useEffect(() => {
        const unsubscribe = getListaDomande((data) => {
            setListaDomande(Array.isArray(data) ? data : []);
        });

        return () => {
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    return (
        <div className='question-last-days'>
            <div>
                <h3>Ultime domande pubblicate </h3>
            </div>
            <hr />
            {listaDomande.length === 0 ? (
                <div className='last-days__no-domande'>
                    <p>Al momento non ci sono domande</p>
                </div>
                ) : (
                listaDomande
                    .slice()
                    .sort((a, b) => new Date(b.dataDomanda) - new Date(a.dataDomanda))
                    .slice(0, 3)
                    .map((item) => {
                    const first = item?.risposte?.[0] ?? null;
                        return (
                        <QuestionCard
                            key={item.idDomanda}
                            id_answer={item.idDomanda}
                            request_user={item.testoDomanda}
                            answer_doc={first?.risposta ?? null}
                            img_url={first?.fotoProfilo ?? null}
                            doc_name={first?.nomeCognome ?? null}
                            doc_spec={first?.spec ?? null}
                            doc_slug={first?.slug ?? null}
                        />
                    );
                })
            )}
        </div>
    );
}


function QuestionCard({id_answer, request_user, answer_doc, img_url, doc_name, doc_spec, doc_slug}){

    const navigate = useNavigate();
    return (
        <div className='row question-chats'>
            <div className='col-lg-12 chat-box-user h-100'>
                <Link to={`/domande-risposte/${id_answer}`}>
                    <p className='truncate-multiline'>{request_user}</p>
                </Link>
            </div>
            {answer_doc === null ? (
                <p className="text-secondary fst-italic bg-light p-2 rounded text-center">
                    Non ci sono ancora risposte per questa domanda
                </p>
            ) : (
                <>
                <div className='col-lg-9 chat-box-doc h-100'>
                    <Link to={`/domande-risposte/${id_answer}`}>
                        <p className='truncate-multiline'>{answer_doc}</p>
                    </Link>
                </div>
                <div className='col-lg-3'>
                    <div className=' chat-doc'>
                        <div className='chat-doc-img'>
                            <img src={img_url} onClick={() => navigate(`sanitario/${doc_slug}`)}/>
                        </div>
                        <div className='chat-doc-info'>
                            <Link to={`sanitario/${doc_slug}`}><h6>{doc_name}</h6></Link>
                            <p>{doc_spec}</p>
                        </div>
                    </div>
                </div>
                </>
            )
            }
            <hr />
        </div>
    );
}